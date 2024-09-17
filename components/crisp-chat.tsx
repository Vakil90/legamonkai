"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";
import { usePathname } from "next/navigation";

export const CrispChat = () => {
    const pathname = usePathname();

    useEffect(() => {
        Crisp.configure("dc971050-3eb5-4cd3-b580-8bbdba2eb946");
    }, []);

    // Hide CrispChat on the chat page in mobile view
    const isChatPage = pathname.includes("/chat");
    const isMobileView = window.innerWidth < 768; // Adjust based on your breakpoint

    if (isChatPage && isMobileView) {
        return null; // Don't render CrispChat on chat page in mobile view
    }

    return null; // Render normally otherwise
};
