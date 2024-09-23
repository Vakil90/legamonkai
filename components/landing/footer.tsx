import React from "react";
import { SiNextdotjs } from "react-icons/si"; // Keeping the import for other uses, though not used here

const Footer = () => {
    return (
        <div className="py-8">
            <div className="w-full py-3 flex justify-center items-center text-sm text-slate-300">
                <span>Made with </span>
                <span className="text-red-600 text-lg">&nbsp;❤&nbsp;</span> 
                <span>by</span>
                <a target="_blank" href="https://ottobotix.com" className="text-blue-600">
                    &nbsp; Ottobotix
                </a>
            </div>
            <footer className="text-slate-600 text-xs text-center">
                Ottobotix @{new Date().getFullYear()}
            </footer>
        </div>
    );
};

export default Footer;
