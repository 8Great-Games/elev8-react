import React, { useEffect, useRef } from "react";
import { host } from "../../api/axios";

interface Props {
    url: string;
    index: number;
    onLoad: (index: number) => void;
    loaded: boolean;
}

const Screenshot: React.FC<Props> = React.memo(({ url, index, onLoad, loaded }) => {
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imgRef.current?.complete && !loaded) {
            // Resim daha önce yüklenmiş ama loaded state'i güncellenmemişse
            onLoad(index);
        }
    }, [loaded, index, onLoad]);

    return (
        <div
            className={`h-full flex-shrink-0 overflow-hidden rounded-md border border-dashed text-[10px] text-gray-400 flex justify-center items-center relative bg-gray-50 ${!loaded ? "min-w-[90px]" : ""}`}
        >
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            {url ? (
                <img
                    ref={imgRef}
                    src={`${host}/proxy-image?url=${url}`}
                    loading="lazy"
                    alt={`screenshot-${index}`}
                    className={`h-full w-auto object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => onLoad(index)}
                />
            ) : (
                "Screenshot"
            )}
        </div>
    );
});

export default Screenshot;
