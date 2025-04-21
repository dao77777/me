import { streamText, tool } from "ai";
import { customAI } from "./custom-ai-provider";
import { z } from "zod";
import { createResource, findRelevantContent } from "./embedding";

export const handlers = {
  GET: async (req: Request) => {},
  POST: async (req: Request) => {
    console.log('[Chat] LLM request start');
    const { messages } = await req.json();
    console.debug(messages);
    // (messages as any[]).forEach((i: any) => console.log(i.experimental_attachments));
    const result = streamText({
      model: customAI("glm-4v-plus-0111"),
      messages,
      // temperature: 0.,
      maxSteps: 10,
    //   system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    // Only respond to questions using information from tool calls.
    // if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
      tools: {
        // getLocation: tool({
        //   description: `Query the user's location based on their IP address.`,
        //   parameters: z.object({
        //     ip: z.string().describe('The IP address of the user.'),
        //   }),
        //   execute: async ({ ip }) => {
        //     try {
        //       // 使用一个免费的 IP 地理位置 API，例如 ip-api.com
        //       const response = await fetch(`http://ip-api.com/json/${ip}`);
        //       const data = await response.json();
        //       if (data.status === 'success') {
        //         return {
        //           city: data.city,
        //           region: data.regionName,
        //           country: data.country,
        //         };
        //       } else {
        //         throw new Error('Failed to retrieve location information.');
        //       }
        //     } catch (error) {
        //       return { error: 'Unable to determine location. Please provide a valid IP address.' };
        //     }
        //   },
        // }),
        // getWeather: tool({
        //   description: `Query the weather for a specific location.`,
        //   parameters: z.object({
        //     city: z.string().describe('The name of the city to query the weather for.'),
        //   }),
        //   execute: async ({ city }) => {
        //     try {
        //       // 使用 OpenWeatherMap API（需要 API 密钥）
        //       const apiKey = process.env.OPENWEATHER_API_KEY; // 确保在环境变量中设置 API 密钥
        //       const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        //       const data = await response.json();
        //       if (data.cod === 200) {
        //         return {
        //           temperature: data.main.temp,
        //           description: data.weather[0].description,
        //           humidity: data.main.humidity,
        //         };
        //       } else {
        //         throw new Error(data.message || 'Failed to retrieve weather information.');
        //       }
        //     } catch (error) {
        //       return { error: 'Unable to retrieve weather information. Please provide a valid city name.' };
        //     }
        //   },
        // }),
        // addResource: tool({
        //   description: `add a resource to your knowledge base.
        //   If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        //   parameters: z.object({
        //     content: z
        //       .string()
        //       .describe('the content or resource to add to the knowledge base'),
        //   }),
        //   execute: async ({ content }) => createResource({ content }),
        // }),
        // getInformation: tool({
        //   description: `get information from your knowledge base to answer questions.`,
        //   parameters: z.object({
        //     question: z.string().describe('the users question'),
        //   }),
        //   execute: async ({ question }) => findRelevantContent(question),
        // }),
        // calculate: tool({
        //   description: `Perform basic arithmetic operations (addition, subtraction, multiplication, division).`,
        //   parameters: z.object({
        //     expression: z.string().describe('The arithmetic expression to evaluate, e.g., "2 + 2" or "10 / 5".'),
        //   }),
        //   execute: async ({ expression }) => {
        //     try {
        //       // Use `eval` to evaluate the expression safely
        //       const result = eval(expression);
        //       if (typeof result === 'number') {
        //         return { result };
        //       } else {
        //         throw new Error('Invalid expression');
        //       }
        //     } catch (error) {
        //       return { error: 'Failed to evaluate the expression. Please provide a valid arithmetic expression.' };
        //     }
        //   },
        // }),
      },
      onChunk: (chunk) => {
        // console.log('[Chat] chunk');
        // console.log('[Chat] ', chunk);
      },
      onError: (error) => {
        // console.log('[Chat] error');
        // console.error('[Chat] ', error);
      },
      onFinish: (result) => {
        // console.log('[Chat] Finish');
        // console.log('[Chat] ', result);
      },
      onStepFinish: (step) => {
        // console.log('[Chat] Step Finish');
        // console.log('[Chat] ', step);
      }
    });

    console.log('[Chat] LLM stream start');
    return result.toDataStreamResponse();
  }
};