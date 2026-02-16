import { useState, useEffect, useRef } from "react";
import { BarChart3, CreditCard, FileText, Shield, Users, Clock, CheckCircle, X, ArrowUp } from "lucide-react";

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

export default function WelcomePage({ onGetStarted }) {
  const [comingSoon, setComingSoon] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [featRef, featVis] = useReveal(0.1);
  const [hlRef, hlVis] = useReveal(0.15);
  const [ctaRef, ctaVis] = useReveal(0.15);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    { icon: BarChart3, title: "Real-time Tracking", desc: "Monitor student balances and payment history in real-time with our intuitive administrative dashboard." },
    { icon: CreditCard, title: "Seamless Payments", desc: "Record payments via Mobile Money, Cash, or Bank Transfer with instant digital receipts for every transaction." },
    { icon: FileText, title: "Automated Reports", desc: "One-click financial summaries and PDF export. Filter by class, term, or student for complete transparency." }
  ];
  const highlights = [
    { icon: Shield, text: "OTP Email Verification" },
    { icon: Users, text: "Multi-Admin Support" },
    { icon: Clock, text: "Instant Balance Updates" },
    { icon: CheckCircle, text: "Any School Type" }
  ];

  return (
    <div style={{ fontFamily: "var(--font)", background: "#fff", overflowX: "hidden" }}>
      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: scrollY > 40 ? "rgba(255,255,255,.98)" : "rgba(255,255,255,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,.06)", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto", width: "100%", transition: "all .4s", boxShadow: scrollY > 40 ? "0 4px 20px rgba(0,0,0,.06)" : "none", animation: "fadeIn .6s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,var(--g600),var(--g700))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 18, boxShadow: "0 2px 8px rgba(22,163,74,.25)" }}>m</div>
          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--s900)", letterSpacing: "-.3px" }}>myFeesTracker</span>
        </div>
        <div className="lp-nav-links" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", border: "none", color: "var(--s600)", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "8px 14px", borderRadius: 8, fontFamily: "var(--font)" }}>Features</button>
          <button onClick={() => setComingSoon(true)} style={{ background: "none", border: "none", color: "var(--s600)", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "8px 14px", borderRadius: 8, fontFamily: "var(--font)" }}>Pricing</button>
          <button onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })} style={{ background: "none", border: "none", color: "var(--s600)", fontSize: 14, fontWeight: 500, cursor: "pointer", padding: "8px 14px", borderRadius: 8, fontFamily: "var(--font)" }}>About</button>
          <div style={{ width: 1, height: 24, background: "var(--s200)", margin: "0 8px" }} />
          <button onClick={onGetStarted} style={{ background: "none", border: "none", color: "var(--g700)", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 14px", fontFamily: "var(--font)" }}>Sign In</button>
          <button onClick={onGetStarted} className="bp" style={{ fontSize: 13.5, fontWeight: 600, cursor: "pointer", padding: "9px 20px", borderRadius: 10, fontFamily: "var(--font)", border: "none" }}>Get Started</button>
        </div>
        <button className="lp-hamburger" onClick={() => setMobileMenu(!mobileMenu)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", padding: 8, flexDirection: "column", gap: 5 }}>
          <div style={{ width: 22, height: 2, background: "var(--s700)", borderRadius: 2 }} />
          <div style={{ width: 22, height: 2, background: "var(--s700)", borderRadius: 2 }} />
          <div style={{ width: 16, height: 2, background: "var(--s700)", borderRadius: 2 }} />
        </button>
      </nav>

      {mobileMenu && <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,.4)" }} onClick={() => setMobileMenu(false)}>
        <div style={{ background: "#fff", padding: "20px 24px" }} onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Menu</span>
            <button onClick={() => setMobileMenu(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
          </div>
          {["Features", "Pricing", "About"].map(t => <button key={t} onClick={() => { setMobileMenu(false); if (t === "Pricing") setComingSoon(true); else document.getElementById(t.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); }} style={{ background: "none", border: "none", display: "block", width: "100%", textAlign: "left", padding: "12px 0", fontSize: 15, fontWeight: 500, color: "var(--s700)", cursor: "pointer", borderBottom: "1px solid var(--s100)", fontFamily: "var(--font)" }}>{t}</button>)}
          <button onClick={() => { setMobileMenu(false); onGetStarted(); }} className="bp" style={{ width: "100%", justifyContent: "center", padding: "14px 0", borderRadius: 12, marginTop: 12, border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)" }}>Get Started</button>
        </div>
      </div>}

      {/* HERO */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 80px", display: "flex", alignItems: "center", gap: 60, flexWrap: "wrap" }}>
        <div className="lp-hero-text" style={{ flex: "1 1 400px", minWidth: 280 }}>
          <div className="lp-badge-anim" style={{ display: "inline-block", background: "var(--g50)", border: "1px solid var(--g200)", borderRadius: 20, padding: "6px 16px", marginBottom: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--g700)", letterSpacing: ".5px", textTransform: "uppercase" }}>School Fees Records Management</span>
          </div>
          <h1 className="lp-title-anim" style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, lineHeight: 1.08, color: "var(--s900)", letterSpacing: "-1.5px", marginBottom: 20 }}>
            Simplify School Fee Management with <span className="lp-gradient-text">myFeesTracker</span>
          </h1>
          <p className="lp-desc-anim" style={{ fontSize: "clamp(15px,1.8vw,18px)", color: "var(--s500)", lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
            The all-in-one platform for tracking collections, processing payments, and generating financial reports with ease. Modernize your bursary and give parents peace of mind.
          </p>
          <div className="lp-btns-anim" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button onClick={onGetStarted} className="bp" style={{ fontSize: 15, fontWeight: 700, cursor: "pointer", padding: "14px 28px", borderRadius: 12, fontFamily: "var(--font)", display: "flex", alignItems: "center", gap: 8, border: "none" }}>Try for Free</button>
          </div>
        </div>
        <div className="lp-hero-visual" style={{ flex: "1 1 400px", minWidth: 280, transform: `translateY(${scrollY * -0.04}px)` }}>
          <div className="lp-mockup" style={{ background: "linear-gradient(135deg,var(--g50) 0%,#fff 100%)", borderRadius: 20, border: "1px solid var(--s100)", padding: 20, boxShadow: "0 20px 60px rgba(0,0,0,.08)" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
            </div>
            <div style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid var(--s100)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 11, color: "var(--s400)", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>Total Collected</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "var(--g700)" }}>UGX 59.4M</p>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--g50)", display: "flex", alignItems: "center", justifyContent: "center" }}><BarChart3 size={24} color="var(--g600)" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[{ l: "Students", v: "342" }, { l: "Paid", v: "78%" }, { l: "Pending", v: "22%" }].map((s, i) => (
                  <div key={i} style={{ background: "var(--s50)", borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
                    <p style={{ fontSize: 10, color: "var(--s400)", fontWeight: 600 }}>{s.l}</p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: "var(--s800)", marginTop: 2 }}>{s.v}</p>
                  </div>))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" ref={featRef} style={{ background: "var(--s50)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56, opacity: featVis ? 1 : 0, transform: featVis ? "translateY(0)" : "translateY(30px)", transition: "all .7s" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--g600)", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }}>Built for Efficiency</p>
            <h2 style={{ fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 900, color: "var(--s900)", letterSpacing: "-.5px", marginBottom: 16 }}>Everything you need to manage school finances</h2>
            <p style={{ fontSize: 16, color: "var(--s500)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>Stop chasing paper receipts and manual spreadsheets. Our platform automates the tedious work so you can focus on education.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="lp-feat-card" style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", border: "1px solid var(--s100)", cursor: "default", opacity: featVis ? 1 : 0, transform: featVis ? "translateY(0)" : "translateY(30px)", transition: `all .6s ${i * .15}s` }}>
                <div className="lp-feat-icon" style={{ width: 50, height: 50, borderRadius: 14, background: "var(--g50)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}><f.icon size={24} color="var(--g600)" /></div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--s900)", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14.5, color: "var(--s500)", lineHeight: 1.7 }}>{f.desc}</p>
              </div>))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section ref={hlRef} style={{ padding: "60px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
          {highlights.map((h, i) => (
            <div key={i} className="lp-hl-card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 18px", borderRadius: 14, border: "1px solid var(--s100)", background: "#fff", opacity: hlVis ? 1 : 0, transform: hlVis ? "translateY(0)" : "translateY(24px)", transition: `all .5s ${i * .12}s` }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: "var(--g50)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><h.icon size={20} color="var(--g600)" /></div>
              <span style={{ fontSize: 14.5, fontWeight: 600, color: "var(--s800)" }}>{h.text}</span>
            </div>))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" ref={ctaRef} style={{ padding: "40px 24px 80px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,var(--g700) 0%,var(--g600) 50%,var(--g500) 100%)", borderRadius: 24, padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden", opacity: ctaVis ? 1 : 0, transform: ctaVis ? "scale(1)" : "scale(.92)", transition: "all .7s" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,.06)" }} />
          <h2 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 900, color: "#fff", marginBottom: 16, position: "relative" }}>Ready to transform your school's billing?</h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.8)", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7, position: "relative" }}>Try for free and see how myFeesTracker simplifies fee collection. No signup required.</p>
          <button onClick={onGetStarted} className="lp-cta-btn" style={{ background: "#fff", color: "var(--g700)", border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", padding: "14px 28px", borderRadius: 12, fontFamily: "var(--font)", boxShadow: "0 4px 16px rgba(0,0,0,.15)", position: "relative" }}>Try Now</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid var(--s100)", padding: "48px 24px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="lp-footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32, marginBottom: 40 }}>
            <div style={{ minWidth: 180 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,var(--g600),var(--g700))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 15 }}>m</div>
                <span style={{ fontSize: 16, fontWeight: 800, color: "var(--s900)" }}>myFeesTracker</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--s500)", lineHeight: 1.6 }}>The most reliable platform for modern school financial management. Trusted by educators worldwide.</p>
            </div>
            {[{ title: "Product", items: ["Features", "Pricing", "Security"] }, { title: "Support", items: ["Documentation", "Help Center", "Contact"] }, { title: "Company", items: ["About Us", "Privacy Policy", "Terms of Service"] }].map((col, ci) => (
              <div key={ci}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--s900)", letterSpacing: ".5px", textTransform: "uppercase", marginBottom: 14 }}>{col.title}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {col.items.map((item, ii) => <button key={ii} className="lp-footer-link" onClick={() => { if (item === "Features") document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }); else setComingSoon(true); }} style={{ background: "none", border: "none", color: "var(--s500)", fontSize: 13.5, cursor: "pointer", textAlign: "left", padding: 0, fontFamily: "var(--font)", display: "inline-block" }}>{item}</button>)}
                </div>
              </div>))}
          </div>
          <div style={{ borderTop: "1px solid var(--s100)", paddingTop: 20, textAlign: "center" }}>
            <p style={{ fontSize: 12.5, color: "var(--s400)" }}>© 2026 myFeesTracker by Geowise Media. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ position: "fixed", bottom: 28, right: 28, width: 44, height: 44, borderRadius: 12, background: "var(--g600)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(22,163,74,.35)", zIndex: 90, opacity: scrollY > 400 ? 1 : 0, transform: scrollY > 400 ? "translateY(0)" : "translateY(16px)", transition: "all .35s", pointerEvents: scrollY > 400 ? "auto" : "none" }}><ArrowUp size={20} /></button>

      {/* Coming soon modal */}
      {comingSoon && <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }} onClick={() => setComingSoon(false)}>
        <div className="ai" style={{ background: "#fff", borderRadius: 20, padding: "40px 36px", maxWidth: 420, width: "100%", textAlign: "center" }} onClick={e => e.stopPropagation()}>
          <button onClick={() => setComingSoon(false)} style={{ position: "absolute", top: 16, right: 16, background: "var(--s50)", border: "none", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={16} /></button>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--g50)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}><Clock size={30} color="var(--g600)" /></div>
          <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--s900)", marginBottom: 10 }}>Feature Yet to Come</h3>
          <p style={{ fontSize: 14.5, color: "var(--s500)", lineHeight: 1.7 }}>This is a demo. The full version has more features!</p>
          <button onClick={() => setComingSoon(false)} className="bp" style={{ marginTop: 24, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "12px 32px", borderRadius: 10, fontFamily: "var(--font)", border: "none" }}>Got it</button>
        </div>
      </div>}
    </div>
  );
}
