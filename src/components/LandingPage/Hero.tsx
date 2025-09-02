import React from "react";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

const Hero: React.FC = () => {
    return (
        <>
            <div className="relative bg-white pb-[110px] pt-[120px] dark:bg-brand-950 lg:pt-[150px]">
                <div className="container">
                    <div className="-mx-4 flex flex-wrap">
                        <div className="w-full px-4 lg:w-5/12">
                            <HeroContent />
                        </div>
                        <div className="hidden px-4 lg:block lg:w-1/12"></div>
                        <div className="w-full px-4 lg:w-6/12">
                            <HeroImage />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hero;
