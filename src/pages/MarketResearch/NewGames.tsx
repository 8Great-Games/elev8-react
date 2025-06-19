import { useEffect, useRef, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import AppCard from "../../components/MarketResearch/AppCard";
import DateRangePicker from "../../components/form/date-range-picker";
import { FaGooglePlay, FaAppStoreIos, FaGlobe } from "react-icons/fa";
import { App } from "../../types/app";
import api from "../../api/axios"

function Spinner() {
    return (
        <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}

export default function NewGames() {
    const [apps, setApps] = useState([]);
    const [start, setStart] = useState(new Date().toLocaleDateString("en-CA"));
    const [end, setEnd] = useState(new Date().toLocaleDateString("en-CA"));
    const [platform, setPlatform] = useState<"all" | "ios" | "android">("all");
    const [bookmarkedAppMap, setBookmarkedAppMap] = useState<Record<string, "ios" | "android">>({});
    const [rangeOption, setRangeOption] = useState<"today" | "yesterday" | "7d" | "30d" | "custom">("today");


    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const currentPageRef = useRef(1);
    const isInitialMount = useRef(true);

    function getScreenshots(app: App) {
        if (app.platform === 'ios') {
            const screenshotObjects =
                app.screenshotsByType?.iphone_6_5 ||
                app.screenshotsByType?.ipadPro_2018 ||
                app.screenshotsByType?.iphone_d74 ||
                app.screenshotsByType?.ipad ||
                app.screenshotsByType?.iphone ||
                app.screenshotsByType?.iphone5 ||
                app.screenshotsByType?.iphone6 ||
                app.screenshotsByType?.["iphone6+"] ||
                app.screenshotsByType?.[0] ||
                [];

            return screenshotObjects.map(obj => obj.url);
        } else if (app.platform === 'android') {
            return app.screenshots || [];
        }
        return [];
    }


    const fetchApps = async (pageToFetch = 1, reset = false) => {
        try {
            //console.log("fetchApps", start, end, pageToFetch, reset)
            setIsLoading(true);
            const res = await api.get(`/apps/date-range?start=${start}&end=${end}&platform=${platform}&page=${pageToFetch}&limit=20`)
            const data = await res.data;
            data.data.map((app: App) => { app.screenshots = getScreenshots(app) })
            setApps(prev => reset ? data.data : [...prev, ...data.data]);
            setTotalPages(data.totalPages); // 👈 totalPages güncelle
            setHasMore(pageToFetch < data.totalPages); // 👈 doğru hesap
            currentPageRef.current = pageToFetch;
            setIsLoading(false);
        } catch (err) {
            console.error("Failed to fetch apps:", err);
            setIsLoading(false);
        }
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
        const fetchBookmarks = async () => {
            try {
                const res = await api.get("/apps/bookmarked");
                const bookmarks = res.data.data || [];
                const map: Record<string, "ios" | "android"> = {};
                bookmarks.forEach((b: App) => {
                    const key = b.platform === "ios" ? b.appId : b.bundleId;
                    if (key) map[key] = b.platform;
                });
                setBookmarkedAppMap(map);
            } catch (err) {
                console.error("Failed to fetch bookmarks", err);
            }
        };

        fetchBookmarks();
    }, []);


    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            fetchApps(1, true);
        } else {
            setApps([]);
            setPage(1);
            setHasMore(true);
            currentPageRef.current = 1;
            fetchApps(1, true);
        }
    }, [start, end, platform]);

    useEffect(() => {
        if (!hasMore || isLoading) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isLoading && page < totalPages) {
                const nextPage = currentPageRef.current + 1;
                currentPageRef.current = nextPage;
                setPage(nextPage);
            }
        });

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [apps, hasMore, isLoading]);

    useEffect(() => {
        if (page === 1) return;
        fetchApps(page, false);
    }, [page]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setApps([]);
        setPage(1);
        setHasMore(true);
        currentPageRef.current = 1;
        fetchApps(1, true);
    };

    const platformOptions = [
        { value: "all", label: "All", icon: <FaGlobe size={14} /> },
        { value: "android", label: "Android", icon: <FaGooglePlay size={14} /> },
        { value: "ios", label: "iOS", icon: <FaAppStoreIos size={14} /> },
    ];

    return (
        <div>
            <PageMeta title="Elev8 | New Games" description="New Games" />

            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <div className="mx-auto w-full max-w-[1200px] text-center">
                    <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
                        New Games
                    </h3>

                    <div className="flex flex-col items-center gap-4 mb-6">
                        {/* Platform Toggle */}
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

                        {/* Date Range Options */}
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
                    </div>



                    {/* Filter Form */}
                    {rangeOption === "custom" && (
                        <form onSubmit={handleSubmit} className="mb-6 flex flex-col items-center gap-4">
                            <div className="w-full flex justify-center">
                                <div className="w-full max-w-xs">
                                    <DateRangePicker
                                        start={start}
                                        end={end}
                                        setStart={setStart}
                                        setEnd={setEnd}
                                    />
                                </div>
                            </div>
                        </form>
                    )}

                    {/* App Grid */}
                    {apps.length === 0 && !isLoading ? (
                        <div className="text-gray-500 text-sm py-20">
                            No apps found in this date range and platform.
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 p-6">
                            {apps.map((app: App, i) => (
                                <AppCard
                                    key={i}
                                    {...app}
                                    initiallyBookmarked={
                                        app.platform === "ios"
                                            ? bookmarkedAppMap[app.appId] === "ios"
                                            : bookmarkedAppMap[app.bundleId] === "android"
                                    }
                                />
                            ))}
                        </div>
                    )}

                    {/* Load trigger + spinner */}
                    {hasMore && (
                        <div ref={observerRef}>
                            {isLoading && <Spinner />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
