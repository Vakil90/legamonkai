import React from "react";
import { SiNextdotjs } from "react-icons/si";

const Footer = () => {
    return (
        <div className="py-8">
            <div className="w-full py-3 flex justify-center items-center text-sm text-slate-300">
                <span>Made
                </span>
                {/* &nbsp; */}
                {/* <SiNextdotjs /> */}
                &nbsp; with
                <a target="_blank" href="" className="text-blue-600">
                    &nbsp;❤ by Ottobotix
                </a>
            </div>
            <footer className="text-slate-600 text-xs text-center">
            Ottobotix @{new Date().getFullYear()}
            </footer>
        </div>
    );
};

export default Footer;
