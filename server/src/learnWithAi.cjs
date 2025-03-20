const axios = require('axios');
const dotenv = require('dotenv');
const WebSocket = require('ws');
const { Pool } = require('pg');
const { ENV } = require('../../src/config/env.cjs');

dotenv.config();
const apiKey = ENV.API.OPENAI_API_KEY;

// Initialize database connection
const pool = new Pool({
    user: ENV.DATABASE.DB_USER,
    host: ENV.DATABASE.DB_HOST,
    database: ENV.DATABASE.DB_DATABASE,
    password: ENV.DATABASE.DB_PASSWORD,
    port: ENV.DATABASE.DB_PORT || 5432,
    ssl: { rejectUnauthorized: ENV.SSL.REJECT_UNAUTHORIZED }
});

// Initialize WebSocket server
const server = new WebSocket.Server({ port: 8080 });

// Offensive words list
const offensiveWords = [
    "fuck", "shit", "bitch", "asshole", "damn", "bastard", "dick", "cock", "pussy",
    // ... other offensive words ...
];

// Function to check if message contains offensive language
function containsOffensiveLanguage(message) {
    return offensiveWords.some((word) => message.toLowerCase().includes(word));
}

// Function to call language model API
async function callLanguageModelAPI(messages) {
    const url = "https://api.deepseek.com/v1/chat/completions";
    const headers = {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${apiKey}`,
    };

    const data = {
        model: "deepseek-chat",  
        messages: messages,
    };

    try {
        const response = await axios.post(url, data, { headers });
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Error calling DeepSeek API:", error.response ? error.response.data : error.message);
        throw error;
    }
}

// Client connections handler
server.on("connection", (socket) => {
    console.log("Client connected");

    let messagesCount = 0;
    let errors = 0;
    let conversationHistory = [];
    let topicDescription = "";

    // Ping/Pong to keep connection alive
    const pingInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.ping();
        }
    }, 30000);

    // Handle incoming messages
    socket.on("message", async (data) => {
        try {
            const message = JSON.parse(data.toString("utf-8"));

            // Topic initialization
            if (message.type === "topic") {
                try {
                    // Get topic description from database
                    const client = await pool.connect();
                    const query = "SELECT topicdescription FROM learn_ai_topics WHERE topicid = $1";
                    const values = [message.topic.lesson];
                    const responseDB = await client.query(query, values);
                    client.release();

                    if (responseDB.rows.length === 0) {
                        socket.send(JSON.stringify({ 
                            message: "No topic found for this ID. Please try a different topic.", 
                            maker: "FlashAI" 
                        }));
                        return;
                    }

                    topicDescription = responseDB.rows[0].topicdescription;
                    
                    // Generate initial test parameters
                    const chatFunction = `
                        You are a chatbot that initiates a German learning test.
                        1. The user provides a topic: "${topicDescription}".
                        2. Determine "Messages_count" (number of messages for the conversation between 5 and 15).
                        3. Calculate "Errors" as Messages_count * 0.4, rounded up.
                        4. Return the Messages_count and Errors in the format:
                           Messages_count: {number}
                           Errors: {number}
                           Question: {first question in German related to the topic}.
                        5. Only provide the above data, without extra explanation.
                    `;

                    const messages = [{ role: "system", content: chatFunction }];
                    const botResponse = await callLanguageModelAPI(messages);

                    // Parse the response
                    const match = botResponse.match(/Messages_count:\s*(\d+)\s*Errors:\s*(\d+)/);
                    if (match) {
                        messagesCount = parseInt(match[1], 10);
                        errors = parseInt(match[2], 10);
                    }

                    const questionMatch = botResponse.match(/Question:\s*(.+)/s);
                    const question = questionMatch ? questionMatch[1].trim() : "Wie geht es dir?";
                    
                    conversationHistory.push(`Question: ${question}`);
                    
                    socket.send(JSON.stringify({ 
                        message: `Messages_count: ${messagesCount}, Errors: ${errors}, Question: ${question}`, 
                        maker: "FlashAI" 
                    }));
                } catch (error) {
                    console.error("Error fetching topic or calling API:", error);
                    socket.send(JSON.stringify({ 
                        message: "An error occurred while setting up the test. Please try again.", 
                        maker: "FlashAI" 
                    }));
                }
            } 
            // Handle user messages
            else if (message.type === "message") {
                // Admin override
                if (message.message === "AdminAnswer") {
                    socket.send(JSON.stringify({ message: "Test passed", maker: "FlashAI" }));
                    return;
                }

                // Check for offensive language
                if (containsOffensiveLanguage(message.message)) {
                    socket.send(JSON.stringify({ 
                        message: "Please avoid using offensive language during the lesson.", 
                        maker: "FlashAI" 
                    }));
                    return;
                }

                // Evaluate user response
                const chatFunction = `
                    You are a chatbot that continues a German learning conversation about "${topicDescription}".
                    1. Receive the user's most recent answer: "${message.message}"
                    2. Evaluate the answer:
                       - Add 1 to Errors if the answer contains a grammatical mistake.
                       - Add 3 to Errors if the answer is off-topic.
                    3. If the answer is off-topic, let the user know politely.
                    4. Use the history of the conversation (previous questions: ${conversationHistory.join(" ")}) to generate a new, related question in German.
                    5. Respond in the format:
                       Errors_counter: {number}
                       Question: {new question based on the conversation history}.
                `;

                try {
                    const botResponse = await callLanguageModelAPI([{ role: "system", content: chatFunction }]);
                    
                    // Parse response
                    const match = botResponse.match(/Errors_counter:\s*(\d+)\s*Question:\s*(.+)/s);
                    if (match) {
                        const errorsCounter = parseInt(match[1], 10);
                        const nextQuestion = match[2].trim();

                        errors -= errorsCounter;
                        messagesCount--;

                        // Determine test status
                        if (errors <= 0) {
                            socket.send(JSON.stringify({ message: "Test not passed", maker: "FlashAI" }));
                        } else if (messagesCount <= 0 && errors > 0) {
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
                        socket.send(JSON.stringify({
                            message: "I couldn't understand your response. Let's continue with a new question.",
                            maker: "FlashAI"
                        }));
                    }
                } catch (error) {
                    console.error("Error processing message:", error);
                    socket.send(JSON.stringify({
                        message: "An error occurred while processing your message. Please try again.",
                        maker: "FlashAI"
                    }));
                }
            }
        } catch (error) {
            console.error("Error parsing message:", error);
            socket.send(JSON.stringify({
                message: "There was an error processing your message. Please try again.",
                maker: "FlashAI"
            }));
        }
    });

    // Handle connection close
    socket.on("close", () => {
        console.log("Connection closed");
        clearInterval(pingInterval);
    });

    // Handle errors
    socket.on("error", (error) => {
        console.error("WebSocket error:", error);
        clearInterval(pingInterval);
    });
});

console.log("Server listening on port 8080");