"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";
import { usePathname } from "next/navigation";

export const CrispChat = () => {
    const pathname = usePathname();

    useEffect(() => {
        // Function to initialize Crisp
        const loadCrisp = () => {
            if (!window.$crisp) {
                Crisp.configure("dc971050-3eb5-4cd3-b580-8bbdba2eb946");
            }
        };

        // Function to remove Crisp
        const removeCrisp = () => {
            if (window.$crisp) {
                // Hide chat and reset global Crisp object
                window.$crisp.push(["do", "chat:hide"]);
                delete window.$crisp;
                
                // Remove the Crisp script from the DOM
                const crispScript = document.querySelector("script[src*='crisp.chat']");
                if (crispScript) {
                    crispScript.remove();
                }

                // Remove the Crisp chatbox widget from the DOM
                const crispWidget = document.getElementById("crisp-chatbox");
                if (crispWidget) {
                    crispWidget.remove();
                }
            }
        };

        // Logic based on the pathname
        if (pathname === "/") {
            // Load Crisp only on the landing page
            loadCrisp();
        } else if (pathname.includes("/chat")) {
            // Remove Crisp completely when navigating to the /chat page
            removeCrisp();
        } else {
            // Optionally hide Crisp on other pages (not the landing page or chat)
            if (window.$crisp) {
                window.$crisp.push(["do", "chat:hide"]);
            }
        }

        // Clean up when leaving the landing page
        return () => {
            if (pathname !== "/") {
                removeCrisp(); // Ensure Crisp is cleaned up when leaving the landing page
            }
        };
    }, [pathname]);

    return null;
};
