import { useState, useMemo } from "react";
import { Search, Plus, X, DollarSign, CreditCard } from "lucide-react";
import { Button, Input, Select, Label, Badge, ErrorBox, Modal, InfoBox } from "../components/UI";
import { METHODS, TERMS } from "../utils/constants";
import { formatNumber } from "../utils/helpers";

export default function PaymentsPage({ school, onAdd }) {
  const [search, setSearch] = useState("");
  const [methodF, setMethodF] = useState("All");
  const [termF, setTermF] = useState("All");
  const [modal, setModal] = useState(false);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form, setForm] = useState({ amount: "", method: "Mobile Money", term: "Term 1", date: new Date().toISOString().split("T")[0] });
  const [err, setErr] = useState("");

  const students = school.students || [];
  const payments = school.payments || [];
  const currency = school.settings?.currency || "UGX";

  const filtered = useMemo(() => {
    let list = [...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(p => p.studentName?.toLowerCase().includes(q) || p.receiptNumber?.toLowerCase().includes(q)); }
    if (methodF !== "All") list = list.filter(p => p.method === methodF);
    if (termF !== "All") list = list.filter(p => p.term === termF);
    return list;
  }, [payments, search, methodF, termF]);

  const suggestions = useMemo(() => {
    if (!studentSearch.trim() || !modal) return [];
    const q = studentSearch.toLowerCase();
    return students.filter(s => s.name.toLowerCase().includes(q) || (s.registrationNumber || "").toLowerCase().includes(q)).slice(0, 6);
  }, [students, studentSearch, modal]);

  const openModal = () => { setForm({ amount: "", method: "Mobile Money", term: "Term 1", date: new Date().toISOString().split("T")[0] }); setSelectedStudent(null); setStudentSearch(""); setErr(""); setModal(true); };

  const save = () => {
    if (!selectedStudent) return setErr("Please select a student.");
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) return setErr("Enter a valid amount.");
    onAdd({ studentId: selectedStudent.id, studentName: selectedStudent.name, classId: selectedStudent.classId, amount: Number(form.amount), method: form.method, term: form.term, date: form.date });
    setModal(false);
  };

  const fmt = formatNumber;
  const totalFiltered = filtered.reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div>
      <div className="ai ai-0" style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--s400)" }} />
          <Input placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <Select value={methodF} onChange={e => setMethodF(e.target.value)} style={{ width: "auto", minWidth: 140 }}>
          <option value="All">All Methods</option>{METHODS.map(m => <option key={m} value={m}>{m}</option>)}
        </Select>
        <Select value={termF} onChange={e => setTermF(e.target.value)} style={{ width: "auto", minWidth: 120 }}>
          <option value="All">All Terms</option>{TERMS.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Button variant="primary" onClick={openModal}><Plus size={16} /> Record Payment</Button>
      </div>

      {filtered.length === 0 ? (
        <div className="ai ai-1" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", padding: 52, textAlign: "center" }}>
          <div style={{ width: 68, height: 68, background: "var(--g50)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}><CreditCard size={30} color="var(--g600)" /></div>
          <p style={{ fontSize: 17, fontWeight: 700, color: "var(--s900)" }}>{payments.length === 0 ? "No payments recorded yet" : "No matching payments"}</p>
          <p style={{ fontSize: 13, color: "var(--s400)", marginTop: 5 }}>{payments.length === 0 ? "Click 'Record Payment' to get started." : "Try adjusting your filters."}</p>
        </div>
      ) : (
        <div className="ai ai-1" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: "var(--s50)", borderBottom: "1px solid var(--s200)" }}>
                {["Student", "Receipt", "Class", "Amount", "Method", "Term", "Date"].map((h, i) =>
                  <th key={i} style={{ padding: "12px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 600, color: "var(--s400)", textTransform: "uppercase", letterSpacing: .5, whiteSpace: "nowrap" }}>{h}</th>
                )}
              </tr></thead>
              <tbody>{filtered.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--s100)" }} onMouseEnter={e => e.currentTarget.style.background = "var(--s50)"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <td style={{ padding: "13px 14px", fontWeight: 600, color: "var(--s900)" }}>{p.studentName}</td>
                  <td style={{ padding: "13px 14px", fontFamily: "var(--mono)", fontSize: 12, color: "var(--s500)" }}>{p.receiptNumber}</td>
                  <td style={{ padding: "13px 14px" }}><Badge>{p.classId}</Badge></td>
                  <td style={{ padding: "13px 14px", fontWeight: 700, color: "var(--g700)" }}>{fmt(p.amount)} {currency}</td>
                  <td style={{ padding: "13px 14px", color: "var(--s500)" }}>{p.method}</td>
                  <td style={{ padding: "13px 14px", color: "var(--s500)" }}>{p.term}</td>
                  <td style={{ padding: "13px 14px", color: "var(--s500)" }}>{p.date}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--s100)", fontSize: 12, color: "var(--s400)", display: "flex", justifyContent: "space-between" }}>
            <span>{filtered.length} payment{filtered.length !== 1 ? "s" : ""}</span>
            <span>Total: <strong style={{ color: "var(--g700)" }}>{fmt(totalFiltered)} {currency}</strong></span>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {modal && (
        <Modal onClose={() => setModal(false)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <p style={{ fontSize: 18, fontWeight: 800, color: "var(--s900)" }}>Record Payment</p>
            <button onClick={() => setModal(false)} style={{ background: "var(--s50)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} /></button>
          </div>
          <ErrorBox>{err}</ErrorBox>

          {students.length === 0 && <InfoBox icon={DollarSign}>You need to add students first before recording payments.</InfoBox>}

          <Label style={{ marginTop: 0 }}>Student *</Label>
          {selectedStudent ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "var(--g50)", border: "1px solid var(--g200)", borderRadius: 9, marginBottom: 4 }}>
              <div>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--s900)" }}>{selectedStudent.name}</p>
                <p style={{ fontSize: 11, color: "var(--s500)" }}>{selectedStudent.classId} · Balance: {fmt((selectedStudent.feesRequired || 0) - (selectedStudent.feesPaid || 0))} {currency}</p>
              </div>
              <button onClick={() => { setSelectedStudent(null); setStudentSearch(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--s500)" }}><X size={16} /></button>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <Input value={studentSearch} onChange={e => setStudentSearch(e.target.value)} placeholder="Type student name..." />
              {suggestions.length > 0 && <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid var(--s200)", borderRadius: 9, marginTop: 4, boxShadow: "var(--sh-xl)", zIndex: 10, maxHeight: 200, overflowY: "auto" }}>
                {suggestions.map(s => <button key={s.id} onClick={() => { setSelectedStudent(s); setStudentSearch(""); setErr(""); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", borderBottom: "1px solid var(--s100)", cursor: "pointer", fontFamily: "var(--font)" }}>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--s900)" }}>{s.name}</p>
                  <p style={{ fontSize: 11, color: "var(--s500)" }}>{s.classId} · Bal: {fmt((s.feesRequired || 0) - (s.feesPaid || 0))}</p>
                </button>)}
              </div>}
            </div>
          )}

          <Label>Amount ({currency}) *</Label>
          <Input type="number" value={form.amount} onChange={e => { setForm(f => ({ ...f, amount: e.target.value })); setErr(""); }} placeholder="e.g. 250000" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><Label>Method</Label><Select value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}>{METHODS.map(m => <option key={m} value={m}>{m}</option>)}</Select></div>
            <div><Label>Term</Label><Select value={form.term} onChange={e => setForm(f => ({ ...f, term: e.target.value }))}>{TERMS.map(t => <option key={t} value={t}>{t}</option>)}</Select></div>
          </div>
          <Label>Date</Label>
          <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <Button variant="secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setModal(false)}>Cancel</Button>
            <Button variant="primary" style={{ flex: 1, justifyContent: "center" }} onClick={save}>Record Payment</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
