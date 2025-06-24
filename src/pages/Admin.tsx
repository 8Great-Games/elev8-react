import { useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import DeveloperTab from "../components/admin/DeveloperTab";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("developers");

  return (
    <div>
      <PageMeta
        title="Elev8 | Admin Panel"
        description="Admin panel for managing app and developer data"
      />

      <PageBreadcrumb
        items={[
          { name: "Admin" }
        ]}
      />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("developers")}
              className={`whitespace-nowrap pb-2 text-sm font-medium ${
                activeTab === "developers"
                  ? "border-b-2 border-brand-500 text-brand-600 dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Developer Management
            </button>
            {/* Future tab example:
            <button className="text-gray-400 cursor-not-allowed">User Roles</button> */}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "developers" && <DeveloperTab />}
      </div>
    </div>
  );
}
