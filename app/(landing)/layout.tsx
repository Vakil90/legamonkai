import { CrispProvider } from "@/components/crisp-provider";
import Navbar from "@/components/landing/navbar";
import React from "react";
import { CrispChat } from "@/components/crisp-chat";
const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="">
            <Navbar />
            <CrispProvider />
            <CrispChat /> 
            {children}
        </div>
    );
};

export default LandingPageLayout;
