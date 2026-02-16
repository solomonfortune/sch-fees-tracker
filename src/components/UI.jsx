// Shared UI components matching the real app's design

export function Button({ variant = "primary", children, small, style = {}, ...rest }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 7,
    padding: small ? "7px 14px" : "10px 20px", borderRadius: 9,
    fontSize: small ? 12.5 : 13.5, fontWeight: 600, cursor: rest.disabled ? "not-allowed" : "pointer",
    whiteSpace: "nowrap", transition: "all var(--tr)", border: "none", fontFamily: "var(--font)",
    opacity: rest.disabled ? 0.5 : 1,
  };
  const variants = {
    primary: { background: "var(--g600)", color: "#fff", boxShadow: "0 3px 12px rgba(22,163,74,.28)" },
    secondary: { background: "#fff", color: "var(--s600)", border: "1.5px solid var(--s200)", boxShadow: "var(--sh-sm)" },
    ghost: { background: "transparent", color: "var(--s500)" },
    danger: { background: "var(--r50)", color: "var(--r500)" },
    red: { background: "var(--r500)", color: "#fff", boxShadow: "0 3px 10px rgba(239,68,68,.28)" },
  };
  const cls = { primary: "bp", secondary: "bs", ghost: "bg", danger: "bd", red: "" };
  return <button className={cls[variant]} style={{ ...base, ...variants[variant], ...style }} {...rest}>{children}</button>;
}

export function Input({ style = {}, ...rest }) {
  return <input className="inp" style={{
    width: "100%", padding: "10px 14px", border: "1.5px solid var(--s200)", borderRadius: 9,
    fontSize: 13.5, color: "var(--s800)", background: "#fff", outline: "none",
    fontFamily: "var(--font)", transition: "all .2s", ...style
  }} {...rest} />;
}

export function Select({ style = {}, children, ...rest }) {
  return <select style={{
    width: "100%", padding: "10px 14px", border: "1.5px solid var(--s200)", borderRadius: 9,
    fontSize: 13.5, color: "var(--s800)", background: "#fff", fontFamily: "var(--font)",
    outline: "none", cursor: "pointer", ...style
  }} {...rest}>{children}</select>;
}

export function Label({ children, style = {} }) {
  return <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--s500)", marginBottom: 6, marginTop: 14, ...style }}>{children}</label>;
}

export function Badge({ children, color = "var(--g600)", bg = "var(--g50)" }) {
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, color, background: bg }}>{children}</span>;
}

export function ErrorBox({ children }) {
  if (!children) return null;
  return <div style={{ background: "var(--r50)", border: "1px solid var(--r200)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--r500)", marginBottom: 14 }}>{children}</div>;
}

export function InfoBox({ children, icon: Icon }) {
  return <div style={{ background: "var(--b50)", border: "1px solid var(--b200)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
    {Icon && <Icon size={18} style={{ color: "var(--b500)", flexShrink: 0, marginTop: 1 }} />}
    <p style={{ fontSize: 12.5, color: "var(--b700)", lineHeight: 1.5 }}>{children}</p>
  </div>;
}

export function Toast({ msg, type = "success", onClose }) {
  if (!msg) return null;
  const bg = type === "success" ? "var(--g600)" : type === "error" ? "var(--r500)" : "var(--b500)";
  return <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: bg, color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 13.5, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,.15)", animation: "fadeIn .3s", display: "flex", alignItems: "center", gap: 12 }}>
    {msg}
    <button onClick={onClose} style={{ background: "rgba(255,255,255,.2)", border: "none", color: "#fff", cursor: "pointer", borderRadius: 6, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>×</button>
  </div>;
}

export function Avatar({ size = 36, letter = "U" }) {
  return <div style={{
    width: size, height: size, borderRadius: size * 0.28,
    background: "linear-gradient(135deg, var(--g600), var(--g700))",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff", fontSize: size * 0.4, fontWeight: 700, flexShrink: 0
  }}>{letter}</div>;
}

export function Modal({ children, onClose }) {
  return <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
    <div className="ai" onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "var(--rxl)", padding: "32px 28px", maxWidth: 480, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "var(--sh-xl)" }}>
      {children}
    </div>
  </div>;
}
