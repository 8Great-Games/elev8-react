import { useEffect, useRef, useState } from "react";
import AppCard from "../../components/MarketResearch/AppCard";
import api from "../../api/axios";
import { App } from "../../types/app";
import { BookmarkFolder } from "../../types/bookmarkFolder";

interface Props {
    start: string;
    end: string;
    platform: "all" | "android" | "ios";
    bookmarkFolders: BookmarkFolder[];
    isPublisher?: boolean;
    folder?: string;
}

export default function AppList({ start, end, platform, bookmarkFolders, isPublisher, folder }: Props) {
    const [apps, setApps] = useState<App[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);

    const observerRef = useRef<HTMLDivElement | null>(null);
    const currentPageRef = useRef(1);
    const isInitialMount = useRef(true);

    const getScreenshots = (app: App) => {
        if (app.platform === "ios") {
            const s =
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
            return s.map((x) => x.url);
        } else if (app.platform === "android") {
            return app.screenshots || [];
        }
        return [];
    };

    const fetchApps = async (pageToFetch = 1, reset = false) => {
        try {
            setIsLoading(true);
            const queryParams = new URLSearchParams({
                start,
                end,
                platform,
                page: pageToFetch.toString(),
                limit: "20"
            });

            if (isPublisher) {
                queryParams.append("isPublisher", "true");
            }

            if (folder) {
                queryParams.append("folder", folder);
            }

            const endpoint = folder ? `/apps/bookmarked` : `/apps/date-range`;

            const res = await api.get(`${endpoint}?${queryParams.toString()}`);
            const data = res.data;
            const enrichedApps: App[] = data.data.map((app: App) => ({
                ...app,
                screenshots: getScreenshots(app),
            }));
            setApps((prev) => (reset ? enrichedApps : [...prev, ...enrichedApps]));
            setTotalPages(data.totalPages);
            setHasMore(pageToFetch < data.totalPages);
            currentPageRef.current = pageToFetch;
        } catch (err) {
            console.error("Failed to fetch apps:", err);
        } finally {
            setIsLoading(false);
        }
    };

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
        if (page === 1) return;
        fetchApps(page, false);
    }, [page]);

    useEffect(() => {
        if (!hasMore || isLoading) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && currentPageRef.current < totalPages) {
                const nextPage = currentPageRef.current + 1;
                currentPageRef.current = nextPage;
                setPage(nextPage);
            }
        });

        const node = observerRef.current;
        if (node) observer.observe(node);

        return () => {
            if (node) observer.unobserve(node);
        };
    }, [apps, hasMore, isLoading]);

    return (
        <>
            {apps.length === 0 && !isLoading ? (
                <div className="text-gray-500 text-sm py-20">
                    No apps found in this date range and platform.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 p-4 sm:p-5 md:p-6">
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
                        <div className="flex justify-center py-6">
                            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
