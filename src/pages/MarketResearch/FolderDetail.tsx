import { useEffect, useState } from "react";
import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import FilterControls from "../../components/MarketResearch/FilterControls";
import AppList from "../../components/MarketResearch/AppList";
import api from "../../api/axios";
import { BookmarkFolder } from "../../types/bookmarkFolder";

export default function FolderDetail() {
  const { folderName } = useParams();
  const [start, setStart] = useState(() => getStartEndFromRange("30d")[0]);
  const [end, setEnd] = useState(() => getStartEndFromRange("30d")[1]);
  const [platform, setPlatform] = useState<"all" | "android" | "ios">("all");
  const [rangeOption, setRangeOption] = useState<"today" | "yesterday" | "7d" | "30d" | "custom">("30d");
  const [bookmarkFolders, setBookmarkFolders] = useState<BookmarkFolder[]>([]);

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

  // Range option değişince tarihleri otomatik güncelle
  useEffect(() => {
    const today = new Date();
    const format = (d: Date) => d.toISOString().split("T")[0];

    let newStart = start;
    let newEnd = end;

    switch (rangeOption) {
      case "today":
        newStart = newEnd = format(today);
        break;
      case "yesterday": {
        const y = new Date(today);
        y.setDate(today.getDate() - 1);
        newStart = newEnd = format(y);
        break;
      }
      case "7d": {
        const week = new Date(today);
        week.setDate(today.getDate() - 6);
        newStart = format(week);
        newEnd = format(today);
        break;
      }
      case "30d": {
        const month = new Date(today);
        month.setDate(today.getDate() - 29);
        newStart = format(month);
        newEnd = format(today);
        break;
      }
      default:
        break;
    }

    setStart(newStart);
    setEnd(newEnd);
  }, [rangeOption]);

  // Kullanıcının bookmark klasörlerini çek
  useEffect(() => {
    const fetchBookmarkFolders = async () => {
      try {
        const res = await api.get("/users/me/bookmarks");
        const folders: BookmarkFolder[] = res.data.data || [];
        setBookmarkFolders(folders);
      } catch (err) {
        console.error("Failed to load bookmark folders", err);
      }
    };

    fetchBookmarkFolders();
  }, []);

  return (
    <div>
      <PageMeta title={`Elev8 | ${folderName}`} description={`Apps in ${folderName}`} />
      <PageBreadcrumb
        items={[
          { name: "Market Research", path: "/" },
          { name: "Bookmarks", path: "/bookmarks" },
          { name: `${folderName}` },
        ]}
      />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[1200px] text-center">

          {/* Platform ve tarih filtreleri */}
          <FilterControls
            start={start}
            end={end}
            setStart={setStart}
            setEnd={setEnd}
            platform={platform}
            setPlatform={setPlatform}
            rangeOption={rangeOption}
            setRangeOption={setRangeOption}
            onSubmit={() => {
              // trigger etmek için tarihleri yeniden set edebilirsin
              setStart((prev) => prev);
            }}
          />

          {/* Uygulama listesi */}
          <AppList
            start={start}
            end={end}
            platform={platform}
            bookmarkFolders={bookmarkFolders}
            folder={folderName || ""}
          />
        </div>
      </div>
    </div>
  );
}
