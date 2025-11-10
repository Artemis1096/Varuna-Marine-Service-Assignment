import { useState } from "react";
import { RoutesPage } from "./pages/RoutesPage";
import { ComparePage } from "./pages/ComparePage";
import { BankingPage } from "./pages/BankingPage";
import { PoolingPage } from "./pages/PoolingPage";
import { Layout } from "@/shared/Layout";

export default function App() {
  const [tab, setTab] = useState("routes");

  const tabs = [
    { id: "routes", label: "Routes" },
    { id: "compare", label: "Compare" },
    { id: "banking", label: "Banking" },
    { id: "pooling", label: "Pooling" }
  ];

  return (
    <Layout>
      <div className="flex gap-6">

        <aside className="w-48 border-r pr-4">
          <nav className="flex flex-col gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`text-left px-3 py-2 rounded text-white hover:bg-blue-50 ${
                  tab === t.id ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex-1">
          {tab === "routes" && <RoutesPage />}
          {tab === "compare" && <ComparePage />}
          {tab === "banking" && <BankingPage />}
          {tab === "pooling" && <PoolingPage />}
        </section>

      </div>
    </Layout>
  );
}
