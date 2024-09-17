"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizonal, Paperclip, PlusIcon } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import Message from "@/components/message";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";
import { Message as MessageType, useChat } from "ai/react";
import Link from "next/link";

type initialMessages = {
    id: string;
    role: "function" | "system" | "user" | "assistant";
    content: string;
}[];

type props = { initialMessages?: initialMessages; chatId?: string; error?: boolean };

const ChatPage = ({ initialMessages, chatId, error = false }: props) => {
    const router = useRouter();
    const pathname = usePathname();

    const proModal = useProModal();

    const [isPromptEmpty, setIsPromptEmpty] = useState<boolean>(true);
    const [file, setFile] = useState<File | null>(null);

    const bottomRef = useRef<HTMLDivElement | null>(null);
    const promptRef = useRef<HTMLTextAreaElement | null>(null);

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
        body: {
            chatId: chatId || "",
            file: file,
        },
        initialMessages: initialMessages || [],
        onError: (error: Error) => {
            console.error("Error occurred:", error.message);
            if (error.message === "Free Trial Exhausted") {
                proModal.open();
            } else {
                toast.error("An error occurred. Please try again.");
            }
        },
        onResponse: () => {
            router.refresh(); 
        },
    });

    useEffect(() => {
        if (chatId && !pathname.includes(chatId)) {
            router.push(`/chat/${chatId}`);
        }
    }, [chatId, pathname, router]);

    useEffect(() => {
        if (error) {
            toast.error("Uh oh! Unable to find chat.");
            router.push("/chat");
        }
    }, [error, router]);

    const scrollToBottom = () => {
        window.scrollTo({
            behavior: "smooth",
            top: document.body.scrollHeight,
        });
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        setIsPromptEmpty(input === "");
    }, [input]);

    const handleEnterKeyDown = (e: any) => {
        if (isLoading) {
            return;
        }
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    useEffect(() => {
        promptRef.current?.focus();
    }, []);

    return (
        <div className="flex flex-col h-full w-full items-center justify-between">
            <div className="w-full flex justify-between items-center px-4 py-2">
                <h1 className="text-xl font-bold"></h1>
                {/* <Link href="/chat">
                    <Button variant="outline" className="opacity-90">
                        <PlusIcon className="text-violet" size={16} /> &nbsp; New Chat
                    </Button>
                </Link> */}
            </div>
            {messages.length === 0 ? (
                <Empty />
            ) : (
                <div className="w-full flex flex-col items-center h-full mt-4 md:mt-0">
                    {messages.map((message, index) => (
                        <Message id={`message-${index}`} key={index} message={message} />
                    ))}
                    {messages[messages.length - 1].role === "user" && isLoading && <Loader />}
                    <div
                        ref={bottomRef}
                        className="bg-slate-925 w-full h-full min-h-[8rem] md:min-h-[10rem] mt-auto"></div>
                </div>
            )}
            <div className="fixed bottom-0 left-0 md:left-80 right-0 z-20 bg-gradient-to-b from-transparent via-slate-925 to-slate-925 flex flex-col justify-end items-center h-32 md:h-40 py-3 md:py-10 px-3 md:px-4">
                <div className="w-full max-w-2xl relative">
                    <form
                        onSubmit={handleSubmit}
                        onKeyDown={handleEnterKeyDown}
                        className="rounded-sm absolute bottom-0 md:bottom-1 w-full ps-2 py-1 pe-1 md:ps-3 bg-slate-300 focus-within:shadow-sm flex gap-1 items-center">
                        <input
                            type="file"
                            id="file-input"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <label htmlFor="file-input">
                            <Button
                                type="button"
                                variant="link"
                                className="p-2">
                                <Paperclip className="text-slate-500" size={20} />
                            </Button>
                        </label>
                        <TextareaAutosize
                            ref={promptRef}
                            maxRows={10}
                            value={input}
                            className="w-full py-2 border-0 outline-none text-slate-900 bg-transparent focus-visible:ring-0 focus-visible:ring-transparent"
                            placeholder="Send a message"
                            onChange={handleInputChange}
                        />
                        <Button
                            type="submit"
                            disabled={isPromptEmpty || isLoading}
                            variant="link"
                            className="mt-auto duration-500 w-10 h-10 p-2 bg-slate-800">
                            <SendHorizonal
                                className="text-slate-300"
                                strokeWidth={1.5}
                            />
                        </Button>
                    </form>
                </div>
                <p className="text-xs mt-2 text-center text-slate-500">
                    LegalMonk AI may produce inaccurate information about people, places, or facts.
                </p>
            </div>
        </div>
    );
};

export default ChatPage;
