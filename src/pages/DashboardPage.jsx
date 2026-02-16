import { useMemo } from "react";
import { Users, Wallet, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";
import { Badge } from "../components/UI";
import { METHODS, getClassesBySchoolType } from "../utils/constants";
import { formatNumber, formatShortNumber } from "../utils/helpers";

export default function DashboardPage({ school }) {
  const students = school.students || [];
  const payments = school.payments || [];
  const CLASSES = getClassesBySchoolType(school.schoolType);
  const totalCollected = students.reduce((s, st) => s + (st.feesPaid || 0), 0);
  const totalRequired = students.reduce((s, st) => s + (st.feesRequired || 0), 0);
  const outstanding = totalRequired - totalCollected;
  const withBal = students.filter((st) => (st.feesPaid || 0) < (st.feesRequired || 0)).length;
  const recent = [...payments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const fmt = (n) => formatNumber(n);
  const fmtS = (n) => formatShortNumber(n);

  const byMethod = METHODS.map((m) => ({
    method: m,
    total: payments.filter((p) => p.method === m).reduce((s, p) => s + (p.amount || 0), 0)
  })).filter((x) => x.total > 0);
  const maxMethod = Math.max(...byMethod.map((x) => x.total), 1);

  const byClass = CLASSES.map((c) => ({
    class: c,
    total: students.filter((s) => s.classId === c).reduce((s, st) => s + (st.feesPaid || 0), 0)
  }))
    .filter((x) => x.total > 0)
    .slice(0, 8);
  const maxClass = Math.max(...byClass.map((x) => x.total), 1);

  const stats = [
    { label: "Total Students", value: students.length, icon: Users, bg: "var(--b50)", clr: "var(--b500)", bar: "var(--b500)" },
    { label: "Total Collected", value: fmtS(totalCollected), icon: Wallet, bg: "var(--g50)", clr: "var(--g700)", bar: "var(--g600)" },
    { label: "Outstanding", value: fmtS(outstanding), icon: TrendingUp, bg: "var(--a50)", clr: "var(--a500)", bar: "var(--a500)" },
    { label: "With Balance", value: withBal, icon: AlertTriangle, bg: "var(--r50)", clr: "var(--r500)", bar: "var(--r500)" }
  ];

  const collectionRate = totalRequired > 0 ? ((totalCollected / totalRequired) * 100).toFixed(1) : 0;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {stats.map((st, i) => (
          <div
            key={i}
            className={`ai ai-${i} cl`}
            style={{
              background: "#fff",
              borderRadius: "var(--rl)",
              border: "1px solid var(--s200)",
              padding: "20px 20px 0",
              position: "relative",
              overflow: "hidden",
              transition: "all .25s cubic-bezier(.4,0,.2,1)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--s400)", marginBottom: 8 }}>{st.label}</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: "var(--s900)", lineHeight: 1 }}>{st.value}</p>
              </div>
              <div style={{ width: 42, height: 42, background: st.bg, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", color: st.clr }}>
                <st.icon size={19} />
              </div>
            </div>
            <div style={{ height: 20 }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: st.bar, borderRadius: "0 0 16px 16px" }} />
          </div>
        ))}
      </div>

      {students.length === 0 && (
        <div className="ai ai-4" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", padding: 52, textAlign: "center" }}>
          <div style={{ width: 68, height: 68, background: "var(--g50)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", border: "2px solid var(--g100)" }}>
            <Users size={30} color="var(--g600)" />
          </div>
          <p style={{ fontSize: 17, fontWeight: 700, color: "var(--s900)" }}>No students yet</p>
          <p style={{ fontSize: 13, color: "var(--s400)", marginTop: 5 }}>Go to Students to add your first student record.</p>
        </div>
      )}

      {students.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          {/* Collection Rate Progress */}
          <div className="ai ai-4" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.5 }}>Collection Rate</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: "var(--g700)", marginTop: 4 }}>{collectionRate}%</p>
              </div>
              <div style={{ width: 52, height: 52, background: "var(--g50)", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--g100)" }}>
                <BarChart3 size={24} color="var(--g600)" />
              </div>
            </div>
            <div style={{ background: "var(--s100)", borderRadius: 8, height: 12, overflow: "hidden" }}>
              <div style={{ width: `${collectionRate}%`, height: "100%", background: "linear-gradient(90deg,var(--g600),var(--g500))", borderRadius: 8, transition: "width .8s cubic-bezier(.4,0,.2,1)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 11, color: "var(--s500)" }}>
              <span>Collected: {fmt(totalCollected)}</span>
              <span>Required: {fmt(totalRequired)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="ai ai-4" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", padding: "20px 24px" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 }}>Payment Methods</p>
            {byMethod.length === 0 ? (
              <p style={{ color: "var(--s400)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No payments yet</p>
            ) : (
              byMethod.map((m, i) => (
                <div key={i} style={{ marginBottom: i < byMethod.length - 1 ? 14 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--s700)" }}>{m.method}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--g700)" }}>{fmt(m.total)}</span>
                  </div>
                  <div style={{ background: "var(--s100)", borderRadius: 6, height: 8, overflow: "hidden" }}>
                    <div style={{ width: `${(m.total / maxMethod) * 100}%`, height: "100%", background: "var(--g500)", borderRadius: 6, transition: "width .6s cubic-bezier(.4,0,.2,1)" }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {students.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Payments by Class */}
          <div className="ai ai-4" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", padding: "20px 24px" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--s400)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 }}>Collections by Class</p>
            {byClass.length === 0 ? (
              <p style={{ color: "var(--s400)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No data yet</p>
            ) : (
              byClass.map((c, i) => (
                <div key={i} style={{ marginBottom: i < byClass.length - 1 ? 12 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--s700)" }}>{c.class}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--b600)" }}>{fmt(c.total)}</span>
                  </div>
                  <div style={{ background: "var(--s100)", borderRadius: 6, height: 7, overflow: "hidden" }}>
                    <div style={{ width: `${(c.total / maxClass) * 100}%`, height: "100%", background: "var(--b500)", borderRadius: 6, transition: "width .6s cubic-bezier(.4,0,.2,1)" }} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recent Payments */}
          <div className="ai ai-4" style={{ background: "#fff", borderRadius: "var(--rl)", border: "1px solid var(--s200)", overflow: "hidden" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--s100)" }}>
              <p style={{ fontSize: 14.5, fontWeight: 700, color: "var(--s900)" }}>Recent Payments</p>
              <p style={{ fontSize: 11.5, color: "var(--s400)", marginTop: 1 }}>Latest transactions</p>
            </div>
            <div style={{ maxHeight: 280, overflowY: "auto" }}>
              {recent.length === 0 ? (
                <p style={{ padding: "22px 20px", color: "var(--s400)", fontSize: 13 }}>No payments yet.</p>
              ) : (
                recent.map((p, i) => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 20px", borderBottom: i < recent.length - 1 ? "1px solid var(--s100)" : "none" }}>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--s900)" }}>{p.studentName}</p>
                      <p style={{ fontSize: 11, color: "var(--s400)", marginTop: 2, fontFamily: "var(--mono)" }}>
                        {p.receiptNumber} · {p.method}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: "var(--g700)" }}>{fmt(p.amount)} UGX</p>
                      <p style={{ fontSize: 11, color: "var(--s400)", marginTop: 1 }}>{p.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
