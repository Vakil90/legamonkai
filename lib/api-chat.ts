import prisma from "@/lib/db";
import { auth } from '@clerk/nextjs/server';
import OpenAI from "openai";

type Messages = {
    id: string;
    role: "function" | "system" | "user" | "assistant";
    content: string;
}[];

export const getMessages = async (chatId: string): Promise<Messages> => {
    const { userId } = auth();

    if (!userId || !chatId) {
        return [];
    }

    // Ensure the chatId is a valid ObjectId string
    if (chatId.length !== 24) {
        return [];
    }

    // Fetch the chat to ensure it belongs to the current user
    const chat = await prisma.chat.findUnique({
        where: {
            id: chatId,
            userId: userId, // Ensures the chat belongs to the current user
        },
    });

    if (!chat) {
        return [];
    }

    // Fetch all messages associated with the chat
    const messages = await prisma.message.findMany({
        where: {
            chatId: chatId,
        },
        orderBy: {
            createdAt: "asc", // Ensure messages are in chronological order
        },
    });

    // Return messages in the expected format
    return messages.map((msg) => ({
        id: msg.id,
        role: msg.role as "function" | "system" | "user" | "assistant",
        content: msg.content,
    }));
};


export const getChats = async () => {
    const { userId } = auth();

    if (!userId) return [];

    const chats = await prisma.chat.findMany({
        where: {
            userId: userId,
            Message: {
                some: {},
            },
        },
        orderBy: {
            messageUpdatedAt: "desc",
        },
    });

    return chats;
};

export const createNewChat = async () => {
    const { userId } = auth();

    // Ensure userId is valid
    if (!userId || userId.length !== 24) {
        return { id: "" };
    }

    // Find an old empty chat with the userId
    const oldEmptyChat = await prisma.chat.findFirst({
        where: {
            userId: userId,
            title: "",
            Message: {
                every: {
                    id: {
                        not: "", // Ensure that the message ID is not an empty string
                    },
                },
            },
        },
    });

    if (oldEmptyChat) {
        return await prisma.chat.update({
            where: {
                id: oldEmptyChat.id,
            },
            data: {
                createdAt: new Date(),
            },
        });
    }

    // If no old empty chat is found, create a new one
    const chat = await prisma.chat.create({
        data: {
            userId: userId,
            title: "",
        },
    });

    return chat;
};

export const getLastChat = async () => {
    const { userId } = auth();

    if (!userId) return { id: "" };

    // Ensure userId is valid
    if (!userId || userId.length !== 24) {
        return { id: "" }; // Return early if the userId is not valid
    }

    const lastChat = await prisma.chat.findFirst({
        where: {
            userId: userId,
            Message: {
                some: {
                    id: { not: "" }, // Ensure no empty ID is being passed
                },
            },
        },
        orderBy: {
            messageUpdatedAt: "desc",
        },
    });

    return lastChat;
};

