import { RoutesPage } from "./pages/RoutesPage";
import { ComparePage } from "./pages/ComparePage";
import { BankingPage } from "./pages/BankingPage";
import { useState } from "react";

export default function App() {
  const [tab, setTab] = useState<"routes" | "compare" | "banking">("routes");

  return (
    <div>
      <div className="flex gap-4 p-4 border-b bg-gray-50">
        <button onClick={() => setTab("routes")}>Routes</button>
        <button onClick={() => setTab("compare")}>Compare</button>
        <button onClick={() => setTab("banking")}>Banking</button>
      </div>

      {tab === "routes" && <RoutesPage />}
      {tab === "compare" && <ComparePage />}
      {tab === "banking" && <BankingPage />}
    </div>
  );
}
