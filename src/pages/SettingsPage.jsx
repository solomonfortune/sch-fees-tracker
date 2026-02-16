import { useState } from "react";
import { Building2, Users, Trash2, AlertTriangle, Shield, Save, X } from "lucide-react";
import { Button, Input, Select, Label, Badge, ErrorBox, Modal, Avatar } from "../components/UI";
import { CURRENCIES } from "../utils/constants";

export default function SettingsPage({ school, onSave, onDelete }) {
  const [tab, setTab] = useState("school");
  const [saved, setSaved] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [delConfirm, setDelConfirm] = useState("");
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    name: school.settings?.name || school.displayName || "",
    schoolType: school.schoolType || "Primary School",
    email: school.settings?.email || "",
    phone: school.settings?.phone || "",
    currency: school.settings?.currency || "UGX",
    address: school.settings?.address || "",
    district: school.settings?.district || "",
    country: school.settings?.country || "",
  });

  const handleChange = (field, value) => { setForm(f => ({ ...f, [field]: value })); setErr(""); setSaved(false); };

  const save = () => {
    if (!form.name.trim()) return setErr("School name is required.");
    if (!form.email.trim()) return setErr("Email is required.");
    if (!form.phone.trim()) return setErr("Phone is required.");
    onSave({ ...form, name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    if (delConfirm.trim().toLowerCase() !== school.displayName.trim().toLowerCase()) return setErr("School name doesn't match.");
    onDelete();
  };

  const admins = school.admins || [];

  const tabs = [
    { id: "school", label: "School", icon: Building2 },
    { id: "admins", label: "Admins", icon: Users },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Tabs */}
      <div className="ai ai-0" style={{ display: "flex", gap: 8, background: "#fff", padding: "12px 16px", borderRadius: "var(--rl)", boxShadow: "var(--sh-sm)", borderBottom: "1px solid var(--s100)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setErr(""); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", borderRadius: 9, fontSize: 13, fontWeight: 600, border: "none", background: tab === t.id ? "var(--s100)" : "transparent", color: tab === t.id ? "var(--s800)" : "var(--s600)", cursor: "pointer", transition: "all var(--tr)", fontFamily: "var(--font)" }}>
            <t.icon size={16} />{t.label}
          </button>
        ))}
      </div>

      {/* School Tab */}
      {tab === "school" && (
        <div className="ai ai-1" style={{ background: "#fff", padding: 22, borderRadius: "var(--rl)", boxShadow: "var(--sh-sm)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: "var(--s800)" }}>School Information</h3>
          <ErrorBox>{err}</ErrorBox>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
            <div><Label>School Name *</Label><Input value={form.name} onChange={e => handleChange("name", e.target.value)} /></div>
            <div><Label>School Type</Label><Input value={form.schoolType} disabled style={{ background: "var(--s50)", color: "var(--s500)" }} /><p style={{ fontSize: 10, color: "var(--s400)", marginTop: 4 }}>Cannot be changed after creation.</p></div>
            <div><Label>Email *</Label><Input type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} /></div>
            <div><Label>Phone *</Label><Input type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)} /></div>
            <div><Label>Currency</Label><Select value={form.currency} onChange={e => handleChange("currency", e.target.value)}>{CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}</Select></div>
            <div><Label>Address</Label><Input value={form.address} onChange={e => handleChange("address", e.target.value)} placeholder="Street address" /></div>
            <div><Label>District</Label><Input value={form.district} onChange={e => handleChange("district", e.target.value)} /></div>
            <div><Label>Country</Label><Input value={form.country} onChange={e => handleChange("country", e.target.value)} /></div>
          </div>
          <Button variant="primary" onClick={save} style={{ marginTop: 24 }}>
            {saved ? <>✓ Saved!</> : <><Save size={15} /> Save Settings</>}
          </Button>
        </div>
      )}

      {/* Admins Tab */}
      {tab === "admins" && (
        <div className="ai ai-1" style={{ background: "#fff", padding: 22, borderRadius: "var(--rl)", boxShadow: "var(--sh-sm)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Shield size={20} color="var(--g600)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--s800)" }}>Administrators</h3>
          </div>
          <p style={{ fontSize: 13, color: "var(--s500)", lineHeight: 1.6, marginBottom: 20 }}>These accounts have full access to manage this school's data. In the real app, two admin emails are registered during school creation.</p>
          {admins.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "var(--s50)", borderRadius: 12, border: "1px solid var(--s100)", marginBottom: 10 }}>
              <Avatar size={38} letter={a?.[0]?.toUpperCase() || "A"} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--s900)" }}>{a}</p>
                <p style={{ fontSize: 11, color: "var(--s400)", marginTop: 2 }}>Administrator</p>
              </div>
              <Badge>Active</Badge>
            </div>
          ))}
        </div>
      )}

      {/* Danger Zone */}
      {tab === "danger" && (
        <div className="ai ai-1" style={{ background: "#fff", padding: 22, borderRadius: "var(--rl)", border: "2px solid var(--r200)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <AlertTriangle size={20} color="var(--r500)" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--r500)" }}>Danger Zone</h3>
          </div>
          <p style={{ fontSize: 13, color: "var(--s600)", lineHeight: 1.6, marginBottom: 20 }}>
            Deleting your school will permanently erase all data including students, payments, and reports. This action cannot be undone.
          </p>
          <Button variant="red" onClick={() => { setDelModal(true); setDelConfirm(""); setErr(""); }}>
            <Trash2 size={15} /> Delete School
          </Button>
        </div>
      )}

      {/* Delete Confirmation */}
      {delModal && (
        <Modal onClose={() => setDelModal(false)}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 56, height: 56, background: "var(--r50)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Trash2 size={24} color="var(--r500)" /></div>
            <p style={{ fontSize: 18, fontWeight: 800, color: "var(--s900)", marginBottom: 8 }}>Delete School</p>
            <p style={{ fontSize: 13, color: "var(--s500)", lineHeight: 1.6, marginBottom: 20 }}>
              This will permanently delete all data. Type <strong>"{school.displayName}"</strong> to confirm.
            </p>
            <ErrorBox>{err}</ErrorBox>
            <Input value={delConfirm} onChange={e => { setDelConfirm(e.target.value); setErr(""); }} placeholder="Type school name to confirm..." />
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <Button variant="secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setDelModal(false)}>Cancel</Button>
              <Button variant="red" style={{ flex: 1, justifyContent: "center" }} onClick={handleDelete}>Yes, Delete Everything</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
