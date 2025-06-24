import { useState, useRef, useEffect } from "react";
import { FaGooglePlay, FaAppStore } from 'react-icons/fa';
import { FaRegStar, FaStar, FaPlus } from "react-icons/fa6";
import { isSameDay, formatDistanceStrict } from "date-fns";
import api from "../../api/axios";
import { BookmarkFolder } from "../../types/bookmarkFolder";
import Screenshot from "./Screenshot";

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
    appId = "",
    initiallyBookmarkedFolders: initialBookmarkFolders = [] as BookmarkFolder[]
}) {
    const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkFolder[]>(initialBookmarkFolders);
    const [showFolderSelect, setShowFolderSelect] = useState(false);
    const [folderSearch, setFolderSearch] = useState("");
    const [newFolderName, setNewFolderName] = useState("");
    const folderSelectRef = useRef<HTMLDivElement>(null);
    const [screenshotLoaded, setScreenshotLoaded] = useState<boolean[]>(
        new Array(screenshots.length).fill(false)
    );

    useEffect(() => {
        if (!showFolderSelect) return;
        function handleClickOutside(event: MouseEvent) {
            if (
                folderSelectRef.current &&
                !folderSelectRef.current.contains(event.target as Node)
            ) {
                setShowFolderSelect(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showFolderSelect]);

    useEffect(() => {
        setScreenshotLoaded(new Array(screenshots.length).fill(false));
    }, [screenshots]);

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

    const filteredFolders = bookmarkFolders.filter(folder =>
        folder.name.toLowerCase().includes(folderSearch.toLowerCase())
    );

    const handleBookmarkClick = () => {
        setShowFolderSelect(!showFolderSelect);
        setFolderSearch("");
    };

    const handleFolderToggle = async (folderName: string) => {
        const matchingFolder = bookmarkFolders.find(f => f.name === folderName);
        if (!matchingFolder) return;

        if (matchingFolder.apps.some(app => app.appId === appId && app.platform === platform)) {
            await api.delete(`/users/me/bookmarks/${appId}`, {
                data: { appId, platform, folderName }
            });
            matchingFolder.apps = matchingFolder.apps.filter(app => app.appId !== appId || app.platform !== platform);
        } else {
            await api.post("/users/me/bookmarks", { appId, platform, folderName });
            matchingFolder.apps.push({ appId, platform: platform as "ios" | "android" });
        }

        setBookmarkFolders([...bookmarkFolders]);
    };

    const handleAddFolder = async () => {
        const name = newFolderName.trim();
        if (!name) return;
        const newFolder = { apps: [], name };
        await api.post("/users/me/bookmark-folders", { name });
        setBookmarkFolders([...bookmarkFolders, newFolder]);
        setNewFolderName("");
        setFolderSearch("");
        await handleFolderToggle(name);
    };

    return (
        <div className="w-full aspect-[4/5] rounded-xl border p-4 shadow-sm bg-white">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full border border-dashed flex items-center justify-center text-xs text-gray-400">
                        {icon ? (
                            <img
                                src={`${icon}`}
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

                <div className="flex gap-2 items-center relative">
                    {/* Bookmark */}
                    <button onClick={handleBookmarkClick} className="text-yellow-500 hover:scale-105 transition-transform">
                        {bookmarkFolders.some(folder =>
                            folder.apps.some(app => app.appId === appId && app.platform === platform)
                        ) ? <FaStar /> : <FaRegStar />}
                    </button>

                    {/* Folder select dropdown */}
                    {showFolderSelect && (
                        <div
                            ref={folderSelectRef}
                            className="absolute right-0 top-8 bg-white border rounded shadow-md z-10 min-w-[220px] p-2"
                        >
                            <input
                                type="text"
                                placeholder="Search folder..."
                                value={folderSearch}
                                onChange={e => setFolderSearch(e.target.value)}
                                className="w-full mb-2 px-2 py-1 border rounded text-sm outline-none"
                                autoFocus
                            />
                            <div className="max-h-40 overflow-y-auto mb-2">
                                {filteredFolders.length === 0 && (
                                    <div className="px-4 py-2 text-gray-400 text-sm">No folder found</div>
                                )}
                                {filteredFolders.map(folder => (
                                    <button
                                        key={folder.name}
                                        onClick={() => handleFolderToggle(folder.name)}
                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2 ${bookmarkFolders.some(f =>
                                            f.name === folder.name &&
                                            f.apps.some(app => app.appId === appId && app.platform === platform)
                                        ) ? "font-bold text-yellow-600" : ""
                                            }`}
                                    >
                                        <span className="flex-1">{folder.name}</span>
                                        {bookmarkFolders.some(f =>
                                            f.name === folder.name &&
                                            f.apps.some(app => app.appId === appId && app.platform === platform)
                                        ) && (
                                                <span className="text-yellow-500 text-xs">★</span>
                                            )}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-1 mt-2">
                                <input
                                    type="text"
                                    placeholder="Add new folder..."
                                    value={newFolderName}
                                    onChange={e => setNewFolderName(e.target.value)}
                                    className="flex-1 px-2 py-1 border rounded text-sm outline-none"
                                    onKeyDown={e => {
                                        if (e.key === "Enter") handleAddFolder();
                                    }}
                                />
                                <button
                                    onClick={handleAddFolder}
                                    className="px-2 py-1 bg-yellow-500 text-white rounded flex items-center justify-center"
                                    title="Add folder"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Market icon */}
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {platform === "ios" ? <FaAppStore /> : <FaGooglePlay />}
                    </a>
                </div>
            </div>

            {/* Screenshots */}
            <div className="overflow-x-auto mb-4">
                <div className="flex gap-2 h-80">
                    {screenshots.map((s, i) => (
                        <Screenshot
                            key={i}
                            url={s}
                            index={i}
                            onLoad={(index) =>
                                setScreenshotLoaded((prev) => {
                                    if (prev[index]) return prev;
                                    const updated = [...prev];
                                    updated[index] = true;
                                    return updated;
                                })
                            }
                            loaded={screenshotLoaded[i]}
                        />
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
