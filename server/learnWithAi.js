const axios = require("axios");
const dotenv = require("dotenv");
const readline = require("readline");
const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });

dotenv.config();
const apiKey = process.env.OPENAI_API_KEY;

const chatFunction = `
1 You are a chatbot that talks and learns German.
2.At the beginning of the conversation, you will be given a topic and level 1-5, which you are to use in the form of “Topic:” “Level:”. The topic can be about anything, the idea is for the user to practice writing in English.
3.When you receive a topic, you determine its curiosity, and then choose how long you want the conversation to last (10-20 messages). Return “Messages-count:” followed by the number of messages.
4. calculate (number of messages * 0.4) rounded up, and this will be the number of errors the user can make.
5. grammatical error is +1 point to errors, if the user responds completely off topic +3 points to errors.
6.If the user exhausts the number of available errors, the chat will return “Test failed” and nothing more.
7.After calculating the errors, start a conversation on the topic, ask only questions.
8. if the user reaches the end of the test, return “Test passed”.
9. check if the user sticks to the topic, return “Please stick to the topic of conversation” if not. If the user goes off topic 3 times, return “Test not passed”.
10. only in the first answer you have to give the basic information such as messages-count and how many mistakes the user can make, and then you have to send only the question to which the user has opd nothing more question to the user and ask questions in German.
`;

async function callChatGPT(messages) {
    const url = "https://api.openai.com/v1/chat/completions";
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
    };

    const data = {
        model: "gpt-4",
        messages: messages,
    };

    try {
        const response = await axios.post(url, data, { headers });
        const result = response.data.choices[0].message.content;
        const usage = response.data.usage;
        console.log(`Tokens used: ${usage.total_tokens} (Prompt: ${usage.prompt_tokens}, Completion: ${usage.completion_tokens})`);
        return result;
    } catch (error) {
        console.error("Error calling ChatGPT API:", error.response ? error.response.data : error.message);
        throw error;
    }
}

server.on("connection", (socket) => {
    console.log("Połączono");

    let messages = [{ role: "system", content: chatFunction }];
    
    socket.on("message", async (data) => {
        const message = JSON.parse(data.toString("utf-8"));
        console.log("Wiadomość po konwersji:", message);

        if (message.type === "topic") {
            console.log("Conversaton topic:", message.topic);

            // Send the topic to the ChatGPT system
            messages.push({ role: "user", content: `Topic: ${message.topic}` });
            const botResponse = await callChatGPT(messages);
            const response = { message: botResponse, maker: "FlashAI" };
            socket.send(JSON.stringify(response));

        } else if (message.type === "message") {
            // Forward the user message to ChatGPT
            messages.push({ role: "user", content: message.message });
            const botResponse = await callChatGPT(messages);
            const response = { message: botResponse, maker: "FlashAI" };
            socket.send(JSON.stringify(response));
        }
    });

    socket.on("close", () => {
        console.log("Połączenie zamknięte");
    });
});

server.on("listening", () => {
    console.log("Serwer nasłuchuje na porcie 8080");
});
