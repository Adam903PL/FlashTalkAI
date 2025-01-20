const axios = require('axios');
const dotenv = require('dotenv');
const WebSocket = require('ws');
const { Pool } = require('pg');


dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;

const pool = new Pool({
    user: 'flashtalkai_user',
    host: 'dpg-csn4nc0gph6c73ft3neg-a.frankfurt-postgres.render.com',
    database: 'flashtalkai',
    password: 'HgFSozb5BSqc6EZDDau4uJy0gLV9uPTU',
    port: 5432,
    ssl: { rejectUnauthorized: false }
});

const server = new WebSocket.Server({ port: 8080 });

const offensiveWords = [
    "fuck",
    "shit",
    "bitch",
    "asshole",
    "damn",
    "bastard",
    "dick",
    "cock",
    "pussy",
    "motherfucker",
    "slut",
    "whore",
    "cunt",
    "prick",
    "fag",
    "gay",
    "retard",
    "douchebag",
    "shithead",
    "jackass",
    "twat",
    "wanker",
    "arsehole",
    "bloody",
    "freaking",
    "hell",
    "sonofabitch",
    "dickhead",
    "dipshit",
    "asswipe",
    "stupid",
    "imbecile",
    "moron",
    "scumbag",
    "loser",
    "scrotum",
    "testicles",
    "cum",
    "semen",
    "tits",
    "boobs",
    "dildo",
    "pimp",
    "prostitute",
    "rape",
    "pedophile",
    "orgasm",
    "vulgar",
    "fucking",
    "shitface",
    "goddamn",
    "asscrack",
    "cockroach",
    "cockblock",
    "kurwa",
    "chuj",
    "jebany",
    "skurwiel",
    "debil",
    "idiota",
    "dupek",
    "szmata",
    "cipa",
    "pedał",
    "skurwysyn",
    "kurwiszon",
    "ruchadło",
    "gówniarz",
    "matole",
    "ciota",
    "dno",
    "pryk",
    "kutas",
    "rzygacz",
    "pizda",
    "pedałek",
    "zajebany",
    "kurwa mać",
    "jebło",
    "chujnia",
    "osioł",
    "frajer",
    "ścierwo",
    "głupol",
    "spierdalaj",
    "żul",
    "wkurwiony",
    "pierdole",
    "wypierdalaj"
    
  ]
  
function containsOffensiveLanguage(message) {
    return offensiveWords.some((word) => message.toLowerCase().includes(word));
}

async function callChatGPT(messages) {
    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${apiKey}`,
    };

    const data = {
        model: "gpt-4",
        messages: messages,
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error calling ChatGPT API:", error.response ? error.response.data : error.message);
        throw error;
    }
}

server.on("connection", (socket) => {
    console.log("Client connected");

    let messagesCount = 0;
    let errors = 0;
    let conversationHistory = [];

    socket.on("message", async (data) => {
        const message = JSON.parse(data.toString("utf-8"));

        if (message.type === "topic") {
            try {
                const client = await pool.connect();
                const query = "SELECT topicdescription FROM learn_ai_topics WHERE topicid = $1";
                const values = [message.topic.lesson];
                const responseDB = await client.query(query, values);
                client.release();

                if (responseDB.rows.length === 0) {
                    socket.send(JSON.stringify({ error: "No topic found for this ID" }));
                    return;
                }

                const topicDescription = responseDB.rows[0].topicdescription;

                const chatFunction = `
                    You are a chatbot that initiates a German learning test.
                    1. The user provides a topic.
                    2. Determine "Messages_count" (number of messages for the conversation between 5 and 15).
                    3. Calculate "Errors" as Messages_count * 0.4, rounded up.
                    4. Return the Messages_count and Errors in the format:
                       Messages_count: {number}
                       Errors: {number}
                       Question: {first question in German}.
                    5. Only provide the above data, without extra explanation.
                `;

                const messages = [{ role: "assistant", content: chatFunction }, { role: "user", content: `Topic: ${topicDescription}` }];
                const botResponse = await callChatGPT(messages);

                const match = botResponse.match(/Messages_count:\s*(\d+)\s*Errors:\s*(\d+)/);
                if (match) {
                    messagesCount = parseInt(match[1], 10);
                    errors = parseInt(match[2], 10);
                }

                conversationHistory.push(`Question: ${botResponse.split("Question: ")[1]}`);
                socket.send(JSON.stringify({ message: botResponse, maker: "FlashAI" }));
            } catch (error) {
                console.error("Error fetching topic or calling ChatGPT:", error);
            }
        } else if (message.type === "message") {

            if (message.message === "AdminAnswer") {
                socket.send(JSON.stringify({ message: "Test passed", maker: "FlashAI" }));
                return;
            }

            // Sprawdzanie, czy użytkownik jest off-topic
            const chatFunction = `
                You are a chatbot that continues a German learning conversation.
                1. Receive the user's most recent answer and evaluate it:
                   - Add 1 to Errors if the answer contains a grammatical mistake.
                   - Add 3 to Errors if the answer is off-topic.
                2. Always ensure the conversation sticks to the topic. If the user's response is off-topic, return:
                   "Please stick to the topic of conversation."
                3. Use the history of the conversation (previous questions) to generate a new, related question in German.
                4. Respond in the format:
                   Errors_counter: {number}
                   Question: {new question based on the conversation history}.
                5. If Errors reaches 0, return only "Test not passed".
                6. If Messages_count reaches 0 and Errors > 0, return only "Test passed".
            `;

            const messages = [
                { role: "assistant", content: chatFunction },
                { role: "user", content: `Previous conversation history: ${conversationHistory.join(" ")}` },
                { role: "user", content: message.message }
            ];

            try {
                const botResponse = await callChatGPT(messages);
                const match = botResponse.match(/Errors_counter:\s*(\d+)\s*Question:\s*(.+)/);
                if (match) {
                    const errorsCounter = parseInt(match[1], 10);
                    const nextQuestion = match[2];

                    errors -= errorsCounter;
                    messagesCount--;

                    if (errors <= 0) {
                        socket.send(JSON.stringify({ message: "Test not passed", maker: "FlashAI" }));
                    } else if (messagesCount === 0 && errors > 0) {
                        socket.send(JSON.stringify({ message: "Test passed", maker: "FlashAI" }));
                    } else {
                        conversationHistory.push(nextQuestion);
                        socket.send(JSON.stringify({
                            message: `Messages_count: ${messagesCount}, Errors: ${errors}, Question: ${nextQuestion}`,
                            maker: "FlashAI"
                        }));
                    }
                } else {
                    console.error("Failed to parse bot response:", botResponse);
                }
            } catch (error) {
                console.error("Error processing message:", error);
            }
        }
    });

    socket.on("close", () => {
        console.log("Connection closed");
    });
});

console.log("Server listening on port 8080");