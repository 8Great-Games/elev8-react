import SingleImage from "./SingleImage";

const HeroContent = () => {
    return (
        <div className="hero-content">
            <h1 className="mb-5 text-4xl font-bold !leading-[1.208] text-dark dark:text-white sm:text-[42px] lg:text-[40px] xl:text-5xl">
                Discover and Track the Latest Mobile Games
            </h1>
            <p className="mb-8 max-w-[480px] text-base text-body-color dark:text-dark-6">
                Stay ahead of the curve with our market research tool. Explore newly released mobile games, analyze trends, and track performance within any date range.
            </p>
            <ul className="flex flex-wrap items-center">
                <li>
                    <a
                        href="/#"
                        className="inline-flex items-center justify-center rounded-md bg-brand-500 px-6 py-3 text-center text-base font-medium text-white hover:bg-brand-600 lg:px-7"
                    >
                        Get Started
                    </a>
                </li>
            </ul>
            <div className="clients pt-16">
                <h6 className="mb-6 flex items-center text-xs font-normal text-gray-600 dark:text-gray-400">
                    Trusted by Top Game Analysts
                    <span className="ml-3 inline-block h-px w-8 bg-brand-500"></span>
                </h6>

                <div className="flex items-center space-x-4">
                    <SingleImage href="#" imgSrc="https://cdn.tailgrids.com/assets/images/marketing/brands/ayroui.svg" />
                    <SingleImage href="#" imgSrc="https://cdn.tailgrids.com/assets/images/marketing/brands/graygrids.svg" />
                    <SingleImage href="#" imgSrc="https://cdn.tailgrids.com/assets/images/marketing/brands/uideck.svg" />
                </div>
            </div>
        </div>
    );
};

export default HeroContent;
