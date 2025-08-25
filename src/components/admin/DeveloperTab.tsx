import { useEffect, useState } from "react";
import api from "../../api/axios";

type Developer = {
    _id: string;
    developerId: string;
    name: string;
    platform: "android" | "ios";
    url: string;
    active: boolean;
    isPublisher?: boolean;
    appsLastUpdatedAt?: string;
    appsLastScrapedAt?: string;
};

type SyncPlatformStatus = {
    isSyncing: boolean;
    lastSyncTime: string | null;
};

export default function DeveloperTab() {
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [newURL, setNewURL] = useState("");
    const [isPublisher, setIsPublisher] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [syncStatus, setSyncStatus] = useState<{ ios: SyncPlatformStatus; android: SyncPlatformStatus }>({
        ios: { isSyncing: false, lastSyncTime: null },
        android: { isSyncing: false, lastSyncTime: null },
    });

    const [localSyncing, setLocalSyncing] = useState<{ ios: boolean; android: boolean }>({
        ios: false,
        android: false,
    });

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "—";
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(date);
    };

    const fetchDevelopers = async () => {
        try {
            setError(null);
            const res = await api.get("/developers");
            setDevelopers(res.data);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to load developers");
        }
    };

    const pollSyncStatus = async () => {
        try {
            const res = await api.get("/jobs/sync-status");
            setSyncStatus(res.data);

            // Eğer backend "isSyncing = false" döndüyse local spinner'ı da sıfırla
            setLocalSyncing({
                ios: res.data.ios.isSyncing,
                android: res.data.android.isSyncing,
            });
        } catch (err: any) {
            console.error("Failed to poll sync status");
        }
    };

    useEffect(() => {
        fetchDevelopers();
        pollSyncStatus();
        const interval = setInterval(pollSyncStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            await api.post("/developers", {
                developerURL: newURL,
                isPublisher,
            });
            setNewURL("");
            setIsPublisher(false);
            fetchDevelopers();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to add developer");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            setError(null);
            await api.delete(`/developers/${id}`);
            fetchDevelopers();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to delete developer");
        }
    };

    const toggleStatus = async (dev: Developer) => {
        const endpoint = dev.active ? "deactivate" : "activate";
        try {
            setError(null);
            await api.patch(`/developers/${dev.developerId}/${endpoint}`);
            fetchDevelopers();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to update status");
        }
    };

    const togglePublisher = async (dev: Developer) => {
        try {
            setError(null);
            await api.patch(`/developers/${dev.developerId}/publisher`, {
                isPublisher: !dev.isPublisher,
            });
            fetchDevelopers();
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to update publisher status");
        }
    };

    const triggerPlatformSync = async (platform: "ios" | "android") => {
        try {
            setLocalSyncing(prev => ({ ...prev, [platform]: true }));
            await api.post(`/jobs/sync?platform=${platform}`);
        } catch (err: any) {
            setError(err.response?.data?.error || `Failed to start ${platform} sync`);
            setLocalSyncing(prev => ({ ...prev, [platform]: false }));
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                    type="url"
                    placeholder="Enter developer URL"
                    value={newURL}
                    onChange={(e) => setNewURL(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                    required
                />
                <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-700 dark:text-white">Publisher:</span>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={isPublisher}
                        onClick={() => setIsPublisher((prev) => !prev)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none 
                        ${isPublisher ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 
                            ${isPublisher ? "translate-x-6" : "translate-x-1"}`}
                        />
                    </button>
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-brand-500 text-white rounded"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add"}
                </button>
            </form>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-2">
                <div className="text-sm text-gray-600 dark:text-gray-300 space-x-6">
                    <span>Last iOS sync: {formatDate(syncStatus.ios.lastSyncTime)}</span>
                    <span>Last Android sync: {formatDate(syncStatus.android.lastSyncTime)}</span>
                </div>
                <div className="flex gap-3">
                    {["ios", "android"].map((platform) => {
                        const isBusy = syncStatus[platform as "ios" | "android"].isSyncing || localSyncing[platform as "ios" | "android"];
                        return (
                            <button
                                key={platform}
                                onClick={() => triggerPlatformSync(platform as "ios" | "android")}
                                disabled={isBusy}
                                className={`flex items-center gap-2 px-4 py-2 ${platform === "ios" ? "bg-blue-500" : "bg-green-600"
                                    } text-white rounded disabled:opacity-60`}
                            >
                                {isBusy ? (
                                    <>
                                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                        <span>{`Syncing ${platform}...`}</span>
                                    </>
                                ) : (
                                    <span>{`Sync ${platform}`}</span>
                                )}
                            </button>
                        );
                    })}

                </div>
            </div>

            {error && (
                <div className="text-red-600 bg-red-50 border border-red-200 p-3 rounded">
                    {error}
                </div>
            )}

            <table className="w-full table-auto border text-left text-sm">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                        <th className="p-2">Name</th>
                        <th className="p-2">Platform</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Publisher</th>
                        <th className="p-2">App List Updated</th>
                        <th className="p-2">Apps Scraped</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {developers.map((dev) => (
                        <tr key={dev.developerId} className="border-t">
                            <td className="p-2">
                                <a
                                    href={dev.platform === "ios"
                                        ? `https://apps.apple.com/us/developer/id${dev.developerId}`
                                        : dev.url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {dev.name}
                                </a>
                            </td>


                            <td className="p-2">{dev.platform}</td>
                            <td className="p-2">
                                <span className={`px-2 py-1 rounded text-xs ${dev.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {dev.active ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td className="p-2">
                                <button
                                    onClick={() => togglePublisher(dev)}
                                    className={`text-xs px-2 py-1 rounded ${dev.isPublisher ? "bg-green-500" : "bg-gray-400"} text-white`}
                                >
                                    {dev.isPublisher ? "Publisher" : "Not Publisher"}
                                </button>
                            </td>
                            <td className="p-2">{formatDate(dev.appsLastUpdatedAt)}</td>
                            <td className="p-2">{formatDate(dev.appsLastScrapedAt)}</td>
                            <td className="p-2 space-x-2 flex flex-wrap">
                                <button
                                    onClick={() => toggleStatus(dev)}
                                    className="text-xs px-3 py-1 bg-blue-500 text-white rounded"
                                >
                                    {dev.active ? "Deactivate" : "Activate"}
                                </button>
                                <button
                                    onClick={() => handleDelete(dev.developerId)}
                                    className="text-xs px-3 py-1 bg-red-600 text-white rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
