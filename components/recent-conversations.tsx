import React from "react";
import SidebarHeader from "./sidebar-header";
import { Chat as ChatType } from "@prisma/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import Chat from "./chat";

const staticGroupedChats: { [key: string]: ChatType[] } = {
    "September 2023": [
        { id: "1", title: "Chat 1", createdAt: new Date(), userId: "user1", isFavourite: false, isCode: false, messageUpdatedAt: new Date(), updatedAt: new Date() },
        { id: "2", title: "Chat 2", createdAt: new Date(), userId: "user2", isFavourite: false, isCode: false, messageUpdatedAt: new Date(), updatedAt: new Date() },
    ],
    "October 2023": [
        { id: "3", title: "Chat 3", createdAt: new Date(), userId: "user3", isFavourite: false, isCode: false, messageUpdatedAt: new Date(), updatedAt: new Date() },
    ],
};

const RecentConversations = ({ groupedChats = staticGroupedChats }: { groupedChats: { [key: string]: ChatType[] } }) => {
    console.log('Grouped Chats:', groupedChats);


    function renderFilteredChats(chats: ChatType[], title: string) {
        console.log('Rendering Chats for:', title, 'Chats:', chats);
        return (
            <div className="flex flex-col mb-2">
                <AccordionTrigger className="text-xs text-indigo-300/80">
                    {title} ({chats.length})
                </AccordionTrigger>
                <AccordionContent className="space-y-2 mt-2 h-full overflow-auto pr-1">
                    {chats.map((chat) => (
                        <Chat key={chat.id} chat={chat} />
                    ))}
                </AccordionContent>
            </div>
        );
    }


    return (
        <div className="h-full flex flex-col mb-2 ">
            <SidebarHeader title="Recent Conversations" />

            <Accordion
                type="multiple"
                defaultValue={[...Object.keys(groupedChats)]}
                className="h-full overflow-auto custom-scrollbar">
                {Object.keys(groupedChats).map((month) => (
                    <AccordionItem value={month} key={month}>
                        {renderFilteredChats(groupedChats[month], month)}
                    </AccordionItem>
                ))}
            </Accordion>

        </div>
    );
};

export default RecentConversations;
