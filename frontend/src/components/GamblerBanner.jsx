import React from 'react';

const GamblerBanner = () => {
    // We define the height once here so the banner and spacer always match
    const bannerHeight = "h-12";

    return (
        <>
            {/* The Spacer: This sits in the document flow to push content up */}
            <div className={bannerHeight} aria-hidden="true" />

            {/* The Actual Banner: This stays fixed to the bottom */}
            <div className={`fixed bottom-0 left-0 w-full ${bannerHeight} bg-[#D4AF37] flex items-center justify-center shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50`}>
                <p className="text-black font-bold text-sm sm:text-base tracking-wide">
                    Gambling Problem? <span className="underline ml-1">Call 1-800-GAMBLER</span>
                </p>
            </div>
        </>
    );
};

export default GamblerBanner;