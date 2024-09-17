import React from "react";

const Hero = () => {
    return (
        <div className="mt-[5.25rem] w-full h-full text-center min-h-screen md:min-h-full">
            <div className="w-full relative flex justify-center min-h-screen h-full max-w-6xl mx-auto overflow-hidden">
                <div className="scale-[3] md:scale-100 absolute top-[13.5rem] md:top-20 md:h-full">
                    <div className="relative h-full">
                        <video className="" playsInline autoPlay muted loop>
                            <source src="hero.mp4" type="video/mp4" />
                            <source src="hero.ogv" type="video/ogv" />
                            <source src="hero.webm" type="video/webm" />
                        </video>
                        <div className="absolute top-0 mt-1 translate-y-1/4 md:translate-y-1/2 md:mt-11 w-full px-4 md:px-20 scale-50 md:scale-100">
                            <div className="relative pb-20 md:pb-0">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Content */}
                <section className="w-full space-y-4 z-10 absolute top-0 md:top-20">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-300 mt-24 md:mt-24 leading-tight">
                        Chat smarter with LegalMonk AI
                    </h1>
                    <p className="text-slate-300 text-sm md:text-base">
                        Unlock Intelligent Conversations with LegalMonk AI.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Hero;
