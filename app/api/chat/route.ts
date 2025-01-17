import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { checkUserApiLlimit, increateApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "nodejs";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { messages, chatId, isCode } = body;

        if (!messages || messages.length === 0) {
            return new NextResponse("Message is required", { status: 400 });
        }

        const userMessage = messages[messages.length - 1];

        if (!userMessage || typeof userMessage.content !== "string") {
            return new NextResponse("Invalid message format", { status: 400 });
        }

        // Modify prompts/messages to include legal context
        const legalContext = "In the context of Indian law, ";
        const legalMessages = messages.map((message) => ({
            ...message,
            content: legalContext + message.content,
        }));

        const [freeTrial, isPro] = await Promise.all([checkUserApiLlimit(), checkSubscription()]);

        if (!freeTrial && !isPro) {
            return new NextResponse("Free Trial Exhausted", { status: 403 });
        }

        let id: string | null = null;

        if (chatId && typeof chatId === "string") {
            const chat = await prisma.chat.findUnique({
                where: {
                    id: chatId,
                    userId: userId,
                },
            });

            if (chat) {
                if (chat.title === "") {
                    await prisma.chat.update({
                        where: {
                            id: chat.id,
                        },
                        data: {
                            isCode,
                            title: userMessage.content.substring(0, 50),
                        },
                    });
                }
                id = chat.id;
            }
        }

        if (!id) {
            const newChat = await prisma.chat.create({
                data: {
                    userId: userId,
                    isCode,
                    title: userMessage.content.substring(0, 50),
                },
            });

            id = newChat.id;
        }

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: legalMessages,
            stream: true,
        });

        await increateApiLimit();

        const stream = OpenAIStream(response, {
            onCompletion: async (completion) => {
                await prisma.message.createMany({
                    data: [
                        {
                            content: userMessage.content,
                            role: userMessage.role,
                            chatId: id!,
                        },
                        {
                            content: completion || "",
                            role: "assistant",
                            chatId: id!,
                        },
                    ],
                });

                await prisma.chat.update({
                    where: {
                        id: id!,
                    },
                    data: {
                        messageUpdatedAt: new Date(),
                    },
                });
            },
        });

        return new StreamingTextResponse(stream, { status: 200 });
    } catch (error) {
        console.error("[CHAT_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
