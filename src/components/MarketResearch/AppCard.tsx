import { useState } from "react";
import { FaGooglePlay, FaAppStore } from 'react-icons/fa';
import { FaRegStar, FaStar } from "react-icons/fa6";
import { isSameDay, formatDistanceStrict } from "date-fns";
import { host } from "../../api/axios";
import api from "../../api/axios"; // axios instance'ınız

export default function AppCard({
    title = "Game 3d",
    developerName = "Dev Name",
    icon = "",
    screenshots = [""],
    updateDate = "2024-06-03T12:34:56Z",
    releaseDate = undefined,
    versionHistory = [],
    version = "1.5",
    platform = "android",
    url = "https://play.google.com/store/apps/details?id=your.app.id",
    appId = "", // backend'e göndermek için gerekli
    bundleId = "",
    initiallyBookmarked = false // dışarıdan gelen bookmark durumu
}) {
    const [isBookmarked, setIsBookmarked] = useState(initiallyBookmarked);

    const formatSmartDate = (dateStr: string | number | Date) => {
        const inputDate = new Date(dateStr);
        inputDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (isSameDay(inputDate, today)) return "Today";
        if (isSameDay(inputDate, yesterday)) return "Yesterday";
        return formatDistanceStrict(inputDate, today, { unit: "day", addSuffix: false });
    };

    const toggleBookmark = async () => {
        try {
            if (isBookmarked) {
                await api.delete(`/users/me/bookmarks/${platform === 'ios' ? appId : bundleId}`, { data: { platform } });
            } else {
                await api.post(`/users/me/bookmarks`, { appId: platform === 'ios' ? appId : bundleId, platform });
            }
            setIsBookmarked(!isBookmarked);
        } catch (err) {
            alert("Failed to update bookmark");
            console.error(err);
        }
    };

    return (
        <div className="w-full aspect-[4/5] rounded-xl border p-4 shadow-sm bg-white">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full border border-dashed flex items-center justify-center text-xs text-gray-400">
                        {icon ? (
                            <img
                                src={`${host}/proxy-image?url=${icon}`}
                                alt="icon"
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            "Icon"
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-left">{title}</div>
                        <div className="text-xs text-gray-400 text-left">{developerName}</div>
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                    {/* Yıldız ikonu */}
                    <button onClick={toggleBookmark} className="text-yellow-500 hover:scale-105 transition-transform">
                        {isBookmarked ? <FaStar /> : <FaRegStar />}
                    </button>

                    {/* Market ikonu */}
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {platform === "ios" ? <FaAppStore /> : <FaGooglePlay />}
                    </a>
                </div>
            </div>

            {/* Screenshots */}
            <div className="overflow-x-auto mb-4">
                <div className="flex gap-2 h-80">
                    {screenshots.map((s, i) => (
                        <div
                            key={i}
                            className="h-full flex-shrink-0 overflow-hidden rounded-md border border-dashed text-[10px] text-gray-400 flex justify-center items-center"
                        >
                            {s ? (
                                <img
                                    src={`${host}/proxy-image?url=${s}`}
                                    alt={`screenshot-${i}`}
                                    className="h-full w-auto object-cover"
                                />
                            ) : (
                                "Screenshot"
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between text-[12px] text-center text-gray-600">
                <div>
                    {platform === "ios" ? (
                        <div>
                            <div className="font-medium text-black">Updates</div>
                            <div>{versionHistory.length - 1}</div>
                        </div>
                    ) : (
                        <div>
                            <div className="font-medium text-black">Last Update</div>
                            <div>{formatSmartDate(updateDate)}</div>
                        </div>
                    )}
                </div>

                <div>
                    <div className="font-medium text-black">Released</div>
                    <div>{releaseDate ? formatSmartDate(releaseDate) : "Unknown"}</div>
                </div>

                <div>
                    <div className="font-medium text-black">VER</div>
                    <div>{version}</div>
                </div>
            </div>
        </div>
    );
}
