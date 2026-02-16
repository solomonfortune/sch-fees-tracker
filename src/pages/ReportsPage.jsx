import { useMemo, useState } from "react";
import { BarChart3, Users, Wallet, TrendingUp, FileText } from "lucide-react";
import { Select, Badge } from "../components/UI";
import { TERMS, getClassesBySchoolType } from "../utils/constants";
import { formatNumber, formatShortNumber } from "../utils/helpers";

export default function ReportsPage({ school }) {
  const [classF, setClassF] = useState("All");
  const [termF, setTermF] = useState("All");
  const [yearF, setYearF] = useState("All");

  const students = school.students || [];
  const payments = school.payments || [];
  const CLASSES = getClassesBySchoolType(school.schoolType);
  const currency = school.settings?.currency || "UGX";
  const fmt = formatNumber;
  const fmtS = formatShortNumber;

  const years = useMemo(() => [...new Set(students.map(s => s.academicYear || "2026"))].sort(), [students]);

  const fStudents = useMemo(() => {
    let list = students.filter(s => s.status !== "completed");
    if (classF !== "All") list = list.filter(s => s.classId === classF);
    if (termF !== "All") list = list.filter(s => s.term === termF);
    if (yearF !== "All") list = list.filter(s => s.academicYear === yearF);
    return list;
  }, [students, classF, termF, yearF]);

  const fPayments = useMemo(() => {
    let list = payments;
    if (classF !== "All") list = list.filter(p => p.classId === classF);
    if (termF !== "All") list = list.filter(p => p.term === termF);
    return list;
  }, [payments, classF, termF]);

  const totalReq = fStudents.reduce((s, st) => s + (st.feesRequired || 0), 0);
  const totalPaid = fStudents.reduce((s, st) => s + (st.feesPaid || 0), 0);
  const totalOut = totalReq - totalPaid;
  const rate = totalReq > 0 ? ((totalPaid / totalReq) * 100).toFixed(1) : 0;
  const paidCount = fStudents.filter(s => (s.feesPaid || 0) >= (s.feesRequired || 0)).length;

  const stats = [
    { l: "Students", v: fStudents.length, icon: Users, clr: "var(--b500)", bg: "var(--b50)" },
    { l: "Total Required", v: fmtS(totalReq), icon: FileText, clr: "var(--s600)", bg: "var(--s50)" },
    { l: "Total Collected", v: fmtS(totalPaid), icon: Wallet, clr: "var(--g700)", bg: "var(--g50)" },
    { l: "Outstanding", v: fmtS(totalOut), icon: TrendingUp, clr: "var(--r500)", bg: "var(--r50)" },
    { l: "Collection Rate", v: rate + "%", icon: BarChart3, clr: "var(--a500)", bg: "var(--a50)" },
  ];

  return (
    <div>
      {/* Filters */}
      <div className="ai ai-0" style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <Select value={yearF} onChange={e => setYearF(e.target.value)} style={{ width: "auto", minWidth: 120 }}>
          <option value="All">All Years</option>{years.map(y => <option key={y} value={y}>{y}</option>)}
        </Select>
        <Select value={classF} onChange={e => setClassF(e.target.value)} style={{ width: "auto", minWidth: 140 }}>
          <option value="All">All Classes</option>{CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select value={termF} onChange={e => setTermF(e.target.value)} style={{ width: "auto", minWidth: 120 }}>
          <option value="All">All Terms</option>{TERMS.map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i} className={`ai ai-${i} cl`} style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", padding: "20px 18px", transition: "all .25s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: .5, color: "var(--s400)" }}>{s.l}</p>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.clr }}><s.icon size={17} /></div>
            </div>
            <p style={{ fontSize: 24, fontWeight: 800, color: s.clr }}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Collection progress */}
      {fStudents.length > 0 && (
        <div className="ai ai-4" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--s900)" }}>Overall Collection Progress</p>
            <span style={{ fontSize: 20, fontWeight: 800, color: "var(--g700)" }}>{rate}%</span>
          </div>
          <div style={{ background: "var(--s100)", borderRadius: 8, height: 14, overflow: "hidden" }}>
            <div className="pf" style={{ width: `${rate}%`, height: "100%", borderRadius: 8, transition: "width 1s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 12, color: "var(--s500)" }}>
            <span>{paidCount} of {fStudents.length} students fully paid</span>
            <span>{fmt(totalPaid)} / {fmt(totalReq)} {currency}</span>
          </div>
        </div>
      )}

      {/* Student detail table */}
      {fStudents.length === 0 ? (
        <div className="ai ai-4" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", padding: 52, textAlign: "center" }}>
          <div style={{ width: 68, height: 68, background: "var(--g50)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}><BarChart3 size={30} color="var(--g600)" /></div>
          <p style={{ fontSize: 17, fontWeight: 700, color: "var(--s900)" }}>No data to display</p>
          <p style={{ fontSize: 13, color: "var(--s400)", marginTop: 5 }}>Add students and record payments to see reports.</p>
        </div>
      ) : (
        <div className="ai ai-4" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", overflow: "hidden" }}>
          <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--s100)" }}>
            <p style={{ fontSize: 14.5, fontWeight: 700, color: "var(--s900)" }}>Student Summary</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: "var(--s50)", borderBottom: "1px solid var(--s200)" }}>
                {["Name", "Class", "Term", "Required", "Paid", "Balance", "Status"].map((h, i) =>
                  <th key={i} style={{ padding: "12px 14px", textAlign: "left", fontSize: 10.5, fontWeight: 600, color: "var(--s400)", textTransform: "uppercase", letterSpacing: .5 }}>{h}</th>
                )}
              </tr></thead>
              <tbody>{fStudents.map(s => {
                const bal = (s.feesRequired || 0) - (s.feesPaid || 0);
                const paid = bal <= 0;
                return (
                  <tr key={s.id} style={{ borderBottom: "1px solid var(--s100)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--s900)" }}>{s.name}</td>
                    <td style={{ padding: "12px 14px" }}><Badge>{s.classId}</Badge></td>
                    <td style={{ padding: "12px 14px", color: "var(--s500)" }}>{s.term}</td>
                    <td style={{ padding: "12px 14px" }}>{fmt(s.feesRequired)} {currency}</td>
                    <td style={{ padding: "12px 14px", color: "var(--g700)", fontWeight: 600 }}>{fmt(s.feesPaid || 0)} {currency}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: paid ? "var(--g700)" : "var(--r500)" }}>{fmt(Math.abs(bal))} {currency}</td>
                    <td style={{ padding: "12px 14px" }}>{paid ? <Badge>Paid</Badge> : <Badge color="var(--r500)" bg="var(--r50)">Unpaid</Badge>}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
