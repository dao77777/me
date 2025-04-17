import '../envConfig';
import { OpenAI } from 'openai'

beforeAll(() => {
})

const OPEN_AI_TIME_OUT = 20000

describe('OpenAI', () => {
    test('should return a response', async () => {
        let inMemory = 1

        console.log(`count: ${inMemory++}, ${process.env.DEEP_SEEK_API_KEY}`)
        const openai = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: process.env.DEEPSEEK_API_KEY
        })

        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: '告诉我今天的是几月几日, 适合干什么?' }
            ],
            model: "deepseek-chat",
        });

        console.log(completion.choices[0].message);
    }, OPEN_AI_TIME_OUT)
})

