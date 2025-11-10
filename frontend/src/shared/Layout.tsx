export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">

      <header className="border-b bg-white px-6 py-3 shadow-sm flex items-center justify-between">
        <h1 className="font-semibold text-lg">FuelEU Maritime Dashboard</h1>
      </header>

      <main className="w-full py-8 px-4">
        {children}
      </main>

    </div>
  );
}

