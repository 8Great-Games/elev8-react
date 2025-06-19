import { useEffect, useRef, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import AppCard from "../../components/MarketResearch/AppCard";
import api from "../../api/axios";
import { App } from "../../types/app";
import { FaGooglePlay, FaAppStoreIos, FaGlobe } from "react-icons/fa";

function Spinner() {
  return (
    <div className="flex justify-center py-6">
      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function Bookmarks() {
  const [apps, setApps] = useState<App[]>([]);
  const [platform, setPlatform] = useState<"all" | "ios" | "android">("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const currentPageRef = useRef(1);
  const isInitialMount = useRef(true);

  const platformOptions = [
    { value: "all", label: "All", icon: <FaGlobe size={14} /> },
    { value: "android", label: "Android", icon: <FaGooglePlay size={14} /> },
    { value: "ios", label: "iOS", icon: <FaAppStoreIos size={14} /> },
  ];

  const getScreenshots = (app: App) => {
    if (app.platform === 'ios') {
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
      return screenshots.map(obj => obj.url);
    }
    return app.screenshots || [];
  };

  const fetchApps = async (pageToFetch = 1, reset = false) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/apps/bookmarked?page=${pageToFetch}&limit=20&platform=${platform}`);
      const data = await res.data;

      data.data.forEach((app: App) => {
        app.screenshots = getScreenshots(app);
      });

      setApps(prev => reset ? data.data : [...prev, ...data.data]);
      setTotalPages(data.totalPages);
      setHasMore(pageToFetch < data.totalPages);
      currentPageRef.current = pageToFetch;
    } catch (err) {
      console.error("Failed to fetch bookmarked apps:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchApps(1, true);
    } else {
      // platform değiştiğinde sıfırla
      setApps([]);
      setPage(1);
      setHasMore(true);
      currentPageRef.current = 1;
      fetchApps(1, true);
    }
  }, [platform]);

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
      <PageMeta title="Elev8 | Bookmarks" description="Bookmarked apps" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[1200px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Bookmarks
          </h3>

          {/* Platform Toggle */}
          <div className="inline-flex mb-6 bg-gray-100 dark:bg-white/10 rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
            {platformOptions.map(({ value, label, icon }) => (
              <button
                key={value}
                type="button"
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
                  platform === value
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

          {apps.length === 0 && !isLoading ? (
            <div className="text-gray-500 text-sm py-20">
              You haven’t bookmarked any apps on this platform.
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-6 p-6">
              {apps.map((app, i) => (
                <AppCard key={i} {...app} initiallyBookmarked={true} />
              ))}
            </div>
          )}

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
