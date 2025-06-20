import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import AppCard from "../../components/MarketResearch/AppCard";
import DateRangePicker from "../../components/form/date-range-picker";
import api from "../../api/axios";
import { App } from "../../types/app";
import { BookmarkFolder } from "../../types/bookmarkFolder";
import { FaGooglePlay, FaAppStoreIos, FaGlobe } from "react-icons/fa";

export default function FolderDetail() {
    const { folderName } = useParams();
    const [apps, setApps] = useState<App[]>([]);
    const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkFolder[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [platform, setPlatform] = useState<"all" | "ios" | "android">("all");
    const [rangeOption, setRangeOption] = useState<"today" | "yesterday" | "7d" | "30d" | "custom">("today");
    const [start, setStart] = useState(new Date().toLocaleDateString("en-CA"));
    const [end, setEnd] = useState(new Date().toLocaleDateString("en-CA"));

    const observerRef = useRef<HTMLDivElement | null>(null);
    const totalPagesRef = useRef(1);
    const currentPageRef = useRef(1);

    const platformOptions = [
        { value: "all", label: "All", icon: <FaGlobe size={14} /> },
        { value: "android", label: "Android", icon: <FaGooglePlay size={14} /> },
        { value: "ios", label: "iOS", icon: <FaAppStoreIos size={14} /> },
    ];

    const getScreenshots = (app: App) => {
        if (app.platform === "ios") {
            const screenshots =
                app.screenshotsByType?.iphone_6_5 ||
                app.screenshotsByType?.ipadPro_2018 ||
                app.screenshotsByType?.iphone_d74 ||
                app.screenshotsByType?.ipad ||
                app.screenshotsByType?.iphone ||
                app.screenshotsByType?.iphone5 ||
                app.screenshotsByType?.iphone6 ||
                app.screenshotsByType?.["iphone6+"] ||
                [];
            return screenshots.map((s) => s.url);
        }
        return app.screenshots || [];
    };

    const fetchApps = async (pageToFetch = 1, reset = false) => {
        try {
            setIsLoading(true);
            const res = await api.get(
                `/apps/bookmarked?folder=${encodeURIComponent(folderName || "")}&platform=${platform}&start=${start}&end=${end}&page=${pageToFetch}&limit=20`
            );
            const data = res.data;
            data.data.forEach((app: App) => {
                app.screenshots = getScreenshots(app);
            });
            setApps((prev) => (reset ? data.data : [...prev, ...data.data]));
            totalPagesRef.current = data.totalPages;
            setHasMore(pageToFetch < data.totalPages);
            currentPageRef.current = pageToFetch;
        } catch (err) {
            console.error("Failed to fetch folder apps", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setApps([]);
        setPage(1);
        setHasMore(true);
        currentPageRef.current = 1;
        fetchApps(1, true);
    };

    useEffect(() => {
        const today = new Date();
        const format = (d: Date) => d.toISOString().split("T")[0];

        let newStart = start;
        let newEnd = end;

        switch (rangeOption) {
            case "today":
                newStart = newEnd = format(today);
                break;
            case "yesterday":
                {
                    const yest = new Date(today);
                    yest.setDate(today.getDate() - 1);
                    newStart = newEnd = format(yest);
                    break;
                }
            case "7d":
                {
                    const week = new Date(today);
                    week.setDate(today.getDate() - 6);
                    newStart = format(week);
                    newEnd = format(today);
                    break;
                }
            case "30d":
                {
                    const month = new Date(today);
                    month.setDate(today.getDate() - 29);
                    newStart = format(month);
                    newEnd = format(today);
                    break;
                }
            case "custom":
            default:
                return;
        }

        setStart(newStart);
        setEnd(newEnd);
    }, [rangeOption]);

    useEffect(() => {
        fetchApps(1, true);
    }, [folderName, platform, start, end]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const res = await api.get("/users/me/bookmarks");
                setBookmarkFolders(res.data.data || []);
            } catch (err) {
                console.error("Failed to fetch bookmark folders", err);
            }
        };
        fetchBookmarks();
    }, []);

    useEffect(() => {
        if (!hasMore || isLoading) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading) {
                const nextPage = currentPageRef.current + 1;
                currentPageRef.current = nextPage;
                setPage(nextPage);
            }
        });

        if (observerRef.current) observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [apps, hasMore, isLoading]);

    useEffect(() => {
        if (page === 1) return;
        fetchApps(page);
    }, [page]);

    return (
        <div>
            <PageMeta title={`Elev8 | ${folderName}`} description={`Apps in ${folderName}`} />
            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <div className="mx-auto w-full max-w-[1200px] text-center">
                    <div className="mb-6 relative h-10 flex items-center">
                        <Link
                            to="/bookmarks"
                            className="absolute left-0 inline-flex items-center px-3 py-1.5 rounded-md border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-white/5 dark:border-gray-700 dark:text-white dark:hover:bg-white/10 transition"
                        >
                            ← Back to Bookmarks
                        </Link>

                        <h3 className="mx-auto font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                            {folderName}
                        </h3>
                    </div>

                    {/* Platform & Date Filters */}
                    <div className="flex flex-col items-center gap-4 my-6">
                        <div className="inline-flex bg-gray-100 dark:bg-white/10 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
                            {platformOptions.map(({ value, label, icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${platform === value
                                        ? "bg-black text-white"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                                        }`}
                                    onClick={() => setPlatform(value as "all" | "android" | "ios")}
                                >
                                    {icon}
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="inline-flex bg-gray-100 dark:bg-white/10 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
                            {[
                                { label: "Today", value: "today" },
                                { label: "Yesterday", value: "yesterday" },
                                { label: "7 days", value: "7d" },
                                { label: "30 days", value: "30d" },
                                { label: "Custom", value: "custom" },
                            ].map(({ label, value }) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`px-4 py-2 text-sm font-medium transition ${rangeOption === value
                                        ? "bg-black text-white"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20"
                                        }`}
                                    onClick={() => setRangeOption(value as typeof rangeOption)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {rangeOption === "custom" && (
                            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                                <div className="w-full max-w-xs">
                                    <DateRangePicker
                                        start={start}
                                        end={end}
                                        setStart={setStart}
                                        setEnd={setEnd}
                                    />
                                </div>
                            </form>
                        )}
                    </div>

                    {/* App List */}
                    {apps.length === 0 && !isLoading ? (
                        <div className="text-gray-500 text-sm py-20">
                            This folder is empty.
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 p-6">
                            {apps.map((app, i) => (
                                <AppCard
                                    key={i}
                                    {...app}
                                    initiallyBookmarkedFolders={bookmarkFolders}
                                />
                            ))}
                        </div>
                    )}

                    {hasMore && (
                        <div ref={observerRef}>
                            {isLoading && (
                                <div className="text-gray-500 text-sm py-6">Loading...</div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
