import React, { useState, useEffect, useRef } from 'react';
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
  ShieldCheck, // Logo
  Sun,         // Ikon Tema
  Moon,         // Ikon Tema
  Menu // Ikon untuk Sidebar Toggle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  BarChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts'; // Import recharts
import { 
  motion, 
  AnimatePresence, 
  animate 
} from 'framer-motion';

// -- Data Mock untuk Grafik --
const claimTrendsData = [
  { name: 'Jan', claims: 4000, anomalies: 240 },
  { name: 'Feb', claims: 3000, anomalies: 139 },
  { name: 'Mar', claims: 2000, anomalies: 980 },
  { name: 'Apr', claims: 2780, anomalies: 390 },
  { name: 'Mei', claims: 1890, anomalies: 480 },
  { name: 'Jun', claims: 2390, anomalies: 380 },
  { name: 'Jul', claims: 3490, anomalies: 430 },
];

const anomalyData = [
  { name: 'Upcoding', value: 400 },
  { name: 'Fiktif', value: 300 },
  { name: 'Duplikat', value: 300 },
  { name: 'Unbundling', value: 200 },
  { name: 'Lainnya', value: 100 },
];

// -- Komponen Utama Aplikasi --
export default function App() {
  // State untuk tema, default mengambil dari localStorage atau 'light'
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  // State untuk sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Effect untuk mengubah class di <html> dan menyimpan ke localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Fungsi untuk toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  // Fungsi untuk me-render halaman
  const [page, setPage] = useState('dashboard');
  const renderPage = () => {
    switch(page) {
      case 'dashboard':
        return <DashboardPage key="dashboard" />;
      case 'analysis':
        return <ClaimAnalysisPage key="analysis" />;
      case 'alerts':
        return <AlertsPage key="alerts" />;
      case 'audit':
        return <AuditTrailPage key="audit" />;
      case 'reports':
        return <ReportsPage key="reports" />;
      case 'settings':
        return <SettingsPage key="settings" theme={theme} toggleTheme={toggleTheme} />;
      default:
        return <DashboardPage key="dashboard" />;
    }
  };

  return (
    // Container utama diubah ke "Soft UI": Latar belakang flat dan bersih
    // Transisi warna ditambahkan untuk perpindahan tema yang mulus
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 text-gray-800 dark:text-slate-300 font-sans transition-colors duration-300 overflow-hidden">
      <Sidebar activePage={page} setPage={setPage} isSidebarOpen={isSidebarOpen} />
      {/* Konten utama kini memiliki margin kiri yang disesuaikan dengan status sidebar */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <Header theme={theme} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />
        {/* Konten utama yang dapat di-scroll */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            {renderPage()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// -- Komponen Layout --

// Sidebar
const Sidebar = ({ activePage, setPage, isSidebarOpen }) => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
    { name: 'Claim Analysis', icon: FileSearch, page: 'analysis' },
    { name: 'Alerts', icon: AlertTriangle, page: 'alerts' },
    { name: 'Audit Trail', icon: History, page: 'audit' },
    { name: 'Reports', icon: FileText, page: 'reports' },
    { name: 'Settings', icon: Settings, page: 'settings' },
  ];

  return (
    // Sidebar kini "Glassmorphism"
    // Latar belakang transparan, blur, dan border halus
    <div className={`fixed top-0 left-0 h-full z-20 w-64 p-6 flex flex-col flex-shrink-0 
                   bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg 
                   border-r border-white/30 dark:border-slate-700/30
                   transition-transform duration-300 ease-in-out 
                   ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center space-x-2 mb-10">
        <ShieldCheck className="text-emerald-500" size={28} />
        <h3 className="text-2xl font-bold text-gray-700 dark:text-slate-200">SATRIA JKN</h3>
      </div>
      <nav className="flex flex-col space-y-3">
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
    </div>
  );
};

// Header
const Header = ({ theme, toggleTheme, toggleSidebar }) => {
  return (
    // Header kini "Glassmorphism"
    // Latar belakang transparan, blur, dan border halus
    <header className="flex-shrink-0 p-6 lg:p-8 relative z-10 
                   bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg 
                   border-b border-white/30 dark:border-slate-700/30">
      <div className="flex justify-between items-center space-x-4">
        <div className="flex items-center flex-1 min-w-0"> {/* Wrapper untuk Tombol Toggle + Search */}
          {/* Tombol Toggle Sidebar - Gaya baru untuk Glass */}
          <GlassButton onClick={toggleSidebar} className="mr-4">
            <Menu size={20} />
          </GlassButton>

          {/* Search Bar - Gaya baru untuk Glass */}
          <div className="flex items-center w-full max-w-lg rounded-full 
                       bg-white/50 dark:bg-slate-800/50 
                       shadow-[inset_2px_2px_4px_#0000001a,inset_-2px_-2px_4px_#ffffff80] 
                       dark:shadow-[inset_2px_2px_6px_#0e1118,inset_-2px_-2px_6px_#3a435a] 
                       px-5 py-3">
            <Search className="text-gray-500 dark:text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Search Claims, Alerts, or Reports..."
              className="bg-transparent ml-3 w-full outline-none placeholder-gray-500 dark:placeholder-slate-500 text-gray-700 dark:text-slate-300"
            />
          </div>
        </div>
        
        {/* Ikon User, Notifikasi & Tombol Tema - Gaya baru untuk Glass */}
        <div className="flex items-center space-x-2">
          <GlassButton onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </GlassButton>
          <GlassButton>
            <Bell size={20} />
          </GlassButton>
          <GlassButton>
            <UserCircle size={20} />
          </GlassButton>
        </div>
      </div>
    </header>
  );
};

// -- Halaman-Halaman --

// Varian animasi untuk transisi halaman
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

// Halaman Dashboard
const DashboardPage = () => {
  const recentAlerts = [
    { id: '001', type: 'Upcoding', date: '2025-11-10', status: 'High Risk' },
    { id: '002', type: 'Fiktif', date: '2025-11-09', status: 'Resolved' },
    { id: '003', type: 'Duplikat', date: '2025-11-08', status: 'Medium Risk' },
    { id: '004', type: 'Unbundling', date: '2025-11-07', status: 'Investigating' },
  ];

  return (
    <motion.div 
      className="space-y-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageVariants.transition}
    >
      <h4 className="text-2xl font-semibold text-gray-700 dark:text-slate-200">Overview</h4>
      
      {/* Grid untuk Kartu Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Claims" value={300} unit="M" Icon={TrendingUp} />
        <StatCard title="Detected Anomalies" value="5-10%" Icon={AlertOctagon} />
        <StatCard title="Fraud Alerts" value={120} prefix="Active: " Icon={AlertTriangle} />
        <StatCard title="Potential Savings" value="Rp5-10T" Icon={DollarSign} />
      </div>

      {/* Grafik Claim Trends */}
      <SoftCard className="h-80">
        <h5 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-4">Claim Trends</h5>
        <ClaimTrendsChart />
      </SoftCard>

      {/* Tabel Peringatan Terbaru */}
      <h4 className="text-xl font-semibold text-gray-700 dark:text-slate-200 pt-4">Recent Alerts</h4>
      <TableCard
        headers={['ID', 'Type', 'Date', 'Status']}
        data={recentAlerts.map(alert => [
          alert.id, 
          alert.type, 
          alert.date, 
          <StatusBadge status={alert.status} />
        ])}
      />
    </motion.div>
  );
};

// Halaman Claim Analysis
const ClaimAnalysisPage = () => {
  const claims = [
    { id: 'CL001', provider: 'Hospital A', date: '2025-11-10', amount: 'Rp1M', status: 'Anomalous' },
    { id: 'CL002', provider: 'Clinic B', date: '2025-11-09', amount: 'Rp500K', status: 'Normal' },
    { id: 'CL003', provider: 'Hospital A', date: '2025-11-08', amount: 'Rp2.5M', status: 'Anomalous' },
    { id: 'CL004', provider: 'Lab C', date: '2025-11-07', amount: 'Rp150K', status: 'Normal' },
  ];
  return (
    <motion.div 
      className="space-y-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageVariants.transition}
    >
      <h4 className="text-2xl font-semibold text-gray-700 dark:text-slate-200">Claim Analysis</h4>
      
      {/* Filter Bar */}
      <SoftCard className="p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="font-semibold dark:text-slate-300">Filters:</span>
          <FilterButton label="Date Range" />
          <FilterButton label="Claim Type" />
          <FilterButton label="Provider" />
          <FilterButton label="Status" />
        </div>
      </SoftCard>

      {/* Grafik Anomaly Detection */}
      <SoftCard className="h-80">
        <h5 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-4">Anomaly Detection Chart</h5>
        <AnomalyDetectionChart />
      </SoftCard>

      {/* Tabel Daftar Klaim */}
      <h4 className="text-xl font-semibold text-gray-700 dark:text-slate-200 pt-4">Claim List</h4>
      <TableCard
        headers={['Claim ID', 'Provider', 'Date', 'Amount', 'Status']}
        data={claims.map(claim => [
          claim.id, 
          claim.provider, 
          claim.date, 
          claim.amount, 
          <StatusBadge status={claim.status} />
        ])}
      />
    </motion.div>
  );
};

// Halaman Alerts
const AlertsPage = () => {
  const alerts = [
    { id: 'AL001', type: 'Upcoding', date: '2025-11-10', risk: 'High', action: 'Investigate' },
    { id: 'AL002', type: 'Fiktif', date: '2025-11-09', risk: 'Medium', action: 'Review' },
    { id: 'AL003', type: 'Duplikat', date: '2025-11-08', risk: 'Medium', action: 'Review' },
    { id: 'AL004', type: 'Unbundling', date: '2025-11-07', risk: 'Low', action: 'Monitor' },
  ];
  return (
    <motion.div 
      className="space-y-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageVariants.transition}
    >
      <h4 className="text-2xl font-semibold text-gray-700 dark:text-slate-200">Alerts</h4>

      {/* Kartu Ringkasan Peringatan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="High Risk" value={50} Icon={AlertTriangle} color="text-red-500 dark:text-red-400" />
        <StatCard title="Medium Risk" value={40} Icon={AlertTriangle} color="text-yellow-600 dark:text-yellow-400" />
        <StatCard title="Low Risk" value={30} Icon={AlertTriangle} color="text-green-500 dark:text-green-400" />
      </div>

      {/* Tabel Daftar Peringatan */}
      <h4 className="text-xl font-semibold text-gray-700 dark:text-slate-200 pt-4">Alert List</h4>
      <TableCard
        headers={['Alert ID', 'Type', 'Date', 'Risk Level', 'Action']}
        data={alerts.map(alert => [
          alert.id, 
          alert.type, 
          alert.date, 
          <StatusBadge status={alert.risk} />, 
          <AppButton flat size="sm">{alert.action}</AppButton>
        ])}
      />
    </motion.div>
  );
};

// Halaman Audit Trail
const AuditTrailPage = () => {
  const logs = [
    { id: 'LOG001', user: 'Admin', action: 'Verified Claim', date: '2025-11-10', details: 'Claim ID: CL001' },
    { id: 'LOG002', user: 'Auditor', action: 'Flagged Alert', date: '2025-11-09', details: 'Alert ID: AL001' },
    { id: 'LOG003', user: 'System', action: 'Generated Report', date: '2025-11-09', details: 'Report ID: RP002' },
    { id: 'LOG004', user: 'Admin', action: 'Updated Settings', date: '2025-11-08', details: 'Thresholds updated' },
  ];
  return (
    <motion.div 
      className="space-y-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageVariants.transition}
    >
      <h4 className="text-2xl font-semibold text-gray-700 dark:text-slate-200">Audit Trail</h4>
      
      {/* Filter Bar */}
      <SoftCard className="p-6">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="font-semibold dark:text-slate-300">Filters:</span>
          <FilterButton label="Date Range" />
          <FilterButton label="User" />
          <FilterButton label="Action Type" />
        </div>
      </SoftCard>

      {/* Tabel Log Audit */}
      <h4 className="text-xl font-semibold text-gray-700 dark:text-slate-200 pt-4">Audit Logs</h4>
      <TableCard
        headers={['Log ID', 'User', 'Action', 'Date', 'Details']}
        data={logs.map(log => [
          log.id, 
          log.user, 
          log.action, 
          log.date, 
          log.details
        ])}
      />
    </motion.div>
  );
};

// Halaman Reports
const ReportsPage = () => {
  const reports = [
    { id: 'RP001', type: 'Fraud Summary', date: '2025-11-10' },
    { id: 'RP002', type: 'Claim Trends', date: '2025-11-09' },
    { id: 'RP003', type: 'Provider Anomaly', date: '2025-11-08' },
  ];
  return (
    <motion.div 
      className="space-y-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageVariants.transition}
    >
      <h4 className="text-2xl font-semibold text-gray-700 dark:text-slate-200">Reports</h4>
      
      {/* Form Generate Report */}
      <SoftCard className="p-6 space-y-4">
        <h5 className="text-lg font-semibold dark:text-slate-200">Generate Report</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SoftInput label="Report Type" />
          <SoftInput label="Start Date" type="date" />
          <SoftInput label="End Date" type="date" />
        </div>
        <AppButton>Generate</AppButton>
      </SoftCard>

      {/* Grafik Report Preview */}
      <SoftCard className="h-80">
        <h5 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-4">Report Preview Chart</h5>
        <ReportPreviewChart />
      </SoftCard>

      {/* Tabel Laporan */}
      <h4 className="text-xl font-semibold text-gray-700 dark:text-slate-200 pt-4">Generated Reports</h4>
      <TableCard
        headers={['Report ID', 'Type', 'Date', 'Download']}
        data={reports.map(report => [
          report.id, 
          report.type, 
          report.date, 
          <AppButton flat size="sm">
            <Download size={16} className="mr-2" />
            Download
          </AppButton>
        ])}
      />
    </motion.div>
  );
};

// Halaman Settings
const SettingsPage = ({ theme, toggleTheme }) => {
  return (
    <motion.div 
      className="space-y-8 max-w-4xl"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageVariants.transition}
    >
      <h4 className="text-2xl font-semibold text-gray-700 dark:text-slate-200">Settings</h4>
      
      {/* User Preferences */}
      <SoftCard className="p-6 space-y-6">
        <h5 className="text-lg font-semibold dark:text-slate-200">User Preferences</h5>
        <SoftInput label="Email Notifications" />
        <SoftInput label="In-App Notifications" />
        {/* Toggle Tema di Halaman Settings */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-600 dark:text-slate-400">Theme (Light/Dark)</label>
          {/* Tombol di sini bisa tetap Neumorphic/AppButton atau GlassButton */}
          <AppButton onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </AppButton>
        </div>
      </SoftCard>

      {/* System Configuration */}
      <SoftCard className="p-6 space-y-6">
        <h5 className="text-lg font-semibold dark:text-slate-200">System Configuration</h5>
        <SoftInput label="API Integrations" />
        <SoftInput label="Alert Thresholds" />
        <SoftInput label="User Roles" />
      </SoftCard>

      <AppButton>Save Changes</AppButton>
    </motion.div>
  );
};


// -- Komponen-Komponen Grafik (BARU) --

const ChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      // Tooltip diubah ke Soft UI
      <div className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
        <p className="label text-sm font-semibold text-gray-700 dark:text-slate-200">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Grafik Garis untuk Dashboard
const ClaimTrendsChart = () => (
  <ResponsiveContainer width="100%" height="90%">
    <LineChart data={claimTrendsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
      <XAxis 
        dataKey="name" 
        tick={{ fill: 'currentColor' }} 
        className="text-xs text-gray-600 dark:text-slate-400" 
        stroke="currentColor"
        strokeOpacity={0.3}
      />
      <YAxis 
        tick={{ fill: 'currentColor' }} 
        className="text-xs text-gray-600 dark:text-slate-400" 
        stroke="currentColor"
        strokeOpacity={0.3}
      />
      <Tooltip content={<ChartTooltip />} />
      <Legend />
      <Line type="monotone" dataKey="claims" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
      {/* Aksen hijau/emerald */}
      <Line type="monotone" dataKey="anomalies" stroke="#10b981" strokeWidth={2} activeDot={{ r: 8 }} />
    </LineChart>
  </ResponsiveContainer>
);

// Grafik Batang untuk Claim Analysis
const AnomalyDetectionChart = () => (
  <ResponsiveContainer width="100%" height="90%">
    <BarChart data={anomalyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
      <XAxis 
        dataKey="name" 
        tick={{ fill: 'currentColor' }} 
        className="text-xs text-gray-600 dark:text-slate-400" 
        stroke="currentColor"
        strokeOpacity={0.3}
      />
      <YAxis 
        tick={{ fill: 'currentColor' }} 
        className="text-xs text-gray-600 dark:text-slate-400" 
        stroke="currentColor"
        strokeOpacity={0.3}
      />
      <Tooltip content={<ChartTooltip />} />
      {/* Aksen hijau/emerald */}
      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

// Grafik Garis untuk Laporan (Mirip ClaimTrends)
const ReportPreviewChart = () => (
  <ResponsiveContainer width="100%" height="90%">
    <LineChart data={claimTrendsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
      <XAxis 
        dataKey="name" 
        tick={{ fill: 'currentColor' }} 
        className="text-xs text-gray-600 dark:text-slate-400" 
        stroke="currentColor"
        strokeOpacity={0.3}
      />
      <YAxis 
        tick={{ fill: 'currentColor' }} 
        className="text-xs text-gray-600 dark:text-slate-400" 
        stroke="currentColor"
        strokeOpacity={0.3}
      />
      <Tooltip content={<ChartTooltip />} />
      <Legend />
      {/* Aksen hijau/emerald */}
      <Line type="monotone" dataKey="anomalies" stroke="#10b981" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

// -- Komponen Animasi (BARU) --

// Komponen untuk menganimasikan angka
function AnimatedNumber({ value }) {
  const nodeRef = useRef(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    // Animasikan dari 0 ke nilai target
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate(latest) {
        // Format dengan koma, tanpa desimal
        node.textContent = Math.round(latest).toLocaleString('en-US');
      }
    });

    return () => controls.stop();
  }, [value]); // Hanya bergantung pada 'value'

  return <span ref={nodeRef}>0</span>; // Mulai dari 0
}


// -- Komponen-Komponen Kecil (Reusable) dengan Update Dark Mode --

// Tombol Navigasi di Sidebar
// Gaya Neumorphic (inset) terlihat bagus di atas Glassmorphism, jadi kita biarkan
const NavItem = ({ Icon, label, isActive, onClick }) => {
  const baseStyle = "flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-green";
  // Gaya Cekung (Inset) untuk item aktif - Aksen Hijau/Emerald di dark mode
  const activeStyle = `
    text-blue-600 font-semibold 
    shadow-[inset_3px_3px_6px_#0000001a,inset_-3px_-3px_6px_#ffffff80]
    dark:text-emerald-400 
    dark:shadow-[inset_3px_3px_6px_#0e1118,inset_-3px_-3px_6px_#3a435a]
  `;
  // Gaya Cembung (Outset) untuk item non-aktif
  // Disederhanakan untuk Glassmorphism
  const inactiveStyle = `
    text-gray-600 font-medium 
    hover:text-blue-500 
    hover:bg-black/5 dark:hover:bg-white/5
    dark:text-slate-400 
    dark:hover:text-emerald-400 
    transition-colors duration-200
  `;

  return (
    <div
      className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
      onClick={onClick}
    >
      <Icon size={20} />
      <span>{label}</span>
    </div>
  );
};

// Tombol Neumorphic diubah namanya menjadi AppButton
// Gayanya diubah ke "Soft UI" (bayangan simpel)
const AppButton = ({ children, onClick, flat = false, size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
  };
  // Gaya Cembung (Outset) -> Diubah ke Primary Button
  const primaryStyle = `
    bg-emerald-500 text-white
    shadow-md hover:shadow-lg hover:bg-emerald-600
    active:shadow-inner active:scale-95
    dark:shadow-emerald-700/50
  `;
  // Gaya Datar -> Diubah ke Secondary Button
  const secondaryStyle = `
    bg-white dark:bg-slate-700
    shadow-sm hover:shadow-md
    active:shadow-inner active:scale-95
    border border-slate-200 dark:border-slate-600
  `;
  
  return (
    <button
      onClick={onClick}
      className={`
        rounded-lg
        font-semibold text-gray-700 dark:text-slate-300
        transition-all duration-200 flex items-center justify-center
        ${flat ? secondaryStyle : primaryStyle}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// Tombol Kaca (BARU) - Untuk di Header
const GlassButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`
      p-2.5 rounded-lg text-gray-700 dark:text-slate-300
      hover:bg-black/10 dark:hover:bg-white/10
      active:bg-black/20 dark:active:bg-white/20
      transition-colors duration-200
      ${className}
    `}
  >
    {children}
  </button>
);


// Kartu Neumorphic diubah menjadi SoftCard
// Gaya diubah ke "Soft UI" (bayangan simpel)
const SoftCard = ({ children, className = '' }) => {
  return (
    <div className={`
      bg-white dark:bg-slate-800 
      rounded-2xl 
      shadow-lg
      dark:shadow-black/20
      p-6 ${className}
    `}>
      {children}
    </div>
  );
};

// Kartu Statistik
// Menggunakan SoftCard (NeumorphicCard yang sudah diubah)
const StatCard = ({ title, value, unit, prefix, Icon, color = 'text-gray-700' }) => {
  const isNumeric = typeof value === 'number';

  return (
    <SoftCard className="p-5">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500 dark:text-slate-400">{title}</span>
          <span className={`text-2xl font-bold ${color} dark:text-slate-200`}>
            {prefix}
            {/* Gunakan AnimatedNumber jika 'value' adalah angka */}
            {isNumeric ? <AnimatedNumber value={value} /> : value}
            {unit}
          </span>
        </div>
        <div className={`
          rounded-full p-3 
          bg-slate-100 dark:bg-slate-700
          shadow-[inset_3px_3px_6px_#0000001a,inset_-3px_-3px_6px_#ffffff]
          dark:shadow-[inset_3px_3px_6px_#0e1118,inset_-3px_-3px_6px_#3a435a]
          ${color}
        `}>
          <Icon size={24} />
        </div>
      </div>
    </SoftCard>
  );
};

// Input Form Neumorphic diubah ke SoftInput
// Gaya diubah ke "Soft UI" (border simpel)
const SoftInput = ({ label, type = 'text' }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-600 dark:text-slate-400 mb-1">{label}</label>
      <input
        type={type}
        className={`
          w-full rounded-lg bg-slate-100 dark:bg-slate-700 
          text-gray-700 dark:text-slate-300
          border border-slate-300 dark:border-slate-600
          focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
          transition-colors
          p-3 outline-none
          ${type === 'date' ? 'cursor-text' : ''}
        `}
      />
    </div>
  );
};

// Tombol Filter
// Diubah ke "Soft UI" (border simpel)
const FilterButton = ({ label }) => {
  return (
    <button className={`
      text-sm font-medium text-gray-700 dark:text-slate-300
      bg-white dark:bg-slate-700 
      rounded-full px-4 py-2 
      shadow-sm
      border border-slate-200 dark:border-slate-600
      hover:shadow-md hover:border-emerald-400
      dark:hover:border-emerald-500
      transition-all
    `}>
      {label}
    </button>
  );
};

// Varian untuk animasi tabel (stagger)
const tableContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07, // Jeda antar baris
    }
  }
};

const tableRowVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.3 } }
};

// Kartu untuk membungkus Tabel
// Diubah ke "Soft UI"
const TableCard = ({ headers, data }) => {
  return (
    // Menggunakan gaya SoftCard
    <div className={`
      bg-white dark:bg-slate-800
      rounded-2xl 
      shadow-lg
      dark:shadow-black/20
      overflow-x-auto
    `}>
      <div className="w-full min-w-[700px] overflow-hidden">
        <table className="w-full">
          <thead className="border-b-2 border-slate-100 dark:border-slate-700">
            <tr>
              {headers.map((header) => (
                <th key={header} className="p-4 text-left text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <motion.tbody
            variants={tableContainerVariants}
            initial="hidden"
            animate="show"
          >
            {data.map((row, rowIndex) => (
              <motion.tr 
                key={rowIndex} 
                variants={tableRowVariants}
                className="border-b border-slate-100 dark:border-slate-700 last:border-none hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-4 text-sm text-gray-700 dark:text-slate-300">
                    {cell}
                  </td>
                ))}
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

// Badge Status
const StatusBadge = ({ status }) => {
  const statusColors = {
    'High Risk': 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Anomalous': 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Medium Risk': 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    'Review': 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    'Resolved': 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Normal': 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Low': 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Monitor': 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Investigating': 'bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'High': 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Medium': 'bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
      {status}
    </span>
  );
};