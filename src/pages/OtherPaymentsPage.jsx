import { useState, useMemo } from "react";
import { Search, Plus, Trash2, X, Receipt, Tag, FolderPlus, Wallet } from "lucide-react";
import { Button, Input, Select, Label, Badge, ErrorBox, Modal, InfoBox } from "../components/UI";
import { METHODS, DEFAULT_CATEGORIES } from "../utils/constants";
import { formatNumber } from "../utils/helpers";

export default function OtherPaymentsPage({ school, onAddPayment, onDeletePayment, onAddCategory, onDeleteCategory }) {
  const [search, setSearch] = useState("");
  const [catF, setCatF] = useState("All");
  const [methodF, setMethodF] = useState("All");
  const [modal, setModal] = useState(null);
  const [catModal, setCatModal] = useState(false);
  const [delId, setDelId] = useState(null);
  const [err, setErr] = useState("");

  const [payForm, setPayForm] = useState({ payerName: "", payerContact: "", categoryId: "", description: "", amount: "", method: "Cash", date: new Date().toISOString().split("T")[0], reference: "" });
  const [catForm, setCatForm] = useState({ name: "", description: "" });

  const customCategories = school.paymentCategories || [];
  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];
  const otherPayments = school.otherPayments || [];
  const currency = school.settings?.currency || "UGX";
  const fmt = formatNumber;

  const totalCollected = useMemo(() => otherPayments.reduce((s, p) => s + (p.amount || 0), 0), [otherPayments]);

  const filtered = useMemo(() => {
    let list = [...otherPayments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(p => p.payerName?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q) || p.receiptNumber?.toLowerCase().includes(q)); }
    if (catF !== "All") list = list.filter(p => p.categoryId === catF);
    if (methodF !== "All") list = list.filter(p => p.method === methodF);
    return list;
  }, [otherPayments, search, catF, methodF]);

  const byCat = useMemo(() => {
    const d = {};
    otherPayments.forEach(p => { const c = allCategories.find(x => x.id === p.categoryId); const n = c?.name || "Unknown"; d[n] = (d[n] || 0) + (p.amount || 0); });
    return Object.entries(d).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total);
  }, [otherPayments, allCategories]);
  const maxCat = Math.max(...byCat.map(x => x.total), 1);

  const openAdd = () => { setPayForm({ payerName: "", payerContact: "", categoryId: allCategories[0]?.id || "", description: "", amount: "", method: "Cash", date: new Date().toISOString().split("T")[0], reference: "" }); setErr(""); setModal("add"); };

  const savePayment = () => {
    if (!payForm.payerName.trim()) return setErr("Payer name is required.");
    if (!payForm.categoryId) return setErr("Select a category.");
    if (!payForm.amount || Number(payForm.amount) <= 0) return setErr("Enter a valid amount.");
    const cat = allCategories.find(c => c.id === payForm.categoryId);
    onAddPayment({ ...payForm, payerName: payForm.payerName.trim(), categoryName: cat?.name || "Unknown", amount: Number(payForm.amount) });
    setModal(null);
  };

  const saveCat = () => {
    if (!catForm.name.trim()) return setErr("Category name is required.");
    if (allCategories.some(c => c.name.toLowerCase() === catForm.name.trim().toLowerCase())) return setErr("Category already exists.");
    onAddCategory({ name: catForm.name.trim(), description: catForm.description.trim() });
    setCatModal(false);
  };

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
        <div className="ai ai-0 cl" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", padding: "20px 20px 0", position: "relative", overflow: "hidden", transition: "all .25s" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><p style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, color: "var(--s400)", marginBottom: 8 }}>Total Collected</p><p style={{ fontSize: 26, fontWeight: 800, color: "var(--g700)" }}>{fmt(totalCollected)}</p></div>
            <div style={{ width: 42, height: 42, background: "var(--g50)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center" }}><Wallet size={19} color="var(--g600)" /></div>
          </div>
          <div style={{ height: 20 }} /><div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "var(--g600)" }} />
        </div>
        <div className="ai ai-1 cl" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", padding: "20px 20px 0", position: "relative", overflow: "hidden", transition: "all .25s" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><p style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, color: "var(--s400)", marginBottom: 8 }}>Transactions</p><p style={{ fontSize: 26, fontWeight: 800, color: "var(--b500)" }}>{otherPayments.length}</p></div>
            <div style={{ width: 42, height: 42, background: "var(--b50)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center" }}><Receipt size={19} color="var(--b500)" /></div>
          </div>
          <div style={{ height: 20 }} /><div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "var(--b500)" }} />
        </div>
        <div className="ai ai-2 cl" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", padding: "20px 20px 0", position: "relative", overflow: "hidden", transition: "all .25s" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div><p style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, color: "var(--s400)", marginBottom: 8 }}>Categories</p><p style={{ fontSize: 26, fontWeight: 800, color: "var(--a500)" }}>{allCategories.length}</p></div>
            <div style={{ width: 42, height: 42, background: "var(--a50)", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center" }}><Tag size={19} color="var(--a500)" /></div>
          </div>
          <div style={{ height: 20 }} /><div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "var(--a500)" }} />
        </div>
      </div>

      {/* By category chart */}
      {byCat.length > 0 && (
        <div className="ai ai-3" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", padding: "20px 24px", marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "var(--s400)", textTransform: "uppercase", letterSpacing: .5, marginBottom: 16 }}>By Category</p>
          {byCat.map((c, i) => <div key={i} style={{ marginBottom: i < byCat.length - 1 ? 14 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--s700)" }}>{c.name}</span><span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--g700)" }}>{fmt(c.total)} {currency}</span></div>
            <div style={{ background: "var(--s100)", borderRadius: 6, height: 8, overflow: "hidden" }}><div style={{ width: `${(c.total / maxCat) * 100}%`, height: "100%", background: "var(--g500)", borderRadius: 6 }} /></div>
          </div>)}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--s400)" }} />
          <Input placeholder="Search payments..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
        </div>
        <Select value={catF} onChange={e => setCatF(e.target.value)} style={{ width: "auto", minWidth: 150 }}>
          <option value="All">All Categories</option>{allCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <Button variant="secondary" onClick={() => { setCatForm({ name: "", description: "" }); setErr(""); setCatModal(true); }}><FolderPlus size={16} /> Add Category</Button>
        <Button variant="primary" onClick={openAdd}><Plus size={16} /> Record Payment</Button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", padding: 52, textAlign: "center" }}>
          <div style={{ width: 68, height: 68, background: "var(--g50)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}><Receipt size={30} color="var(--g600)" /></div>
          <p style={{ fontSize: 17, fontWeight: 700, color: "var(--s900)" }}>No other payments yet</p>
          <p style={{ fontSize: 13, color: "var(--s400)", marginTop: 5 }}>Record construction fees, trips, uniforms and more.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: "var(--s50)", borderBottom: "1px solid var(--s200)" }}>
                {["Payer", "Receipt", "Category", "Amount", "Method", "Date", ""].map((h, i) =>
                  <th key={i} style={{ padding: "12px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 600, color: "var(--s400)", textTransform: "uppercase", letterSpacing: .5, whiteSpace: "nowrap" }}>{h}</th>)}
              </tr></thead>
              <tbody>{filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--s100)" }}>
                  <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--s900)" }}>{p.payerName}</td>
                  <td style={{ padding: "12px 14px", fontFamily: "var(--mono)", fontSize: 12, color: "var(--s500)" }}>{p.receiptNumber}</td>
                  <td style={{ padding: "12px 14px" }}><Badge color="var(--b600)" bg="var(--b50)">{p.categoryName}</Badge></td>
                  <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--g700)" }}>{fmt(p.amount)} {currency}</td>
                  <td style={{ padding: "12px 14px", color: "var(--s500)" }}>{p.method}</td>
                  <td style={{ padding: "12px 14px", color: "var(--s500)" }}>{p.date}</td>
                  <td style={{ padding: "12px 14px" }}><button onClick={() => setDelId(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--r500)" }}><Trash2 size={15} /></button></td>
                </tr>))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {modal && <Modal onClose={() => setModal(null)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><p style={{ fontSize: 18, fontWeight: 800, color: "var(--s900)" }}>Record Other Payment</p><button onClick={() => setModal(null)} style={{ background: "var(--s50)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} /></button></div>
        <ErrorBox>{err}</ErrorBox>
        <Label style={{ marginTop: 0 }}>Payer Name *</Label><Input value={payForm.payerName} onChange={e => { setPayForm(f => ({ ...f, payerName: e.target.value })); setErr(""); }} placeholder="e.g. John Musisi" />
        <Label>Contact</Label><Input value={payForm.payerContact} onChange={e => setPayForm(f => ({ ...f, payerContact: e.target.value }))} placeholder="Phone or email" />
        <Label>Category *</Label><Select value={payForm.categoryId} onChange={e => setPayForm(f => ({ ...f, categoryId: e.target.value }))}>{allCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
        <Label>Description</Label><Input value={payForm.description} onChange={e => setPayForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional note" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div><Label>Amount *</Label><Input type="number" value={payForm.amount} onChange={e => { setPayForm(f => ({ ...f, amount: e.target.value })); setErr(""); }} placeholder="e.g. 50000" /></div>
          <div><Label>Method</Label><Select value={payForm.method} onChange={e => setPayForm(f => ({ ...f, method: e.target.value }))}>{METHODS.map(m => <option key={m} value={m}>{m}</option>)}</Select></div>
        </div>
        <Label>Date</Label><Input type="date" value={payForm.date} onChange={e => setPayForm(f => ({ ...f, date: e.target.value }))} />
        <Label>Reference</Label><Input value={payForm.reference} onChange={e => setPayForm(f => ({ ...f, reference: e.target.value }))} placeholder="Transaction ID or ref" />
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}><Button variant="secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setModal(null)}>Cancel</Button><Button variant="primary" style={{ flex: 1, justifyContent: "center" }} onClick={savePayment}>Record Payment</Button></div>
      </Modal>}

      {/* Category Modal */}
      {catModal && <Modal onClose={() => setCatModal(false)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><p style={{ fontSize: 18, fontWeight: 800, color: "var(--s900)" }}>Add Category</p><button onClick={() => setCatModal(false)} style={{ background: "var(--s50)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} /></button></div>
        <ErrorBox>{err}</ErrorBox>
        <Label style={{ marginTop: 0 }}>Name *</Label><Input value={catForm.name} onChange={e => { setCatForm(f => ({ ...f, name: e.target.value })); setErr(""); }} placeholder="e.g. PTA Fees" />
        <Label>Description</Label><Input value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" />
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}><Button variant="secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setCatModal(false)}>Cancel</Button><Button variant="primary" style={{ flex: 1, justifyContent: "center" }} onClick={saveCat}>Add Category</Button></div>
      </Modal>}

      {/* Delete */}
      {delId && <Modal onClose={() => setDelId(null)}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, background: "var(--r50)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Trash2 size={24} color="var(--r500)" /></div>
          <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "var(--s900)" }}>Delete Payment?</p>
          <p style={{ fontSize: 13, color: "var(--s500)", marginBottom: 24 }}>This cannot be undone.</p>
          <div style={{ display: "flex", gap: 12 }}><Button variant="secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setDelId(null)}>Cancel</Button><Button variant="red" style={{ flex: 1, justifyContent: "center" }} onClick={() => { onDeletePayment(delId); setDelId(null); }}>Delete</Button></div>
        </div>
      </Modal>}
    </div>
  );
}
