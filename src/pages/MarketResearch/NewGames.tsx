import { useEffect, useRef, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import FilterControls from "../../components/MarketResearch/FilterControls";
import AppList from "../../components/MarketResearch/AppList";
import api from "../../api/axios";
import { BookmarkFolder } from "../../types/bookmarkFolder";

export default function NewGames() {
    const [apps, setApps] = useState([]);
    const [start, setStart] = useState(() => getStartEndFromRange("30d")[0]);
    const [end, setEnd] = useState(() => getStartEndFromRange("30d")[1]);
    const [platform, setPlatform] = useState<"all" | "ios" | "android">("all");
    const [rangeOption, setRangeOption] = useState<
        "today" | "yesterday" | "7d" | "30d" | "custom"
    >("30d");
    const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkFolder[]>([]);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement | null>(null);
    const currentPageRef = useRef(1);
    const isInitialMount = useRef(true);
    const [totalPages, setTotalPages] = useState(1);

    function getStartEndFromRange(option: "today" | "yesterday" | "7d" | "30d" | "custom") {
        const today = new Date();
        const format = (d: Date) => d.toISOString().split("T")[0];

        switch (option) {
            case "today":
                return [format(today), format(today)];
            case "yesterday": {
                const yest = new Date(today);
                yest.setDate(today.getDate() - 1);
                return [format(yest), format(yest)];
            }
            case "7d": {
                const week = new Date(today);
                week.setDate(today.getDate() - 6);
                return [format(week), format(today)];
            }
            case "30d": {
                const month = new Date(today);
                month.setDate(today.getDate() - 29);
                return [format(month), format(today)];
            }
            default:
                return [format(today), format(today)];
        }
    }


    // 📅 Aralığa göre tarihleri ayarla
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
            default:
                return;
        }

        setStart(newStart);
        setEnd(newEnd);
    }, [rangeOption]);

    useEffect(() => {
        api.get("/users/me/bookmarks")
            .then(res => setBookmarkFolders(res.data.data || []))
            .catch(err => console.error("Failed to fetch bookmarks", err));
    }, []);

    const fetchApps = async (pageToFetch = 1, reset = false) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/apps/date-range?start=${start}&end=${end}&platform=${platform}&page=${pageToFetch}&limit=20`);
            const data = res.data;
            setApps(prev => reset ? data.data : [...prev, ...data.data]);
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
        if (!hasMore || isLoading) return;

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !isLoading && page < totalPages) {
                const nextPage = currentPageRef.current + 1;
                currentPageRef.current = nextPage;
                setPage(nextPage);
            }
        });

        if (observerRef.current) observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [apps, hasMore, isLoading]);

    useEffect(() => {
        if (page === 1) return;
        fetchApps(page, false);
    }, [page]);

    const handleFilterSubmit = () => {
        setApps([]);
        setPage(1);
        setHasMore(true);
        currentPageRef.current = 1;
        fetchApps(1, true);
    };

    return (
        <div>
            <PageMeta title="Elev8 | New Games" description="New Games" />
            <PageBreadcrumb
                items={[
                    { name: "Market Research", path: "/" },
                    { name: "New Games", path: "/new-games" },
                ]}
            />

            <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
                <div className="mx-auto w-full max-w-[1200px] text-center">

                    <FilterControls
                        start={start}
                        end={end}
                        setStart={setStart}
                        setEnd={setEnd}
                        platform={platform}
                        setPlatform={setPlatform}
                        rangeOption={rangeOption}
                        setRangeOption={setRangeOption}
                        onSubmit={handleFilterSubmit}
                    />

                    <AppList
                        start={start}
                        end={end}
                        platform={platform}
                        bookmarkFolders={bookmarkFolders}
                    />
                </div>
            </div>
        </div>
    );
}
