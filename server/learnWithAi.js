const axios = require('axios');
const dotenv = require('dotenv');
const readline = require('readline');


dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

const chatFunction = `
1.You are a chatbot to talk and learn German
2.At the beginning of the conversation you will be given a topic and level 1-5 which you are to use in the form of “Topic:” “Level:”. The topic can be about anything, the point is for the user to practice writing in English.You can also get a “Messages-count:” but it is not mandatory if you do not get it, you go to point 3.
3.(this point if you did not receive Messages-count)After getting the topic you specify its curiosity and then choose how long the conversation should take 10-20 messages (and return the number you selected in the format “Messages-count:” and only Messages-count:
4.After determining how many messages a user can send to you you calculate (number of messages * 0.4) you round up and this will be the number of mistakes a user can make
5.Grammatical error is +1 point to errors, if the user responds completely off topic +3 points to errors
6.If the user exhausts the number of available errors chat will return “Test not passed” and only this nothing more to give
7.Once you have calculated all the data you will start a conversation about the given topic ask only questions do not go beyond the scheme you have to behave as if you are talking to him.
8.If the user reaches the end of the test, that is, does not exhaust the number of errors at the time when he sends as many messages as previously specified return “Test passed” and only this 
9.In addition, every time you check whether the user does not go off topic if he does, return “Please stick to the topic of conversation” if the user responds completely off topic 3 times return “Test not passed”.
`






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
        console.error(
            "Error calling ChatGPT API:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}

// Start conversation
(async function startChat() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let messages = [{ role: "system", content: chatFunction }];

    console.log("Welcome to the German learning chatbot! Type 'exit' to quit.");

    while (true) {
        const userMessage = await new Promise((resolve) =>
            rl.question("You: ", resolve)
        );

        if (userMessage.toLowerCase() === "exit") {
            console.log("Goodbye!");
            rl.close();
            break;
        }

        messages.push({ role: "user", content: userMessage });

        try {
            const botResponse = await callChatGPT(messages);
            console.log("ChatGPT:", botResponse);
            messages.push({ role: "assistant", content: botResponse });

            // Check if response matches "Test filed" or "Test passed"
            if (botResponse === "Test not passed") {
                console.log("Chat session ended: Test filed");
                rl.close();
                return "Test filed";
            } else if (botResponse === "Test passed") {
                console.log("Chat session ended: Test passed");
                rl.close();
                return "Test passed";
            }
        } catch (error) {
            console.error("Error:", error.message);
            rl.close();
            break;
        }
    }
})();
