import { useState, useCallback, useMemo } from "react";
import { LayoutDashboard, Users, CreditCard, BarChart3, Settings, Receipt, LogOut, Menu, X } from "lucide-react";
import { Avatar, Badge, Toast, Button } from "./components/UI";
import { uid, generateReceipt, generateOPReceipt } from "./utils/helpers";
import { SEED_STUDENTS, SEED_PAYMENTS, SEED_OTHER_PAYMENTS, SEED_SETTINGS } from "./utils/seedData";

import WelcomePage from "./pages/WelcomePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/StudentsPage";
import PaymentsPage from "./pages/PaymentsPage";
import ReportsPage from "./pages/ReportsPage";
import OtherPaymentsPage from "./pages/OtherPaymentsPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toast, setToast] = useState(null);

  const [schoolName, setSchoolName] = useState("Demo School");
  const [email, setEmail] = useState("demo@school.com");
  const [schoolType] = useState("Primary School");
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [otherPayments, setOtherPayments] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [settings, setSettings] = useState({ name: "", email: "", phone: "", currency: "UGX", address: "", district: "", country: "" });

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const school = useMemo(() => ({
    displayName: schoolName, schoolType, students, payments, otherPayments,
    paymentCategories: customCategories, admins: [email],
    settings: { ...settings, name: settings.name || schoolName, currency: settings.currency || "UGX" },
  }), [schoolName, schoolType, students, payments, otherPayments, customCategories, email, settings]);

  const addStudent = useCallback(data => {
    setStudents(prev => [...prev, { id: uid(), ...data, feesPaid: 0, status: "active", createdAt: new Date().toISOString() }]);
    showToast("Student added successfully!");
  }, []);
  const updateStudent = useCallback((id, data) => { setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s)); showToast("Student updated!"); }, []);
  const deleteStudent = useCallback(id => { setStudents(prev => prev.filter(s => s.id !== id)); setPayments(prev => prev.filter(p => p.studentId !== id)); showToast("Student deleted."); }, []);
  const promoteStudent = useCallback((id, data) => { setStudents(prev => prev.map(s => s.id === id ? { ...s, classId: data.newClass, academicYear: data.newAcademicYear, feesRequired: data.newFeesRequired, feesPaid: 0 } : s)); showToast("Student promoted!"); }, []);

  const addPayment = useCallback(data => {
    const p = { id: uid(), ...data, receiptNumber: generateReceipt(), createdAt: new Date().toISOString() };
    setPayments(prev => [...prev, p]);
    setStudents(prev => prev.map(s => s.id === data.studentId ? { ...s, feesPaid: (s.feesPaid || 0) + data.amount } : s));
    showToast(`Payment of ${Number(data.amount).toLocaleString()} recorded!`);
  }, []);

  const addOtherPayment = useCallback(data => { setOtherPayments(prev => [...prev, { id: uid(), ...data, receiptNumber: generateOPReceipt(), createdAt: new Date().toISOString() }]); showToast("Other payment recorded!"); }, []);
  const deleteOtherPayment = useCallback(id => { setOtherPayments(prev => prev.filter(p => p.id !== id)); showToast("Payment deleted."); }, []);
  const addCategory = useCallback(data => { setCustomCategories(prev => [...prev, { id: uid(), ...data }]); showToast(`Category "${data.name}" added!`); }, []);
  const deleteCategory = useCallback(id => { setCustomCategories(prev => prev.filter(c => c.id !== id)); showToast("Category deleted."); }, []);

  const updateSettings = useCallback(data => { setSettings(data); if (data.name) setSchoolName(data.name); showToast("Settings saved!"); }, []);

  if (screen === "welcome") return <WelcomePage onGetStarted={() => setScreen("auth")} />;
  if (screen === "auth") return <AuthPage onDone={(name, em) => {
    setSchoolName(name);
    setEmail(em);
    setStudents(SEED_STUDENTS);
    setPayments(SEED_PAYMENTS);
    setOtherPayments(SEED_OTHER_PAYMENTS);
    setSettings({ ...SEED_SETTINGS, name, email: em });
    setScreen("app");
    setPage("dashboard");
  }} onBack={() => setScreen("welcome")} />;

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: Users },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "other-payments", label: "Other Payments", icon: Receipt },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];
  const titles = {
    dashboard: { title: "Dashboard", sub: "Overview of your school's fees" },
    students: { title: "Students", sub: "Manage student records" },
    payments: { title: "Payments", sub: "Record and track fee payments" },
    "other-payments": { title: "Other Payments", sub: "Construction, trips, uniforms & more" },
    reports: { title: "Reports", sub: "View financial reports" },
    settings: { title: "Settings", sub: "School and account settings" },
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage school={school} />;
      case "students": return <StudentsPage school={school} onAdd={addStudent} onUpdate={updateStudent} onDelete={deleteStudent} onPromote={promoteStudent} />;
      case "payments": return <PaymentsPage school={school} onAdd={addPayment} />;
      case "other-payments": return <OtherPaymentsPage school={school} onAddPayment={addOtherPayment} onDeletePayment={deleteOtherPayment} onAddCategory={addCategory} onDeleteCategory={deleteCategory} />;
      case "reports": return <ReportsPage school={school} />;
      case "settings": return <SettingsPage school={school} onSave={updateSettings} onDelete={() => { setStudents([]); setPayments([]); setOtherPayments([]); setCustomCategories([]); setSettings({ name: "", email: "", phone: "", currency: "UGX", address: "", district: "", country: "" }); setScreen("welcome"); }} />;
      default: return null;
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <div style={{ fontFamily: "var(--font)", background: "var(--s50)", minHeight: "100vh", display: "flex", fontSize: 14, color: "var(--s800)", overflow: "hidden", height: "100vh", position: "relative" }}>
      <Toast msg={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 998 }} />}

      {/* SIDEBAR */}
      <div style={{ width: 234, background: "#fff", borderRight: "1px solid var(--s200)", display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh", overflowX: "hidden", overflowY: "auto", transition: "left .3s ease", ...(isMobile ? { position: "fixed", left: sidebarOpen ? 0 : -234, top: 0, zIndex: 999 } : { position: "relative" }) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "22px 18px 18px", borderBottom: "1px solid var(--s100)" }}>
          <div style={{ width: 40, height: 40, background: "linear-gradient(135deg,var(--g600),var(--g700))", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 18, boxShadow: "0 3px 10px rgba(22,163,74,.25)" }}>m</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14.5, fontWeight: 700, color: "var(--s900)", lineHeight: 1.2, letterSpacing: "-.2px" }}>myFeesTracker</p>
            <p style={{ fontSize: 10.5, color: "var(--s400)", marginTop: 1 }}>{schoolName}</p>
          </div>
          {isMobile && <button onClick={() => setSidebarOpen(false)} style={{ background: "transparent", border: "none", color: "var(--s500)", cursor: "pointer", padding: 4, display: "flex" }}><X size={20} /></button>}
        </div>

        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {nav.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} className="nb" onClick={() => { setPage(item.id); setSidebarOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 14px", borderRadius: 9, background: active ? "var(--g50)" : "transparent", color: active ? "var(--g700)" : "var(--s600)", fontWeight: active ? 600 : 500, cursor: "pointer", border: "none", width: "100%", textAlign: "left", position: "relative", transition: "all .2s", marginBottom: 2, fontFamily: "var(--font)", fontSize: 13.5 }}>
                {active && <div style={{ position: "absolute", left: 0, top: 7, bottom: 7, width: 3, background: "var(--g600)", borderRadius: "0 3px 3px 0" }} />}
                <item.icon size={17} style={{ flexShrink: 0 }} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "14px 10px 10px", borderTop: "1px solid var(--s100)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, background: "var(--s50)", border: "1px solid var(--s100)" }}>
            <Avatar size={32} letter={email?.[0]?.toUpperCase() || "U"} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11.5, fontWeight: 600, color: "var(--s900)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</p>
              <p style={{ fontSize: 10, color: "var(--s400)", marginTop: 1 }}>{schoolName}</p>
            </div>
          </div>
          <button className="bg" onClick={() => setShowLogoutModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", justifyContent: "flex-start", marginTop: 8, color: "var(--s500)", padding: "8px 12px", borderRadius: 9, background: "transparent", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "var(--font)" }}>
            <LogOut size={15} /> Sign Out
          </button>
          <div style={{ marginTop: 10, background: "linear-gradient(135deg,#0a3d21,#0d4f2b,var(--g900))", borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
            <p style={{ color: "#fff", fontSize: 10, fontWeight: 600, letterSpacing: .3 }}>© Geowise Media 2026</p>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <div style={{ height: 60, background: "#fff", borderBottom: "1px solid var(--s200)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {isMobile && <button onClick={() => setSidebarOpen(true)} style={{ background: "transparent", border: "none", color: "var(--s700)", cursor: "pointer", padding: 8, borderRadius: 8, display: "flex", alignItems: "center" }}><Menu size={24} /></button>}
            <div>
              <p style={{ fontSize: isMobile ? 16 : 19, fontWeight: 800, color: "var(--s900)", letterSpacing: "-.3px" }}>{titles[page]?.title}</p>
              {!isMobile && <p style={{ fontSize: 11.5, color: "var(--s400)", marginTop: 2 }}>{titles[page]?.sub}</p>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Badge color="var(--a500)" bg="var(--a50)">myFeesTracker</Badge>
            <Avatar size={36} letter={email?.[0]?.toUpperCase() || "U"} />
          </div>
        </div>
        <div style={{ flex: 1, padding: isMobile ? 16 : 24, overflowY: "auto" }}>
          {renderPage()}
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={() => setShowLogoutModal(false)}>
          <div className="ai" onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "var(--rxl)", padding: 28, maxWidth: 380, width: "100%", boxShadow: "var(--sh-xl)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ width: 48, height: 48, background: "var(--a50)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><LogOut size={22} color="var(--a500)" /></div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--s900)", marginBottom: 4 }}>Sign Out?</h3>
                <p style={{ fontSize: 13, color: "var(--s500)", lineHeight: 1.4 }}>Are you sure you want to sign out?</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowLogoutModal(false)}>Cancel</Button>
              <button onClick={() => { setShowLogoutModal(false); setStudents([]); setPayments([]); setOtherPayments([]); setCustomCategories([]); setPage("dashboard"); setScreen("welcome"); }} style={{ flex: 1, padding: "12px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,var(--a500),#d97706)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)", boxShadow: "0 4px 14px rgba(245,158,11,.3)" }}>Yes, Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
