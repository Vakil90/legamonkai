"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("dc971050-3eb5-4cd3-b580-8bbdba2eb946");
    }, []);

    return null;
};
