import OpenAI from "openai";
import fs from "fs/promises";
import { config } from 'dotenv'
config();
const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });


extractFile().then(async text => {
    try {
        if (text.length < 1000) {
            console.log(text)
            throw new Error
        }
        let results = await main(text)
        console.log(results)
    } catch (error) {
        console.log(error)
    }

})
async function extractFile() {
    let text = await fs.readFile("/Users/malcolm/Documents/Documents - Malcolm’s MacBook Pro/MyProjects/QuoteFinder3/test.txt", "utf8");
    return text
}


async function main(text) {
    const instructions = "you are a ai that finds quotes of provided theme from a provided text. you will only responds with a list of quotes from the text provided. If you can not find quotes please respond with an empty string. please put your response in an array."

    try {
        const assistant = await openai.beta.assistants.create({
            name: "quote finder",
            instructions: instructions,
            model: "gpt-4o-mini",
        })

        const whatToLookFor = "quotes of Holden showing prolonged sadness. :"

        const thread = await openai.beta.threads.create({
            messages: [{
                "role": "user",
                "content": whatToLookFor + text,
            }]
        })

        const runAssistant = await openai.beta.threads.runs.create(
            thread.id,
            { assistant_id: assistant.id }
        );

        console.log(runAssistant)

        return new Promise((resolve, reject) => {

            const checkStatusandPrintMessage = async (threadId, runId) => {
                try {
                    let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId)
                    if (runStatus.status === "completed") {
                        let messages = await openai.beta.threads.messages.list(threadId)
                        messages.data.forEach((msg) => {
                            const role = msg.role
                            const content = msg.content[0].text.value
                            console.log(
                                // `${role.charAt(0).toUpperCase() + role.slice(1)}:         ${content}`
                                "response made"
                            )
                        })
                        const resp = messages.data.filter(msg => msg.role === 'assistant') // Filter for assistant responses
                            .map(msg => msg.content[0].text.value);
                        resolve(resp);
                    }
                    else {
                        console.log(`run is not compleated yet + ${runStatus.status}`)
                        resolve(null);

                        // console.log(runStatus)
                    }
                } catch (error) {
                    reject(error); // Reject on checkStatus error

                }
            }

            setTimeout(() => {
                checkStatusandPrintMessage(thread.id, runAssistant.id)
            }, 40000)


        })

    } catch (error) {
        console.log(error)
    }
}




// async function main(text) {
//     try {
//         const completion = await openai.chat.completions.create({
//             messages: [
//                 // { "role": "system", "content": "you are a ai that finds quotes of provided theme from a provided text. you will only responds with a list of quotes from the text provided. If you can not find quotes please respond with an empty string. please put your response in an array." },
//                 { "role": "system", "content": "you are an ai that makes jokes about the text provided" },

//                 { "role": "user", "content": text },
//             ],
//             model: "gpt-4o-mini",
//         });

//         return completion.choices[0];

//     } catch (error) {
//         console.log(error)
//     }

// }
// main();