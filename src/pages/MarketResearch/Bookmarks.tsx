import { useEffect, useState } from "react";
import api from "../../api/axios";
import { BookmarkFolder } from "../../types/bookmarkFolder";
import { App } from "../../types/app";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";

export default function Bookmarks() {
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [appsByFolder, setAppsByFolder] = useState<Record<string, App[]>>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFoldersAndApps = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users/me/bookmarks");
        const folders: BookmarkFolder[] = res.data.data || [];
        setFolders(folders);

        const result: Record<string, App[]> = {};
        for (const folder of folders) {
          const url = `/apps/bookmarked?folder=${encodeURIComponent(folder.name)}&page=1&limit=4`;
          const appRes = await api.get(url);
          result[folder.name] = appRes.data.data || [];
        }

        setAppsByFolder(result);
      } catch (err) {
        console.error("Failed to load folders or apps", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFoldersAndApps();
  }, []);

  return (
    <div>
      <PageMeta title={`Elev8 | Bookmarks`} description={`Bookmarks`} />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[1200px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Bookmarks
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {folders.map((folder) => (
              <div
                key={folder.name}
                onClick={() => navigate(`/bookmarks/${encodeURIComponent(folder.name)}`)}
                className="cursor-pointer flex justify-center"
              >
                <div className="w-full aspect-square bg-gray-100 dark:bg-white/5 rounded-3xl p-4 shadow-lg flex flex-col">
                  <div className="flex-grow grid grid-cols-2 grid-rows-2 gap-3 mb-4">
                    {appsByFolder[folder.name]?.map((app) => (
                      <img
                        key={app.appId}
                        src={app.icon}
                        alt={app.title}
                        title={app.title}
                        className="rounded-xl w-full h-full object-cover"
                      />
                    ))}
                    {Array.from({
                      length: 4 - (appsByFolder[folder.name]?.length || 0),
                    }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-300 dark:bg-white/10 rounded-xl w-full h-full"
                      />
                    ))}
                  </div>

                  <div className="text-center text-xl font-normal text-gray-800 dark:text-white/90">
                    {folder.name}
                  </div>
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    {folder.apps?.length || 0} apps
                  </div>

                </div>
              </div>
            ))}
          </div>



          {loading && (
            <div className="mt-10 text-gray-500 text-sm">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );

}
