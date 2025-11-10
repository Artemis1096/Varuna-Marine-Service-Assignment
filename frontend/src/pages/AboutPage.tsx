import {
  pageContainer,
  sectionSpacing,
  pageTitle,
  cardContent,
} from "@/shared/theme";

export function AboutPage() {
  return (
    <div className={pageContainer}>
      <div className={sectionSpacing}>
        <h1 className={pageTitle}>
          About FuelEU Maritime Compliance Platform
        </h1>
        
        <div className={cardContent}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Platform Purpose</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            The FuelEU Maritime Compliance Platform is a comprehensive system designed to help maritime operators 
            comply with the European Union's FuelEU Maritime Regulation. This regulation aims to reduce greenhouse 
            gas (GHG) emissions from the maritime transport sector by setting intensity targets and implementing 
            compliance mechanisms.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
            The platform enables operators to:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-2 text-gray-700 dark:text-gray-300 ml-4">
            <li>Track and manage shipping routes with their associated fuel consumption and emissions data</li>
            <li>Compare GHG intensities against baseline routes to assess compliance</li>
            <li>Calculate Compliance Balance (CB) to determine surplus or deficit positions</li>
            <li>Bank surplus compliance credits for future use (Article 20)</li>
            <li>Apply banked credits to offset deficits</li>
            <li>Create pooling groups to redistribute compliance balances among multiple routes (Article 21)</li>
          </ul>
        </div>

        <div className={cardContent}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Key Concepts</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">GHG Intensity</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Measured in grams of CO₂ equivalent per megajoule (gCO₂e/MJ). This represents the well-to-wake 
                (WtW) emissions intensity, including both well-to-tank (WtT) and tank-to-wake (TtW) emissions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Compliance Balance (CB)</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Calculated as: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">CB = (TARGET_INTENSITY - actual_intensity) × energy_MJ</code>
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                A positive CB indicates surplus (better than target), while a negative CB indicates deficit 
                (worse than target). The target intensity for 2025 is 89.3368 gCO₂e/MJ.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Baseline Route</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                A reference route used for comparing GHG intensities of other routes. Only one route can be 
                designated as the baseline at any given time.
              </p>
            </div>
          </div>
        </div>

        <div className={cardContent}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Page Descriptions</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Routes</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                The Routes page displays all shipping routes in the system with comprehensive information including:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1 ml-4">
                <li>Route codes and vessel types</li>
                <li>Origin and destination ports</li>
                <li>Distance traveled (in kilometers)</li>
                <li>Fuel type and consumption (in tonnes)</li>
                <li>Year of operation</li>
                <li>GHG intensity and total emissions</li>
                <li>Baseline status</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                <strong className="text-gray-900 dark:text-gray-100">Filtering:</strong> You can filter routes by vessel type, fuel type, and year to quickly find specific routes. 
                The filters dynamically update based on available data in the system.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                <strong className="text-gray-900 dark:text-gray-100">Baseline Management:</strong> You can designate any non-baseline route as the new baseline route, which will automatically 
                update comparisons across the system. The "Set Baseline" button shows a loading state during the operation.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Compare</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                The Compare page provides GHG intensity comparison analysis:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1 ml-4">
                <li>Compares each route's GHG intensity against the baseline route</li>
                <li>Calculates percentage difference from baseline</li>
                <li>Indicates compliance status (meets or exceeds target intensity)</li>
                <li>Displays visual charts showing baseline vs. comparison intensities</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                <strong className="text-gray-900 dark:text-gray-100">Compliance Calculation:</strong> The system calculates percentage difference using the formula: 
                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs ml-1">percentDiff = ((comparison / baseline) - 1) × 100</code>
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                <strong className="text-gray-900 dark:text-gray-100">Visualization:</strong> Interactive charts display baseline vs. comparison intensities, making it easy to identify 
                which routes are performing better or worse than the baseline and whether they meet the regulatory target intensity.
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Banking</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                The Banking page implements Article 20 of the FuelEU Maritime Regulation, allowing operators to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1 ml-4">
                <li>View Compliance Balance (CB) for a specific route and year</li>
                <li>Bank surplus CB (positive balance) for future use</li>
                <li>Apply previously banked surplus to offset current deficits (negative balance)</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                <strong className="text-gray-900 dark:text-gray-100">KPI Display:</strong> The page displays key performance indicators including CB (before), Applied amount, 
                and CB (after) in a clear, formatted view. Values are automatically formatted in tonnes or grams based on magnitude.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                <strong className="text-gray-900 dark:text-gray-100">Validation & Error Handling:</strong> The system validates all operations and provides clear error messages 
                with machine-readable error codes. Buttons are automatically disabled when operations are in progress or when 
                conditions are not met (e.g., cannot bank if CB ≤ 0, cannot apply if no deficit).
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                <strong className="text-gray-900 dark:text-gray-100">Banking Mechanism:</strong> Banking allows operators to carry forward compliance surpluses from one year to the next, 
                providing flexibility in meeting regulatory requirements. Banked credits can be applied to 
                routes with deficits in subsequent years.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">Pooling</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                The Pooling page implements Article 21 of the FuelEU Maritime Regulation, enabling operators to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1 ml-4">
                <li>Create pooling groups by selecting multiple routes</li>
                <li>Redistribute Compliance Balance (CB) among pool members</li>
                <li>View CB before and after pooling for each member route</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                <strong className="text-gray-900 dark:text-gray-100">Adjusted CB:</strong> The system uses adjusted CB values, which account for previously applied banked surplus. 
                This ensures accurate pooling calculations that reflect the current state of each route.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                <strong className="text-gray-900 dark:text-gray-100">Pool Validation:</strong> The system enforces strict validation rules:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1 ml-4 mt-1">
                <li>Pool sum (sum of all CB values) must be ≥ 0</li>
                <li>At least one deficit ship and one surplus ship must be selected</li>
                <li>No deficit ship can end up worse after pooling</li>
                <li>No surplus ship can end up negative after pooling</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                <strong className="text-gray-900 dark:text-gray-100">Visual Indicators:</strong> Pool sum is displayed with color-coded indicators (green for ≥ 0, red for &lt; 0). 
                The "Create Pool" button is automatically disabled if validation rules are not met.
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
                <strong className="text-gray-900 dark:text-gray-100">Pooling Mechanism:</strong> Pooling allows operators to combine routes with surpluses and deficits, redistributing the 
                total CB across all members using a greedy allocation algorithm. This mechanism helps optimize compliance across a fleet by 
                allowing routes with surpluses to offset deficits in other routes within the same pool.
              </p>
            </div>
          </div>
        </div>

        <div className={cardContent}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Core Formulas</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Target Intensity (2025)</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-mono">
                Target Intensity = 89.3368 gCO₂e/MJ
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Energy in Scope</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-mono mb-2">
                Energy (MJ) ≈ fuelConsumption × 41,000 MJ/t
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-xs">
                Where fuelConsumption is measured in tonnes (t)
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Compliance Balance</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-mono mb-2">
                CB = (Target − Actual) × Energy in scope
              </p>
              <div className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p>• <strong className="text-green-600 dark:text-green-400">Positive CB</strong> → Surplus (better than target)</p>
                <p>• <strong className="text-red-600 dark:text-red-400">Negative CB</strong> → Deficit (worse than target)</p>
              </div>
            </div>
          </div>
        </div>

        <div className={cardContent}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Reference</h2>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <p>
              All constants, CB formula, and banking/pooling rules follow the <strong className="text-gray-900 dark:text-gray-100">FuelEU Maritime Regulation (EU) 2023/1805</strong>, 
              specifically:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-3">
              <li><strong className="text-gray-900 dark:text-gray-100">Annex IV</strong> - Calculation methodologies and emission factors</li>
              <li><strong className="text-gray-900 dark:text-gray-100">Article 20</strong> - Banking of compliance surplus (pp. 104-107)</li>
              <li><strong className="text-gray-900 dark:text-gray-100">Article 21</strong> - Pooling of ships (pp. 104-107)</li>
            </ul>
            <p className="mt-4 text-xs text-gray-600 dark:text-gray-400 italic">
              Reference document: 2025-May-ESSF-SAPS-WS1-FuelEU-calculation-methodologies.pdf
            </p>
          </div>
        </div>

        <div className={cardContent}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">User Experience Features</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Shared UI Components</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                The platform uses consistent, reusable UI components across all pages:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 text-sm space-y-1 ml-4">
                <li><strong className="text-gray-900 dark:text-gray-100">ErrorBanner:</strong> Displays API errors with error codes and dismissible functionality</li>
                <li><strong className="text-gray-900 dark:text-gray-100">Loading:</strong> Shows loading states during async operations</li>
                <li><strong className="text-gray-900 dark:text-gray-100">SuccessBanner:</strong> Provides feedback for successful operations</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Normalized Error Handling</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                All API errors are handled consistently with machine-readable error codes. Errors are displayed 
                in user-friendly banners with the ability to dismiss them. Field-level validation errors are 
                shown directly under input fields for immediate feedback.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Button State Management</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                All action buttons automatically show loading states during operations and are disabled to prevent 
                duplicate submissions. Buttons are also intelligently disabled based on business rules (e.g., 
                cannot bank if CB ≤ 0, cannot apply if no deficit).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Theme System</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                The platform uses a centralized theme system with shared Tailwind CSS classNames, ensuring 
                consistent styling across all pages. This includes standardized tables, buttons, cards, KPIs, 
                and charts with proper spacing, shadows, and rounded corners.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Dark Mode Support</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                The entire platform supports dark mode with smooth transitions. The theme preference is 
                persisted in localStorage and automatically applied on page load. All components are designed 
                with dark mode-friendly colors.
              </p>
            </div>
          </div>
        </div>

        <div className={cardContent}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Technical Details</h2>
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Architecture:</strong> Hexagonal Architecture (Ports & Adapters) 
              for clean separation of business logic and infrastructure
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Backend:</strong> Node.js + TypeScript + Express + PostgreSQL + Prisma ORM
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Frontend:</strong> React + TypeScript + TailwindCSS + Recharts
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Emission Factors:</strong> Uses Annex II default pathway emission 
              factors from the FuelEU Maritime Regulation for calculating GHG intensities
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">UI Components:</strong> Shared components (ErrorBanner, Loading, SuccessBanner) 
              for consistent user experience across all pages
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Styling:</strong> Centralized theme system with Tailwind CSS classNames 
              for maintainable and consistent design
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

