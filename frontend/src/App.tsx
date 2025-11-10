import { useState } from "react";
import { RoutesPage } from "./pages/RoutesPage";
import { ComparePage } from "./pages/ComparePage";
import { BankingPage } from "./pages/BankingPage";
import { PoolingPage } from "./pages/PoolingPage";
import { AboutPage } from "./pages/AboutPage";
import { Layout } from "@/shared/Layout";

export default function App() {
  const [tab, setTab] = useState("routes");

  const tabs = [
    { id: "routes", label: "Routes" },
    { id: "compare", label: "Compare" },
    { id: "banking", label: "Banking" },
    { id: "pooling", label: "Pooling" },
    { id: "about", label: "About" },
  ];

  return (
    <Layout>
      <div className="flex">
        <aside className="w-56 h-[calc(100vh-64px)] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-2 sticky top-[64px] transition-colors">
          <h2 className="text-sm uppercase text-gray-500 dark:text-gray-400 tracking-wide mb-3">Navigation</h2>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full text-left px-3 py-2 rounded transition ${
                tab === t.id
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-700"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </aside>

        <section className="flex-1 pl-6">
          {tab === "routes" && <RoutesPage />}
          {tab === "compare" && <ComparePage />}
          {tab === "banking" && <BankingPage />}
          {tab === "pooling" && <PoolingPage />}
          {tab === "about" && <AboutPage />}
        </section>
      </div>
    </Layout>
  );
}
