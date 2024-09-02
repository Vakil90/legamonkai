import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const id = params.id;
        const { userId } = auth();

        // Validate that the ID and userId are strings and valid ObjectIds
        if (!id || typeof id !== "string" || id.length !== 24) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        if (!userId || typeof userId !== "string" || userId.length !== 24) {
            return new NextResponse("Invalid User ID", { status: 400 });
        }

        // Fetch the chat using the validated ID and userId
        const chat = await prisma.chat.findUnique({
            where: {
                id,
                userId,
            },
        });

        if (!chat) {
            return new NextResponse("Chat not found", { status: 404 });
        }

        // Fetch the messages associated with the chat
        const oldMessages = await prisma.message.findMany({
            where: {
                chatId: id,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        // Format the messages for the response
        const messages: OpenAI.Chat.Completions.ChatCompletionMessage[] = oldMessages.map((msg) => ({
            role: msg.role as OpenAI.Chat.Completions.ChatCompletionRole,
            content: msg.content,
        }));

        // Return the messages as JSON
        return NextResponse.json(messages, { status: 200 });
    } catch (error) {
        console.error("Error fetching chat:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
