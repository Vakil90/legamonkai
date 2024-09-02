import prisma from "@/lib/db";
import { auth } from '@clerk/nextjs/server';
import OpenAI from "openai";

type Messages = {
    id: string;
    role: "function" | "system" | "user" | "assistant";
    content: string;
}[];

export const getMessages = async (id: string): Promise<Messages> => {
    const { userId } = auth();

    if (!userId || !id) {
        return [];
    }

    // Ensure the id is a valid ObjectId string
    if (id.length !== 24) {
        return [];
    }

    const chat = await prisma.chat.findUnique({
        where: {
            id: id,
            userId: userId,
        },
    });

    if (!chat) {
        return [];
    }

    const oldMessages = await prisma.message.findMany({
        where: {
            chatId: id,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    return oldMessages.map((msg) => ({
        id: msg.id,
        role: msg.role as "function" | "system" | "user" | "assistant",
        content: msg.content,
    }));
};

export const getChats = async () => {
    const { userId } = auth();

    // Ensure userId is present and is a valid ObjectId (24 hex characters)
    if (!userId || userId.length !== 24) return [];

    const chats = await prisma.chat.findMany({
        where: {
            userId: userId,
            Message: {
                some: {
                    id: {
                        not: "", // Ensure no empty ID is being passed
                    },
                },
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
        return { id: "" }; // Return early if the userId is not valid
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

