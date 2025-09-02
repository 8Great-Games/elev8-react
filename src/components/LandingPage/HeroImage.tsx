
const HeroImage = () => {
    return (
        <div className="lg:ml-auto lg:text-right">
            <div className="relative z-10 inline-block pt-11 lg:pt-0">
                <img
                    src="https://cdn.tailgrids.com/assets/images/marketing/hero/hero-image-01.png"
                    alt="hero"
                    className="max-w-full lg:ml-auto"
                />
                <span className="absolute -bottom-8 -left-8 z-[-1]">
                    <svg width="93" height="93" viewBox="0 0 93 93" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Circle pattern */}
                        {[...Array(5)].map((_, i) => (
                            <>
                                <circle cx="2.5" cy={2.5 + i*22} r="2.5" fill="#3056D3" />
                                <circle cx="24.5" cy={2.5 + i*22} r="2.5" fill="#3056D3" />
                                <circle cx="46.5" cy={2.5 + i*22} r="2.5" fill="#3056D3" />
                                <circle cx="68.5" cy={2.5 + i*22} r="2.5" fill="#3056D3" />
                                <circle cx="90.5" cy={2.5 + i*22} r="2.5" fill="#3056D3" />
                            </>
                        ))}
                    </svg>
                </span>
            </div>
        </div>
    );
};

export default HeroImage;
