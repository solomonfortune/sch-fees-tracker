import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, X, Users } from "lucide-react";
import { Button, Input, Select, Label, Badge, ErrorBox, Modal } from "../components/UI";
import { TERMS, getClassesBySchoolType } from "../utils/constants";
import { formatNumber } from "../utils/helpers";

export default function StudentsPage({ school, onAdd, onUpdate, onDelete, onPromote }) {
  const [search, setSearch] = useState("");
  const [classF, setClassF] = useState("All");
  const [statusF, setStatusF] = useState("All");
  const [modal, setModal] = useState(null);
  const [delId, setDelId] = useState(null);
  const [form, setForm] = useState({ name: "", registrationNumber: "", classId: "", academicYear: new Date().getFullYear().toString(), term: "Term 1", feesRequired: "" });
  const [err, setErr] = useState("");

  const students = (school.students || []).filter(s => s.status !== "completed");
  const CLASSES = getClassesBySchoolType(school.schoolType);

  const filtered = useMemo(() => {
    let list = [...students];
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(s => s.name.toLowerCase().includes(q) || (s.registrationNumber || "").toLowerCase().includes(q)); }
    if (classF !== "All") list = list.filter(s => s.classId === classF);
    if (statusF === "Paid") list = list.filter(s => (s.feesPaid || 0) >= (s.feesRequired || 0));
    if (statusF === "Unpaid") list = list.filter(s => (s.feesPaid || 0) < (s.feesRequired || 0));
    return list;
  }, [students, search, classF, statusF]);

  const openAdd = () => { setForm({ name: "", registrationNumber: "", classId: "", academicYear: new Date().getFullYear().toString(), term: "Term 1", feesRequired: "" }); setErr(""); setModal("add"); };
  const openEdit = s => { setForm({ name: s.name, registrationNumber: s.registrationNumber || "", classId: s.classId, academicYear: s.academicYear, term: s.term, feesRequired: String(s.feesRequired) }); setErr(""); setModal(s.id); };

  const save = () => {
    if (!form.name.trim()) return setErr("Student name is required.");
    if (!form.classId) return setErr("Please select a class.");
    if (!form.feesRequired || isNaN(form.feesRequired) || Number(form.feesRequired) <= 0) return setErr("Enter a valid fees amount.");
    const data = { name: form.name.trim(), registrationNumber: form.registrationNumber.trim(), classId: form.classId, academicYear: form.academicYear, term: form.term, feesRequired: Number(form.feesRequired) };
    if (modal === "add") onAdd(data); else onUpdate(modal, data);
    setModal(null);
  };

  const fmt = formatNumber;

  return (
    <div>
      {/* Toolbar */}
      <div className="ai ai-0" style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--s400)" }} />
          <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <Select value={classF} onChange={e => setClassF(e.target.value)} style={{ width: "auto", minWidth: 140 }}>
          <option value="All">All Classes</option>
          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select value={statusF} onChange={e => setStatusF(e.target.value)} style={{ width: "auto", minWidth: 120 }}>
          <option value="All">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </Select>
        <Button variant="primary" onClick={openAdd}><Plus size={16} /> Add Student</Button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="ai ai-1" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", padding: 52, textAlign: "center" }}>
          <div style={{ width: 68, height: 68, background: "var(--g50)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", border: "2px solid var(--g100)" }}><Users size={30} color="var(--g600)" /></div>
          <p style={{ fontSize: 17, fontWeight: 700, color: "var(--s900)" }}>{students.length === 0 ? "No students yet" : "No matching students"}</p>
          <p style={{ fontSize: 13, color: "var(--s400)", marginTop: 5 }}>{students.length === 0 ? "Click 'Add Student' to get started." : "Try adjusting your filters."}</p>
        </div>
      ) : (
        <div className="ai ai-1" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--s50)", borderBottom: "1px solid var(--s200)" }}>
                  {["Name", "Reg No", "Class", "Year", "Term", "Required", "Paid", "Balance", "Status", ""].map((h, i) =>
                    <th key={i} style={{ padding: "12px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 600, color: "var(--s400)", textTransform: "uppercase", letterSpacing: .5, whiteSpace: "nowrap" }}>{h}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const bal = (s.feesRequired || 0) - (s.feesPaid || 0);
                  const paid = bal <= 0;
                  return (
                    <tr key={s.id} style={{ borderBottom: "1px solid var(--s100)", transition: "background .15s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--s50)"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                      <td style={{ padding: "13px 14px", fontWeight: 600, color: "var(--s900)" }}>{s.name}</td>
                      <td style={{ padding: "13px 14px", color: "var(--s500)", fontFamily: "var(--mono)", fontSize: 12 }}>{s.registrationNumber || "—"}</td>
                      <td style={{ padding: "13px 14px" }}><Badge>{s.classId}</Badge></td>
                      <td style={{ padding: "13px 14px", color: "var(--s500)" }}>{s.academicYear}</td>
                      <td style={{ padding: "13px 14px", color: "var(--s500)" }}>{s.term}</td>
                      <td style={{ padding: "13px 14px", fontWeight: 600 }}>{fmt(s.feesRequired)}</td>
                      <td style={{ padding: "13px 14px", fontWeight: 600, color: "var(--g700)" }}>{fmt(s.feesPaid || 0)}</td>
                      <td style={{ padding: "13px 14px", fontWeight: 700, color: paid ? "var(--g700)" : "var(--r500)" }}>{fmt(Math.abs(bal))}</td>
                      <td style={{ padding: "13px 14px" }}>{paid ? <Badge>Paid</Badge> : <Badge color="var(--r500)" bg="var(--r50)">Unpaid</Badge>}</td>
                      <td style={{ padding: "13px 14px", whiteSpace: "nowrap" }}>
                        <button onClick={() => openEdit(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--b500)", padding: 4 }}><Pencil size={15} /></button>
                        <button onClick={() => setDelId(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--r500)", padding: 4, marginLeft: 4 }}><Trash2 size={15} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--s100)", fontSize: 12, color: "var(--s400)", display: "flex", justifyContent: "space-between" }}>
            <span>{filtered.length} student{filtered.length !== 1 ? "s" : ""}</span>
            <span>Total fees: {fmt(filtered.reduce((s, st) => s + (st.feesRequired || 0), 0))}</span>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <Modal onClose={() => setModal(null)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: "var(--s900)" }}>{modal === "add" ? "Add Student" : "Edit Student"}</p>
            <button onClick={() => setModal(null)} style={{ background: "var(--s50)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} /></button>
          </div>
          <ErrorBox>{err}</ErrorBox>
          <Label style={{ marginTop: 0 }}>Full Name *</Label>
          <Input value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErr(""); }} placeholder="e.g. Nakato Sarah" />
          <Label>Registration Number</Label>
          <Input value={form.registrationNumber} onChange={e => setForm(f => ({ ...f, registrationNumber: e.target.value }))} placeholder="e.g. KA-2026-001" />
          <Label>Class *</Label>
          <Select value={form.classId} onChange={e => { setForm(f => ({ ...f, classId: e.target.value })); setErr(""); }}>
            <option value="">Select class...</option>
            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><Label>Academic Year</Label><Input value={form.academicYear} onChange={e => setForm(f => ({ ...f, academicYear: e.target.value }))} /></div>
            <div><Label>Term</Label><Select value={form.term} onChange={e => setForm(f => ({ ...f, term: e.target.value }))}>{TERMS.map(t => <option key={t} value={t}>{t}</option>)}</Select></div>
          </div>
          <Label>Fees Required *</Label>
          <Input type="number" value={form.feesRequired} onChange={e => { setForm(f => ({ ...f, feesRequired: e.target.value })); setErr(""); }} placeholder="e.g. 500000" />
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <Button variant="secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setModal(null)}>Cancel</Button>
            <Button variant="primary" style={{ flex: 1, justifyContent: "center" }} onClick={save}>{modal === "add" ? "Add Student" : "Save Changes"}</Button>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {delId && (
        <Modal onClose={() => setDelId(null)}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 56, height: 56, background: "var(--r50)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Trash2 size={24} color="var(--r500)" /></div>
            <p style={{ fontSize: 17, fontWeight: 700, color: "var(--s900)", marginBottom: 8 }}>Delete Student?</p>
            <p style={{ fontSize: 13, color: "var(--s500)", marginBottom: 24 }}>This will permanently remove this student and all their payment records.</p>
            <div style={{ display: "flex", gap: 12 }}>
              <Button variant="secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setDelId(null)}>Cancel</Button>
              <Button variant="red" style={{ flex: 1, justifyContent: "center" }} onClick={() => { onDelete(delId); setDelId(null); }}>Delete</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
