import { useState } from "react";
import { ArrowLeft, Building2, Mail, Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Button, Input, Label, ErrorBox, InfoBox, Badge } from "../components/UI";

export default function AuthPage({ onDone, onBack }) {
  const [step, setStep] = useState("school"); // school → email → password → loading
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const goBack = () => {
    setErr("");
    if (step === "password") setStep("email");
    else if (step === "email") setStep("school");
    else onBack();
  };

  const submitSchool = () => {
    if (!schoolName.trim()) return setErr("Please enter a school name.");
    setErr(""); setLoading(true);
    setTimeout(() => { setLoading(false); setStep("email"); }, 800);
  };

  const submitEmail = () => {
    if (!email.trim()) return setErr("Please enter your email.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr("Please enter a valid email.");
    setErr(""); setLoading(true);
    setTimeout(() => { setLoading(false); setStep("password"); }, 600);
  };

  const submitPassword = () => {
    if (!password.trim() || password.length < 4) return setErr("Password must be at least 4 characters.");
    setErr(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onDone(schoolName.trim(), email.trim());
    }, 1200);
  };

  const hint = step === "school" ? "Enter any school name" : step === "email" ? "Enter any email address" : "Enter any password (4+ chars)";

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "var(--s50)", display: "flex", flexDirection: "column", fontFamily: "var(--font)" }}>
      {/* Header */}
      <div style={{ padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--s100)", background: "#fff", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,var(--g600),var(--g700))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 15 }}>m</div>
          <span style={{ fontSize: 16, fontWeight: 800, color: "var(--s900)", letterSpacing: "-.2px" }}>myFeesTracker</span>
        </div>
        <Badge color="var(--a500)" bg="var(--a50)">MyFeesTracker</Badge>
      </div>

      {/* Content */}
      <div style={{ flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
        <div className="ai" style={{ background: "#fff", borderRadius: "var(--rxl)", padding: "38px 34px 32px", width: "100%", maxWidth: 430, boxShadow: "var(--sh-xl)", border: "1px solid rgba(22,163,74,.08)" }}>
          <Button variant="ghost" style={{ padding: "4px 0", marginBottom: 14, fontSize: 12.5 }} onClick={goBack}>
            <ArrowLeft size={14} /> Back
          </Button>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: 15, background: "linear-gradient(135deg,var(--g600),var(--g700))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "#fff", fontWeight: 900, fontSize: 24, boxShadow: "0 4px 14px rgba(22,163,74,.3)" }}>m</div>
            <p style={{ fontSize: 21, fontWeight: 800, color: "var(--s900)", letterSpacing: "-.3px" }}>Sign In</p>
            <p style={{ fontSize: 12, color: "var(--s400)", marginTop: 4 }}>{hint}</p>
          </div>

          <ErrorBox>{err}</ErrorBox>

          <div key={step} className="ai">
            {step === "school" && (
              <div>
                <InfoBox icon={Building2}>Enter any school name to continue.</InfoBox>
                <Label style={{ marginTop: 0 }}>School Name *</Label>
                <Input placeholder="e.g. Kampala Academy" value={schoolName} onChange={e => { setSchoolName(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && submitSchool()} />
                <Button variant="primary" style={{ width: "100%", justifyContent: "center", padding: "12px 0", fontSize: 14.5, marginTop: 20 }} onClick={submitSchool} disabled={loading}>
                  {loading ? <><Loader2 size={17} className="spin" /> Checking…</> : <>Continue</>}
                </Button>
              </div>
            )}

            {step === "email" && (
              <div>
                <InfoBox icon={Mail}>Enter any email — no real verification.</InfoBox>
                <Label style={{ marginTop: 0 }}>Email Address *</Label>
                <Input type="email" placeholder="admin@school.com" value={email} onChange={e => { setEmail(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && submitEmail()} />
                <Button variant="primary" style={{ width: "100%", justifyContent: "center", padding: "12px 0", fontSize: 14.5, marginTop: 20 }} onClick={submitEmail} disabled={loading}>
                  {loading ? <><Loader2 size={17} className="spin" /> Checking…</> : <>Continue</>}
                </Button>
              </div>
            )}

            {step === "password" && (
              <div>
                <div style={{ background: "var(--g50)", border: "1px solid var(--g200)", borderRadius: 10, padding: "10px 14px", marginBottom: 16 }}>
                  <p style={{ fontSize: 12.5, color: "var(--g700)", lineHeight: 1.5 }}>Signing in as <strong>{email.trim()}</strong> at <strong>{schoolName.trim()}</strong></p>
                </div>
                <Label style={{ marginTop: 0 }}>Password *</Label>
                <div style={{ position: "relative" }}>
                  <Input type={showPassword ? "text" : "password"} placeholder="Enter any password" value={password} onChange={e => { setPassword(e.target.value); setErr(""); }} onKeyDown={e => e.key === "Enter" && submitPassword()} style={{ paddingRight: 40 }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--s400)" }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <Button variant="primary" style={{ width: "100%", justifyContent: "center", padding: "12px 0", fontSize: 14.5, marginTop: 20 }} onClick={submitPassword} disabled={loading}>
                  {loading ? <><Loader2 size={17} className="spin" /> Signing in…</> : <>Sign In <CheckCircle size={16} /></>}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "20px 24px", textAlign: "center", flexShrink: 0, borderTop: "1px solid var(--s100)" }}>
        <p style={{ color: "var(--s400)", fontSize: 12.5, fontWeight: 500 }}>© 2026 myFeesTracker by Geowise Media. All rights reserved.</p>
      </div>
    </div>
  );
}
