import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  FileSearch,
  AlertTriangle,
  History,
  FileText,
  Settings,
  Search,
  UserCircle,
  Bell,
  DollarSign,
  TrendingUp,
  AlertOctagon,
  Download,
  ShieldCheck,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  User,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  FileSpreadsheet, // Ikon baru untuk Excel
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  Line,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { motion, AnimatePresence, animate } from "framer-motion";

// -- API CONFIGURATION --
const API_BASE_URL = "http://localhost:5000/api";

// Warna untuk Pie Chart
const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

// -- Helper untuk Fetching Data --
const useFetch = (endpoint, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token") || "dev-token-12345";

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Please login or check API token");
        }
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.warn(`Failed to fetch ${endpoint}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { data, loading, error, refetch: fetchData };
};

// -- Komponen Utama Aplikasi --
export default function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "light";
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsSidebarOpen(false);
      } else {
        setIsMobile(false);
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handlePageChange = (newPage) => {
    if (newPage === page) return;
    setIsLoadingPage(true);
    setPage(newPage);
    if (isMobile) setIsSidebarOpen(false);
    setTimeout(() => setIsLoadingPage(false), 600);
  };

  const renderPage = () => {
    if (isLoadingPage) return <LoadingSkeleton key="loading" />;

    switch (page) {
      case "dashboard":
        return <DashboardPage key="dashboard" />;
      case "analysis":
        return <ClaimAnalysisPage key="analysis" />;
      case "alerts":
        return <AlertsPage key="alerts" />;
      case "audit":
        return <AuditTrailPage key="audit" />;
      case "reports":
        return <ReportsPage key="reports" />;
      case "settings":
        return (
          <SettingsPage
            key="settings"
            theme={theme}
            toggleTheme={toggleTheme}
          />
        );
      default:
        return <DashboardPage key="dashboard" />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-gray-800 dark:text-slate-300 font-sans transition-colors duration-300 overflow-hidden relative">
      <BackgroundBlobs />

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        activePage={page}
        setPage={handlePageChange}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />

      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out relative z-10 ${
          !isMobile && isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto scroll-smooth">
          <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// -- Visual Components --
const BackgroundBlobs = () => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-700" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl animate-bounce duration-[10s]" />
  </div>
);

const LoadingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-6 animate-pulse"
  >
    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"
        ></div>
      ))}
    </div>
    <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
  </motion.div>
);

// -- Sidebar --
const Sidebar = ({
  activePage,
  setPage,
  isSidebarOpen,
  toggleSidebar,
  isMobile,
}) => {
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, page: "dashboard" },
    { name: "Claim Analysis", icon: FileSearch, page: "analysis" },
    { name: "Alerts", icon: AlertTriangle, page: "alerts" },
    { name: "Audit Trail", icon: History, page: "audit" },
    { name: "Reports", icon: FileText, page: "reports" },
    { name: "Settings", icon: Settings, page: "settings" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full z-30 w-64 p-6 flex flex-col flex-shrink-0 
                   bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl 
                   border-r border-white/40 dark:border-slate-700/40
                   shadow-2xl lg:shadow-none
                   transition-transform duration-300 ease-in-out 
                   ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="text-emerald-500 drop-shadow-md" size={28} />
          <h3 className="text-2xl font-bold text-gray-700 dark:text-slate-200 tracking-tight">
            SATRIA JKN
          </h3>
        </div>
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.page}
            Icon={item.icon}
            label={item.name}
            isActive={activePage === item.page}
            onClick={() => setPage(item.page)}
          />
        ))}
      </nav>
      <div className="mt-auto pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center space-x-3 p-3 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
            SJ
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
              BPJS Kesehatan
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              Connected to API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// -- Header --
const Header = ({ theme, toggleTheme, toggleSidebar }) => {
  const { data: stats } = useFetch("/dashboard/overview", {
    recent_alerts: [],
  });
  const notifications = stats?.recent_alerts || [];

  return (
    <header
      className="flex-shrink-0 p-4 lg:px-8 lg:py-5 relative z-20 
                   bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl 
                   border-b border-white/40 dark:border-slate-700/40 sticky top-0"
    >
      <div className="flex justify-between items-center space-x-4">
        <div className="flex items-center flex-1 min-w-0 gap-4">
          <GlassButton onClick={toggleSidebar} className="lg:hidden">
            <Menu size={20} />
          </GlassButton>
          <div
            className="hidden md:flex items-center w-full max-w-md rounded-full 
                        bg-white/40 dark:bg-slate-800/40 
                        border border-white/50 dark:border-slate-600/30
                        shadow-sm focus-within:shadow-md focus-within:border-emerald-400 transition-all
                        px-4 py-2.5"
          >
            <Search className="text-gray-400 dark:text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search Claims ID, Provider..."
              className="bg-transparent ml-3 w-full outline-none placeholder-gray-400 dark:placeholder-slate-500 text-gray-700 dark:text-slate-200 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <GlassButton onClick={toggleTheme}>
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </GlassButton>
          <NotificationDropdown notifications={notifications} />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};

// -- Dashboard Page (Integrated) --
const DashboardPage = () => {
  const { data: stats, loading: loadingStats } = useFetch(
    "/dashboard/overview",
    {
      total_claims: 0,
      detected_anomalies: 0,
      savings: 0,
      fraud_alerts: { active: 0, total: 0 },
      recent_alerts: [],
    }
  );

  const { data: trendsData } = useFetch("/dashboard/trends", {
    labels: [],
    data: [],
  });
  const trends = trendsData?.data || [];
  const recentAlerts = stats?.recent_alerts || [];

  return (
    <motion.div
      className="space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-2xl font-bold text-gray-800 dark:text-slate-100 tracking-tight">
            Dashboard Overview
          </h4>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Real-time data from Fraud Detection System.
          </p>
        </div>
        <div className="hidden md:block">
          <AppButton>Download Report</AppButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Claims"
          value={loadingStats ? 0 : stats?.total_claims}
          unit=""
          Icon={TrendingUp}
          gradient="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Anomalies Detected"
          value={loadingStats ? 0 : stats?.fraud_alerts?.active || 0}
          prefix=""
          Icon={AlertOctagon}
          gradient="from-red-500 to-red-600"
        />
        <StatCard
          title="Potential Savings"
          value={loadingStats ? 0 : Math.floor((stats?.savings || 0) / 1000000)}
          unit="M"
          prefix="Rp "
          Icon={DollarSign}
          gradient="from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Pending Review"
          value={loadingStats ? 0 : stats?.fraud_alerts?.active || 0}
          Icon={FileSearch}
          gradient="from-amber-500 to-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        <div className="lg:col-span-2 h-full">
          <SoftCard className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-lg font-bold text-gray-700 dark:text-slate-200">
                Claim Trends Analysis
              </h5>
              <div className="flex gap-2">
                <div className="flex items-center text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                  Claims
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 mr-1"></span>
                  Anomalies
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              {trends && trends.length > 0 ? (
                <ClaimTrendsChart data={trends} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  {loadingStats
                    ? "Loading chart..."
                    : "No trend data available"}
                </div>
              )}
            </div>
          </SoftCard>
        </div>

        <div className="h-full">
          <SoftCard className="h-full flex flex-col relative overflow-hidden">
            <h5 className="text-lg font-bold text-gray-700 dark:text-slate-200 mb-6">
              System Health
            </h5>
            <div className="space-y-6 relative z-10">
              <ProgressItem
                label="API Connection"
                percent={100}
                color="bg-emerald-500"
              />
              <ProgressItem
                label="Model Confidence"
                percent={92.5}
                color="bg-blue-500"
              />
              <ProgressItem
                label="Database Latency"
                percent={15}
                color="bg-purple-500"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl"></div>
          </SoftCard>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-bold text-gray-700 dark:text-slate-200 mb-4">
          Recent High Priority Alerts
        </h4>
        <TableCard
          headers={["Alert ID", "Klaim ID", "Risk Level", "Date", "Action"]}
          data={(recentAlerts || [])
            .slice(0, 5)
            .map((alert) => [
              <span className="font-mono text-gray-500">
                {alert.alert_id?.substring(0, 8) || "N/A"}...
              </span>,
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {alert.klaim_id?.substring(0, 8) || "N/A"}...
              </span>,
              <StatusBadge status={alert.alert_level || "High"} />,
              new Date(alert.created_at).toLocaleDateString() || "N/A",
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                {alert.action || "Review"}
              </button>,
            ])}
        />
      </div>
    </motion.div>
  );
};

// -- Analysis Page (Integrated) --
const ClaimAnalysisPage = () => {
  const { data: anomalyChartData } = useFetch("/klaim/anomaly-chart", {
    labels: [],
    data: [],
  });
  const { data: claims, loading } = useFetch("/klaim", []);

  // Konversi data chart menjadi format untuk pie chart
  const anomalyData = anomalyChartData?.data || [];
  const totalNormal = anomalyData.reduce((sum, d) => sum + (d.normal || 0), 0);
  const totalAnomalous = anomalyData.reduce(
    (sum, d) => sum + (d.anomalous || 0),
    0
  );

  const pieData = [
    { name: "Normal Claims", value: totalNormal },
    { name: "Anomalous Claims", value: totalAnomalous },
  ].filter((d) => d.value > 0);

  return (
    <motion.div
      className="space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex justify-between items-center">
        <h4 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
          Claim Analysis
        </h4>
        <div className="flex gap-2">
          <FilterButton label="Last 30 Days" />
          <FilterButton label="Filter Status" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[350px]">
        <SoftCard className="h-full flex flex-col">
          <h5 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-2">
            Anomaly Detection (Last 4 Weeks)
          </h5>
          <div className="flex-1 min-h-0">
            <AnomalyDetectionChart data={anomalyChartData?.data || []} />
          </div>
        </SoftCard>

        <SoftCard className="h-full flex flex-col">
          <h5 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-2">
            Fraud Composition
          </h5>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SoftCard>
      </div>

      <SoftCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between">
          <h5 className="font-semibold dark:text-white">Claims Data</h5>
          {loading && (
            <span className="text-sm text-gray-500 animate-pulse">
              Loading data...
            </span>
          )}
        </div>
        <TableCard
          noCard
          headers={["Claim No", "Provider", "Date", "Amount", "Status"]}
          data={(claims || []).map((c) => [
            c.nomor_klaim || "N/A",
            c.provider || "N/A",
            c.tgl_pengajuan?.split(" ")[0] || c.tgl_pengajuan || "N/A",
            `Rp ${parseInt(c.total_biaya || 0).toLocaleString()}`,
            <StatusBadge status={c.status || "Pending"} />,
          ])}
        />
      </SoftCard>
    </motion.div>
  );
};

// -- Alerts Page (Integrated) --
const AlertsPage = () => {
  const { data: alerts, loading } = useFetch("/alerts", []);
  const { data: summary } = useFetch("/alerts/summary", {
    high_risk: 0,
    medium_risk: 0,
    low_risk: 0,
    total: 0,
  });

  return (
    <motion.div
      className="space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h4 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
        Fraud Alerts Management
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="High Risk"
          value={summary?.high_risk || 0}
          prefix=""
          Icon={AlertTriangle}
          gradient="from-red-500 to-red-600"
        />
        <StatCard
          title="Medium Risk"
          value={summary?.medium_risk || 0}
          prefix=""
          Icon={AlertTriangle}
          gradient="from-amber-500 to-amber-600"
        />
        <StatCard
          title="Low Risk"
          value={summary?.low_risk || 0}
          prefix=""
          Icon={AlertCircle}
          gradient="from-blue-500 to-blue-600"
        />
      </div>

      <SoftCard className="p-0 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-700">
          <h5 className="font-semibold dark:text-white">All Alerts</h5>
        </div>
        <TableCard
          noCard
          headers={["Alert ID", "Klaim ID", "Risk Level", "Date", "Action"]}
          data={(alerts || []).map((a) => [
            a.alert_id?.substring(0, 8) || "N/A",
            a.klaim_id?.substring(0, 8) || "N/A",
            <StatusBadge status={a.alert_level || "Medium"} />,
            new Date(a.created_at).toLocaleDateString() || "N/A",
            <div className="flex gap-2">
              <button className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                {a.action || "Review"}
              </button>
              <button className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                {a.is_resolved ? "Resolved" : "Flag"}
              </button>
            </div>,
          ])}
        />
        {loading && (
          <div className="p-4 text-center text-gray-500">Loading alerts...</div>
        )}
      </SoftCard>
    </motion.div>
  );
};

// -- Audit Trail Page (Integrated) --
const AuditTrailPage = () => {
  const { data: logs, loading } = useFetch("/audit-trail", []);

  return (
    <motion.div
      className="space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <h4 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
        System Audit Logs
      </h4>
      <SoftCard className="p-0 overflow-hidden">
        <TableCard
          noCard
          headers={["Timestamp", "User", "Action", "Entity", "Details"]}
          data={(logs || []).map((log) => [
            new Date(log.timestamp || log.created_at).toLocaleString(),
            log.user_id?.substring(0, 8) || log.user || "System",
            <span className="font-semibold">{log.action || "N/A"}</span>,
            log.entity_type || log.entity || "N/A",
            log.description || log.details || "N/A",
          ])}
        />
        {loading && (
          <div className="p-4 text-center text-gray-500">Fetching logs...</div>
        )}
      </SoftCard>
    </motion.div>
  );
};

// -- Reports Page (Updated for Download) --
const ReportsPage = () => {
  const { data: reportsRaw, loading, refetch } = useFetch("/reports", []);
  const [generating, setGenerating] = useState(false);

  // Normalize rows coming from backend: backend returns fields like report_id, type, created_at
  const reports = (reportsRaw || []).map((r) => ({
    report_id: r.report_id || r.id || r.reportId || r.report_id,
    type: r.type || r.name || r.type,
    created_at: r.created_at || r.createdAt || r.created_at || r.date,
    status: r.status || "Ready",
    raw: r,
  }));

  // helper: convert array of objects to CSV
  const jsonToCsv = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    const keys = Object.keys(arr[0]);
    const lines = [keys.join(",")];
    for (const obj of arr) {
      const row = keys.map((k) => {
        const val = obj[k] == null ? "" : String(obj[k]).replace(/"/g, '""');
        return `"${val}"`;
      });
      lines.push(row.join(","));
    }
    return lines.join("\n");
  };

  // Fungsi download: backend returns stored report JSON; convert to CSV when requested
  const handleDownload = async (reportId, format) => {
    try {
      const token = localStorage.getItem("token") || "dev-token-12345";
      const response = await fetch(
        `${API_BASE_URL}/reports/${reportId}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Download failed");

      const payload = await response.json();

      // app.py stores `data` as JSON string within the record
      let content = payload.data || payload;
      if (typeof content === "string") {
        try {
          content = JSON.parse(content);
        } catch (e) {
          /* keep string */
        }
      }

      if (format === "xlsx" || format === "csv") {
        // Prefer array-of-objects -> CSV
        let csv = "";
        if (Array.isArray(content)) {
          csv = jsonToCsv(content);
        } else if (content && typeof content === "object") {
          // if object with arrays, try to stringify
          const keys = Object.keys(content);
          if (keys.length === 2 && Array.isArray(content[keys[1]])) {
            csv = jsonToCsv(content[keys[1]]);
          } else {
            csv = jsonToCsv([content]);
          }
        } else {
          csv = String(content);
        }

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${reportId}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return;
      }

      // Default: download JSON
      const blob = new Blob([JSON.stringify(content, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error(e);
      alert(
        "Gagal mengunduh laporan. Pastikan backend berjalan dan report tersedia."
      );
    }
  };

  // Fungsi Generate Report Baru — kirim tanggal default (last 30 days) dan type default
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem("token") || "dev-token-12345";
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);

      const fmt = (d) =>
        `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
          d.getDate()
        ).padStart(2, "0")}/${d.getFullYear()}`;

      const response = await fetch(`${API_BASE_URL}/reports/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "Fraud Summary",
          start_date: fmt(start),
          end_date: fmt(end),
        }),
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(txt || "Generate failed");
      }

      // refresh list after generation
      await refetch();
      alert("Laporan berhasil digenerate (jika backend memproses).");
    } catch (e) {
      console.error("Generate failed", e);
      alert("Gagal generate laporan. Periksa console untuk detail.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="flex justify-between items-center">
        <h4 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
          Generated Reports
        </h4>
        <AppButton onClick={handleGenerate} disabled={generating}>
          {generating ? "Generating..." : "Generate New Report"}
        </AppButton>
      </div>

      <SoftCard className="p-0 overflow-hidden">
        <TableCard
          noCard
          headers={["Report ID", "Name", "Generated Date", "Status", "Actions"]}
          data={(reports || []).map((r) => [
            r.report_id,
            r.type,
            r.created_at ? new Date(r.created_at).toLocaleString() : "-",
            <StatusBadge status={r.status} />,
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload(r.report_id, "json")}
                className="flex items-center text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-medium border border-red-200"
              >
                <FileText size={14} className="mr-1" /> JSON
              </button>
              <button
                onClick={() => handleDownload(r.report_id, "xlsx")}
                className="flex items-center text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors font-medium border border-emerald-200"
              >
                <FileSpreadsheet size={14} className="mr-1" /> CSV
              </button>
            </div>,
          ])}
        />
        {loading && (
          <div className="p-4 text-center text-gray-500">
            Loading reports...
          </div>
        )}
      </SoftCard>
    </motion.div>
  );
};

// -- Settings Page (Integrated) --
const SettingsPage = ({ theme, toggleTheme }) => {
  const { data: settings } = useFetch("/settings", {
    system_name: "SATRIA JKN",
    version: "1.0.0",
  });

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl"
    >
      <h4 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6">
        Settings
      </h4>

      <SoftCard className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-700">
          <div>
            <p className="font-semibold dark:text-white">Appearance</p>
            <p className="text-sm text-gray-500">
              Customize how SATRIA JKN looks on your device.
            </p>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => theme === "dark" && toggleTheme()}
              className={`p-2 rounded-md transition-all ${
                theme === "light"
                  ? "bg-white shadow text-emerald-600"
                  : "text-gray-500"
              }`}
            >
              <Sun size={20} />
            </button>
            <button
              onClick={() => theme === "light" && toggleTheme()}
              className={`p-2 rounded-md transition-all ${
                theme === "dark"
                  ? "bg-slate-600 shadow text-emerald-400"
                  : "text-gray-500"
              }`}
            >
              <Moon size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <SoftInput
            label="System Name"
            value={settings?.system_name}
            readOnly
          />
          <SoftInput label="API Version" value={settings?.version} readOnly />
          <SoftInput label="API Endpoint" value={API_BASE_URL} readOnly />
        </div>

        <div className="pt-4">
          <AppButton className="w-full">Save Configuration</AppButton>
        </div>
      </SoftCard>
    </motion.div>
  );
};

// -- Helper Components --

const AlertCircle = (props) => <AlertOctagon {...props} />; // Fallback icon

const ProgressItem = ({ label, percent, color }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">
        {label}
      </span>
      <span className="text-xs font-bold text-gray-700 dark:text-slate-300">
        {percent}%
      </span>
    </div>
    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`${color} h-2 rounded-full`}
      ></motion.div>
    </div>
  </div>
);

const NavItem = ({ Icon, label, isActive, onClick }) => {
  const activeStyle =
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-semibold shadow-sm border border-emerald-100 dark:border-emerald-500/20";
  const inactiveStyle =
    "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200";

  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
        isActive ? activeStyle : inactiveStyle
      }`}
    >
      <Icon
        size={20}
        className={`transition-transform group-hover:scale-110 ${
          isActive ? "stroke-2" : "stroke-[1.5]"
        }`}
      />
      <span>{label}</span>
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500"
        />
      )}
    </div>
  );
};

const AppButton = ({
  children,
  onClick,
  flat = false,
  size = "md",
  className = "",
  disabled,
}) => {
  const baseStyle =
    "rounded-xl font-semibold transition-all duration-200 flex items-center justify-center active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = flat
    ? "bg-transparent border border-slate-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${styles} px-5 py-2.5 text-sm ${className}`}
    >
      {children}
    </button>
  );
};

const GlassButton = ({ children, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`
      p-2.5 rounded-xl text-gray-600 dark:text-slate-300
      bg-white/50 dark:bg-slate-800/50 
      hover:bg-white dark:hover:bg-slate-700
      border border-white/20 dark:border-slate-600/20
      shadow-sm backdrop-blur-sm
      transition-all duration-200 active:scale-95
      ${className}
    `}
  >
    {children}
  </button>
);

const SoftCard = ({ children, className = "" }) => (
  <div
    className={`
    bg-white/80 dark:bg-slate-800/80 
    backdrop-blur-md
    rounded-2xl 
    shadow-xl shadow-slate-200/50 dark:shadow-black/30
    border border-white/50 dark:border-slate-700/50
    p-6 ${className}
  `}
  >
    {children}
  </div>
);

const StatCard = ({ title, value, unit, prefix, Icon, gradient }) => {
  const isNumeric = typeof value === "number";
  return (
    <SoftCard className="p-5 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <span className="text-sm font-medium text-gray-500 dark:text-slate-400 block mb-1">
            {title}
          </span>
          <span className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
            {prefix}
            {isNumeric ? <AnimatedNumber value={value} /> : value}
            {unit}
          </span>
        </div>
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
        >
          <Icon size={24} />
        </div>
      </div>
      <div
        className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${gradient}`}
      ></div>
    </SoftCard>
  );
};

const SoftInput = ({ label, type = "text", value, readOnly }) => (
  <div className="flex flex-col">
    <label className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
      {label}
    </label>
    <input
      type={type}
      defaultValue={value}
      readOnly={readOnly}
      className={`
        w-full rounded-xl bg-slate-50 dark:bg-slate-900/50
        text-gray-700 dark:text-slate-200
        border border-slate-200 dark:border-slate-700
        focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20
        transition-all duration-200
        px-4 py-3 outline-none text-sm
      `}
    />
  </div>
);

const FilterButton = ({ label }) => (
  <button className="text-xs font-medium text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-200 dark:border-slate-600 hover:border-emerald-500 transition-all shadow-sm flex items-center gap-1">
    {label} <ChevronRight size={12} className="rotate-90" />
  </button>
);

const TableCard = ({ headers, data, noCard = false }) => {
  const content = (
    <div className="w-full overflow-x-auto">
      <table className="w-full whitespace-nowrap">
        <thead className="bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-700">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="p-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                className="border-b border-slate-50 dark:border-slate-700/50 last:border-none hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="p-4 text-sm text-gray-700 dark:text-slate-300"
                  >
                    {cell}
                  </td>
                ))}
              </motion.tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="p-8 text-center text-gray-400 italic"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  return noCard ? (
    content
  ) : (
    <SoftCard className="p-0 overflow-hidden">{content}</SoftCard>
  );
};

const StatusBadge = ({ status }) => {
  const safeStatus = status || "Unknown";
  const styles = {
    "High Risk":
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    High: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    Resolved:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    "Medium Risk":
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    Medium:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    Anomalous: "bg-orange-100 text-orange-700 border-orange-200",
    Low: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    Normal:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    Pending: "bg-gray-100 text-gray-700 border-gray-200",
    Ready: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
        styles[safeStatus] || "bg-gray-100 text-gray-600"
      } flex items-center w-fit gap-1.5`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          safeStatus.includes("High")
            ? "bg-red-500 animate-pulse"
            : "bg-current"
        }`}
      ></span>
      {safeStatus}
    </span>
  );
};

const NotificationDropdown = ({ notifications = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayNotifs = notifications?.slice(0, 5) || [];

  return (
    <div className="relative" ref={dropdownRef}>
      <GlassButton onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell size={18} />
        {displayNotifs.length > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </GlassButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 bg-white/90 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
              <h5 className="font-semibold text-sm dark:text-white">
                Notifications
              </h5>
              <span className="text-xs text-emerald-500 font-medium cursor-pointer">
                Mark all read
              </span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {displayNotifs.length > 0 ? (
                displayNotifs.map((n, i) => (
                  <div
                    key={i}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-50 dark:border-slate-700/50 last:border-0 flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-800 dark:text-slate-200">
                        {n.reason_code || "Fraud Alert"}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">
                        Risk: {n.alert_level || "High"}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {n.created_at
                          ? new Date(n.created_at).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-500">
                  No new notifications
                </div>
              )}
            </div>
            <div className="p-3 bg-gray-50 dark:bg-slate-800/50 text-center border-t border-gray-100 dark:border-slate-700">
              <button className="text-xs font-medium text-gray-600 dark:text-slate-300 hover:text-emerald-500 transition-colors">
                View All Alerts
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <GlassButton onClick={() => setIsOpen(!isOpen)}>
        <UserCircle size={18} />
      </GlassButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-64 bg-white/90 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700 z-50 p-2"
          >
            <div className="flex items-center p-3 mb-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                A
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-gray-800 dark:text-white">
                  Admin Verifikator
                </p>
                <p className="text-xs text-gray-500 dark:text-emerald-300">
                  admin@bpjs.go.id
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <MenuItem icon={User} label="Profile Settings" />
              <MenuItem icon={Settings} label="Preferences" />
              <div className="h-px bg-gray-200 dark:bg-slate-700 my-1"></div>
              <MenuItem icon={LogOut} label="Sign Out" danger />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuItem = ({ icon: Icon, label, danger }) => (
  <button
    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors
    ${
      danger
        ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        : "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700"
    }`}
  >
    <Icon size={16} />
    <span>{label}</span>
    {!danger && <ChevronRight size={14} className="ml-auto opacity-50" />}
  </button>
);

function AnimatedNumber({ value }) {
  const nodeRef = useRef(null);
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(latest) {
        node.textContent = Math.round(latest).toLocaleString("id-ID");
      },
    });
    return () => controls.stop();
  }, [value]);
  return <span ref={nodeRef}>0</span>;
}

const pageVariants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.2 } },
};

const ClaimTrendsChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart
      data={data}
      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
    >
      <CartesianGrid
        strokeDasharray="3 3"
        vertical={false}
        strokeOpacity={0.1}
        stroke="currentColor"
      />
      <XAxis
        dataKey="name"
        axisLine={false}
        tickLine={false}
        tick={{ fill: "#94a3b8", fontSize: 12 }}
        dy={10}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fill: "#94a3b8", fontSize: 12 }}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "12px",
          border: "none",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        }}
        itemStyle={{ color: "#334155", fontSize: "12px", fontWeight: "600" }}
      />
      <Line
        type="monotone"
        dataKey="claims"
        stroke="#3b82f6"
        strokeWidth={3}
        dot={false}
        activeDot={{ r: 6, strokeWidth: 0 }}
      />
      <Line
        type="monotone"
        dataKey="anomalies"
        stroke="#10b981"
        strokeWidth={3}
        dot={false}
        activeDot={{ r: 6, strokeWidth: 0 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

const AnomalyDetectionChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
      <CartesianGrid
        strokeDasharray="3 3"
        vertical={false}
        strokeOpacity={0.1}
        stroke="currentColor"
      />
      <XAxis
        dataKey="name"
        axisLine={false}
        tickLine={false}
        tick={{ fill: "#94a3b8", fontSize: 11 }}
        dy={10}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fill: "#94a3b8", fontSize: 12 }}
      />
      <Tooltip
        cursor={{ fill: "transparent" }}
        contentStyle={{
          borderRadius: "10px",
          border: "none",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        }}
      />
      <Bar dataKey="normal" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
      <Bar
        dataKey="anomalous"
        stackId="a"
        fill="#ef4444"
        radius={[6, 6, 0, 0]}
      />
      <Legend />
    </BarChart>
  </ResponsiveContainer>
);
