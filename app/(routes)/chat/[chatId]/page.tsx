import React from "react";
import { getMessages } from "@/lib/api-chat"; // Update the path to your getMessages function
import ChatPage from "@/components/chat-page";

const Page = async ({ params: { chatId } }: { params: { chatId: string } }) => {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/; // MongoDB ObjectId pattern

    let err = false;
    let initialMessages: string | any[] | undefined = [];

    if (objectIdPattern.test(chatId)) {
        try {
            initialMessages = await getMessages(chatId);
            if (!initialMessages || initialMessages.length === 0) {
                err = true; // No messages found for this chatId
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            err = true; // Error while fetching messages
        }
    } else {
        err = true; // Invalid chatId format
    }

    return <ChatPage initialMessages={initialMessages} chatId={chatId} error={err} />;
};

export default Page;
