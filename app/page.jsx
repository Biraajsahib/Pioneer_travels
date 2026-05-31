"use client";
import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─── */
const gold = "#C9A96E";
const goldLight = "#E2C97E";
const goldDark = "#A07840";
const bg = "#080808";
const bgCard = "rgba(255,255,255,0.035)";
const bgCardHover = "rgba(255,255,255,0.06)";
const border = "rgba(255,255,255,0.07)";
const borderGold = "rgba(201,169,110,0.3)";

/* ─── FONT IMPORT ─── */
const FontStyle = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    body { background: ${bg}; color: #e8e2d9; font-family: 'Manrope', sans-serif; }
    
    .serif { font-family: 'Cormorant Garamond', serif; }
    
    .gold { color: ${gold}; }
    
    .fade-up {
      opacity: 0;
      transform: translateY(32px);
      transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .fade-up.visible { opacity: 1; transform: translateY(0); }

    .stagger-1 { transition-delay: 0.1s !important; }
    .stagger-2 { transition-delay: 0.22s !important; }
    .stagger-3 { transition-delay: 0.34s !important; }
    .stagger-4 { transition-delay: 0.46s !important; }
    .stagger-5 { transition-delay: 0.58s !important; }

    .card-hover {
      transition: background 0.4s ease, border-color 0.4s ease, transform 0.4s ease;
    }
    .card-hover:hover {
      background: ${bgCardHover} !important;
      border-color: ${borderGold} !important;
      transform: translateY(-3px);
    }

    .btn-gold {
      background: ${gold};
      color: #0a0806;
      font-family: 'Manrope', sans-serif;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border: none;
      cursor: pointer;
      transition: background 0.3s ease, transform 0.2s ease;
    }
    .btn-gold:hover { background: ${goldLight}; transform: translateY(-1px); }
    
    .btn-outline {
      background: transparent;
      color: #e8e2d9;
      font-family: 'Manrope', sans-serif;
      font-weight: 500;
      font-size: 14px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border: 1px solid rgba(255,255,255,0.2);
      cursor: pointer;
      transition: border-color 0.3s ease, color 0.3s ease;
    }
    .btn-outline:hover { border-color: ${gold}; color: ${gold}; }

    nav a, nav button {
      background: none;
      border: none;
      font-family: 'Manrope', sans-serif;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: rgba(232,226,217,0.7);
      cursor: pointer;
      transition: color 0.3s ease;
      text-decoration: none;
    }
    nav a:hover, nav button:hover { color: ${gold}; }

    .divider-gold {
      width: 40px;
      height: 1px;
      background: ${gold};
      margin: 0 auto;
    }

    .hero-line {
      width: 1px;
      background: linear-gradient(to bottom, transparent, ${gold}, transparent);
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #0a0a0a; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }

    .whatsapp-btn {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 999;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #25D366;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
      box-shadow: 0 4px 24px rgba(37,211,102,0.25);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .whatsapp-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 32px rgba(37,211,102,0.35);
    }

    .service-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      border: 1px solid ${borderGold};
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      transition: background 0.3s;
    }
    .card-hover:hover .service-icon {
      background: rgba(201,169,110,0.08);
    }

    .tag {
      display: inline-block;
      font-family: 'Manrope', sans-serif;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: ${gold};
    }

    .price-tag {
      font-family: 'Cormorant Garamond', serif;
      font-size: 42px;
      font-weight: 500;
      color: #e8e2d9;
      line-height: 1;
    }

    .fleet-card {
      border: 1px solid ${border};
      border-radius: 24px;
      padding: 40px;
      background: ${bgCard};
      backdrop-filter: blur(20px);
      transition: border-color 0.4s ease, transform 0.4s ease;
    }
    .fleet-card:hover {
      border-color: ${borderGold};
      transform: translateY(-4px);
    }

    .contact-card {
      border: 1px solid ${border};
      border-radius: 20px;
      padding: 32px;
      background: ${bgCard};
      transition: border-color 0.4s, transform 0.3s;
    }
    .contact-card:hover {
      border-color: ${borderGold};
      transform: translateY(-2px);
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .float { animation: float 6s ease-in-out infinite; }

    @keyframes shimmer {
      0% { opacity: 0.4; }
      50% { opacity: 0.7; }
      100% { opacity: 0.4; }
    }
    .shimmer { animation: shimmer 3s ease-in-out infinite; }

    /* PAGE TRANSITIONS */
    .page { min-height: 100vh; }
  `}</style>
);


/* ─── INTERSECTION OBSERVER HOOK ─── */
function useFadeUp(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── NAVBAR ─── */
function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100,
      padding: "0 48px",
      background: scrolled ? "rgba(8,8,8,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? `1px solid ${border}` : "1px solid transparent",
      transition: "all 0.5s ease",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: "80px",
    }}>
      <button
        onClick={() => setPage("home")}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Manrope', sans-serif", fontWeight: 300,
          fontSize: "18px", letterSpacing: "6px", color: "#e8e2d9",
          textTransform: "uppercase",
        }}
      >
        PIONEER
        <span style={{ color: gold, marginLeft: 6 }}>TRAVELS</span>
      </button>

      <nav style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        <button onClick={() => setPage("services")}>Services</button>
        <button onClick={() => setPage("fleet")}>Fleet</button>
        <button onClick={() => setPage("contact")} className="btn-gold"
          style={{ padding: "10px 24px", borderRadius: "100px" }}>
          Book Now
        </button>
      </nav>
    </header>
  );
}

/* ─── WHATSAPP ─── */
function WhatsApp() {
  return (
    <a href="https://wa.me/919872130111" target="_blank" rel="noopener noreferrer">
      <button className="whatsapp-btn" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 32 32" width="26" height="26" fill="white">
          <path d="M19.11 17.21c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.15-.19.29-.74.94-.91 1.13-.17.19-.33.22-.62.07-.29-.14-1.22-.45-2.32-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.13-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.44 0 1.44 1.04 2.82 1.19 3.02.14.19 2.04 3.11 4.95 4.36.69.3 1.24.47 1.66.6.7.22 1.34.19 1.84.11.56-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.11-.26-.18-.55-.33z"/>
          <path d="M16.01 3C8.83 3 3 8.83 3 16c0 2.53.74 5 2.13 7.11L3 29l6.08-2.07A12.93 12.93 0 0016.01 29C23.18 29 29 23.17 29 16S23.18 3 16.01 3zm0 23.67c-2.07 0-4.09-.56-5.85-1.62l-.42-.25-3.61 1.23 1.18-3.52-.27-.44A10.61 10.61 0 015.33 16c0-5.88 4.79-10.67 10.68-10.67 2.85 0 5.52 1.11 7.53 3.12A10.57 10.57 0 0126.67 16c0 5.89-4.79 10.67-10.66 10.67z"/>
        </svg>
      </button>
    </a>
  );
}

/* ─── HOME PAGE ─── */
function HomePage({ setPage }) {
  const heroRef = useRef(null);
  const section2Ref = useFadeUp();
  const section3Ref = useFadeUp();
  const section4Ref = useFadeUp();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    setTimeout(() => el.classList.add("visible"), 100);
  }, []);

  const services = [
    { icon: "✈", title: "Airport Transfers", desc: "Precision pickup and drop with real-time flight tracking. Never wait, never rush." },
    { icon: "→", title: "One Way Drop", desc: "Efficient one-way intercity transfers with fixed transparent pricing." },
    { icon: "◎", title: "Outstation Cabs", desc: "Long-distance travel in supreme comfort across North India." },
    { icon: "◆", title: "Event Transportation", desc: "Dedicated fleet coordination for corporate events and private occasions." },
    { icon: "⬡", title: "Local Taxi Services", desc: "On-demand city rides with professional chauffeurs at your service." },
  ];

  return (
    <div className="page">
      {/* HERO */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        overflow: "hidden",
      }}>
        {/* BG IMAGE */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.25)",
        }} />
        {/* GRADIENT */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(8,8,8,0.9) 40%, rgba(8,8,8,0.6) 100%)",
        }} />
        {/* GOLD ORB */}
        <div className="shimmer" style={{
          position: "absolute", top: "-100px", right: "-80px",
          width: "500px", height: "500px", borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div style={{
          position: "relative", zIndex: 2,
          maxWidth: "1200px", margin: "0 auto", padding: "0 48px",
          paddingTop: "80px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px",
          alignItems: "center", width: "100%",
        }}>
          {/* LEFT */}
          <div ref={heroRef} className="fade-up">
            <div className="tag" style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "24px", height: "1px", background: gold }} />
              Chandigarh · Delhi · Pan India
            </div>

            <h1 className="serif" style={{
              fontSize: "clamp(52px, 6vw, 80px)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-1px",
              color: "#f5ede0",
              marginBottom: "28px",
            }}>
              Executive<br />
              <span style={{ fontStyle: "italic", color: gold }}>Mobility</span><br />
              Redefined
            </h1>

            <p style={{
              fontSize: "16px", lineHeight: "1.8",
              color: "rgba(232,226,217,0.6)", maxWidth: "420px",
              marginBottom: "48px", fontWeight: 300,
            }}>
              Premium chauffeur services across North India — from airport transfers
              to long-distance executive travel, delivered with precision and elegance.
            </p>

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <button className="btn-gold" style={{ padding: "16px 36px", borderRadius: "100px" }}
                onClick={() => setPage("contact")}>
                Reserve a Ride
              </button>
              <button className="btn-outline" style={{ padding: "16px 36px", borderRadius: "100px" }}
                onClick={() => setPage("fleet")}>
                View Fleet
              </button>
            </div>

            <div style={{
              display: "flex", gap: "40px", marginTop: "56px",
              paddingTop: "40px", borderTop: `1px solid ${border}`,
            }}>
              {[ ["25+", "Years Experience"], ["24/7", "Available"], ["100%", "Professional"] ].map(([n, l]) => (
                <div key={l}>
                  <div className="serif" style={{ fontSize: "32px", fontWeight: 500, color: gold, lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: "12px", color: "rgba(232,226,217,0.5)", marginTop: "6px", letterSpacing: "0.5px" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — GLASS CARD */}
          <div ref={heroRef} className="fade-up stagger-2 float" style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${border}`,
            borderRadius: "28px",
            padding: "40px",
            backdropFilter: "blur(40px)",
          }}>
            <h3 className="serif" style={{
              fontSize: "28px", fontWeight: 400,
              color: gold, marginBottom: "32px",
            }}>
              Our Services
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                "Airport Pickup & Drop",
                "One Way Drop Services",
                "Outstation Cabs",
                "Event Transportation",
                "Local Taxi Services",
              ].map((s, i) => (
                <div key={s} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "18px 0",
                  borderBottom: i < 4 ? `1px solid ${border}` : "none",
                }}>
                  <span style={{ fontSize: "16px", color: "#e8e2d9", fontWeight: 300 }}>{s}</span>
                  <span style={{ color: gold, fontSize: "18px" }}>→</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
              <a href="tel:+919872130111" style={{ textDecoration: "none", flex: 1 }}>
                <button className="btn-gold" style={{
                  width: "100%", padding: "14px",
                  borderRadius: "12px", fontSize: "13px",
                }}>
                  +91 98721 30111
                </button>
              </a>
              <a href="tel:+919814100111" style={{ textDecoration: "none", flex: 1 }}>
                <button className="btn-outline" style={{
                  width: "100%", padding: "14px",
                  borderRadius: "12px", fontSize: "13px",
                }}>
                  +91 98141 00111
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* SCROLL INDICATOR */}
        <div style={{
          position: "absolute", bottom: "40px", left: "50%",
          transform: "translateX(-50%)", zIndex: 2,
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        }}>
          <div style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(232,226,217,0.3)", textTransform: "uppercase" }}>Scroll</div>
          <div className="hero-line" style={{ height: "40px" }} />
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "120px 48px" }}>
        <div ref={section2Ref} className="fade-up">
          <div style={{ textAlign: "center", marginBottom: "72px" }}>
            <div className="tag" style={{ marginBottom: "16px" }}>What We Offer</div>
            <div className="divider-gold" style={{ marginBottom: "24px", marginTop: "16px" }} />
            <h2 className="serif" style={{
              fontSize: "clamp(40px, 5vw, 60px)",
              fontWeight: 400, lineHeight: 1.1, color: "#f5ede0",
            }}>
              Tailored for Every Journey
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}>
            {services.map((s, i) => (
              <div
                key={s.title}
                className="card-hover"
                style={{
                  padding: "36px 28px",
                  background: bgCard,
                  border: `1px solid ${border}`,
                  borderRadius: "20px",
                  backdropFilter: "blur(20px)",
                  cursor: "default",
                }}
              >
                <div className="service-icon">
                  <span style={{ fontSize: "20px", color: gold }}>{s.icon}</span>
                </div>
                <h3 className="serif" style={{
                  fontSize: "22px", fontWeight: 500,
                  color: "#f5ede0", marginBottom: "12px", lineHeight: 1.2,
                }}>{s.title}</h3>
                <p style={{
                  fontSize: "14px", lineHeight: "1.7",
                  color: "rgba(232,226,217,0.5)", fontWeight: 300,
                }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RATES SECTION */}
      <section style={{
        background: "rgba(201,169,110,0.03)",
        borderTop: `1px solid ${border}`,
        borderBottom: `1px solid ${border}`,
        padding: "120px 48px",
      }}>
        <div ref={section3Ref} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "72px" }}>
            <div className="tag" style={{ marginBottom: "16px" }}>Transparent Pricing</div>
            <div className="divider-gold" style={{ marginBottom: "24px", marginTop: "16px" }} />
            <h2 className="serif" style={{
              fontSize: "clamp(36px, 4vw, 54px)",
              fontWeight: 400, color: "#f5ede0", marginBottom: "16px",
            }}>
              Chandigarh ↔ Delhi
            </h2>
            <p style={{ color: "rgba(232,226,217,0.5)", fontSize: "15px" }}>One-way executive rates. No hidden charges.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
            {/* SEDAN */}
            <div className="fleet-card">
              <div className="tag" style={{ marginBottom: "20px" }}>Executive Sedan</div>
              <h3 className="serif" style={{ fontSize: "36px", fontWeight: 400, color: "#f5ede0", marginBottom: "8px" }}>
                Etios · Aura · Dzire
              </h3>
              <p style={{ color: "rgba(232,226,217,0.4)", fontSize: "13px", marginBottom: "36px" }}>4 passengers · Comfortable & reliable</p>
              <div style={{ borderTop: `1px solid ${border}`, paddingTop: "28px", display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span className="price-tag">₹3,499</span>
                <span style={{ color: "rgba(232,226,217,0.4)", fontSize: "14px" }}>onwards</span>
              </div>
            </div>

            {/* SUV */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="fleet-card">
                <div className="tag" style={{ marginBottom: "16px" }}>SUV / MPV</div>
                <h3 className="serif" style={{ fontSize: "28px", fontWeight: 400, color: "#f5ede0", marginBottom: "4px" }}>
                  Toyota Innova Crysta
                </h3>
                <p style={{ color: "rgba(232,226,217,0.4)", fontSize: "13px", marginBottom: "24px" }}>7 passengers · Premium spacious</p>
                <div style={{ borderTop: `1px solid ${border}`, paddingTop: "20px", display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span className="price-tag" style={{ fontSize: "32px" }}>₹5,499</span>
                  <span style={{ color: "rgba(232,226,217,0.4)", fontSize: "13px" }}>onwards</span>
                </div>
              </div>
              <div className="fleet-card">
                <div className="tag" style={{ marginBottom: "16px" }}>SUV / MPV</div>
                <h3 className="serif" style={{ fontSize: "28px", fontWeight: 400, color: "#f5ede0", marginBottom: "4px" }}>
                  Ertiga / Rumion
                </h3>
                <p style={{ color: "rgba(232,226,217,0.4)", fontSize: "13px", marginBottom: "24px" }}>6 passengers · Versatile family SUV</p>
                <div style={{ borderTop: `1px solid ${border}`, paddingTop: "20px", display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span className="price-tag" style={{ fontSize: "32px" }}>₹4,499</span>
                  <span style={{ color: "rgba(232,226,217,0.4)", fontSize: "13px" }}>onwards</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "120px 48px", textAlign: "center" }}>
        <div ref={section4Ref} className="fade-up">
          <div className="tag" style={{ marginBottom: "20px" }}>Ready to Travel?</div>
          <h2 className="serif" style={{
            fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: 400, lineHeight: 1.05,
            color: "#f5ede0", marginBottom: "24px",
          }}>
            Experience the Difference<br />
            <span style={{ fontStyle: "italic", color: gold }}>Firsthand</span>
          </h2>
          <p style={{
            color: "rgba(232,226,217,0.5)", fontSize: "16px",
            lineHeight: "1.8", marginBottom: "48px", fontWeight: 300,
          }}>
            Call us directly for instant booking. Available 24/7 for all your travel needs.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:+919872130111" style={{ textDecoration: "none" }}>
              <button className="btn-gold" style={{ padding: "18px 48px", borderRadius: "100px" }}>
                Call +91 98721 30111
              </button>
            </a>
            <a href="https://wa.me/919872130111" style={{ textDecoration: "none" }}>
              <button className="btn-outline" style={{ padding: "18px 48px", borderRadius: "100px" }}>
                WhatsApp Us
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── SERVICES PAGE ─── */
function ServicesPage() {
  const ref1 = useFadeUp();
  const ref2 = useFadeUp();
  const ref3 = useFadeUp();

  const categories = [
    {
      title: "City to City",
      subtitle: "Intercity executive transfers between major cities across North India.",
      items: ["Executive Sedan — Toyota Etios, Maruti Dzire, Hyundai Aura", "Executive SUV / MPV — Innova Crysta, Ertiga, Rumion", "Luxury Fleet — Mercedes, BMW, Audi"],
    },
    {
      title: "Intra City",
      subtitle: "Premium local rides within Chandigarh and Delhi NCR.",
      items: ["Executive Sedan", "Executive SUV / MPV", "Luxury Fleet"],
    },
    {
      title: "Airport Transfers",
      subtitle: "Seamless pickup and drop at all major airports with flight tracking.",
      items: ["Executive Sedan", "Executive SUV / MPV", "Luxury Fleet"],
    },
  ];

  return (
    <div className="page" style={{ paddingTop: "80px" }}>
      {/* HERO */}
      <section style={{
        padding: "100px 48px 80px",
        textAlign: "center",
        background: `linear-gradient(180deg, rgba(201,169,110,0.05) 0%, transparent 100%)`,
        borderBottom: `1px solid ${border}`,
      }}>
        <div ref={ref1} className="fade-up">
          <div className="tag" style={{ marginBottom: "16px" }}>Pioneer Travels</div>
          <div className="divider-gold" style={{ margin: "16px auto 28px" }} />
          <h1 className="serif" style={{
            fontSize: "clamp(48px, 6vw, 72px)",
            fontWeight: 400, color: "#f5ede0",
            lineHeight: 1.05, marginBottom: "20px",
          }}>
            Our Services
          </h1>
          <p style={{ color: "rgba(232,226,217,0.5)", fontSize: "16px", maxWidth: "560px", margin: "0 auto", fontWeight: 300, lineHeight: 1.8 }}>
            A complete suite of executive and premium mobility solutions for every occasion.
          </p>
        </div>
      </section>

      {/* SERVICE CATEGORIES */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 48px" }}>
        <div ref={ref2} className="fade-up">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
            {categories.map((cat, i) => (
              <div key={cat.title} className="card-hover" style={{
                padding: "44px 36px",
                background: bgCard,
                border: `1px solid ${border}`,
                borderRadius: "24px",
                backdropFilter: "blur(20px)",
              }}>
                <div style={{
                  width: "36px", height: "1px",
                  background: gold, marginBottom: "28px",
                }} />
                <h2 className="serif" style={{
                  fontSize: "34px", fontWeight: 400,
                  color: gold, marginBottom: "12px",
                }}>{cat.title}</h2>
                <p style={{
                  fontSize: "14px", color: "rgba(232,226,217,0.5)",
                  marginBottom: "32px", lineHeight: "1.7", fontWeight: 300,
                }}>{cat.subtitle}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                  {cat.items.map((item, j) => (
                    <div key={j} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "14px 0",
                      borderBottom: j < cat.items.length - 1 ? `1px solid ${border}` : "none",
                    }}>
                      <span style={{ color: gold, fontSize: "10px" }}>◆</span>
                      <span style={{ fontSize: "14px", color: "#e8e2d9", fontWeight: 300 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section style={{
        background: "rgba(201,169,110,0.03)",
        borderTop: `1px solid ${border}`,
        padding: "80px 48px",
      }}>
        <div ref={ref3} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2px", border: `1px solid ${border}`, borderRadius: "20px", overflow: "hidden" }}>
            {[
              ["25+", "Years of Service"],
              ["24/7", "Availability"],
              ["Professional", "Chauffeurs"],
              ["Fixed", "Transparent Rates"],
            ].map(([n, l], i) => (
              <div key={l} style={{
                padding: "48px 32px", textAlign: "center",
                background: bgCard,
                borderRight: i < 3 ? `1px solid ${border}` : "none",
              }}>
                <div className="serif" style={{ fontSize: "48px", fontWeight: 400, color: gold, lineHeight: 1, marginBottom: "10px" }}>{n}</div>
                <div style={{ fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(232,226,217,0.4)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── FLEET PAGE ─── */
function FleetPage() {
  const ref1 = useFadeUp();
  const ref2 = useFadeUp();
  const ref3 = useFadeUp();

  const executive = [
    { name: "Toyota Etios", tag: "Sedan", spec: "4 passengers" },
    { name: "Maruti Dzire", tag: "Sedan", spec: "4 passengers" },
    { name: "Hyundai Aura", tag: "Sedan", spec: "4 passengers" },
    { name: "Honda Amaze", tag: "Sedan", spec: "4 passengers" },
    { name: "Traveller", tag: "Van", spec: "12+ passengers" },
    { name: "Bus", tag: "Coach", spec: "Group travel" },
  ];

  const suv = [
    { name: "Toyota Innova Crysta", tag: "SUV", spec: "7 passengers" },
    { name: "Maruti Ertiga", tag: "MPV", spec: "6 passengers" },
    { name: "Toyota Rumion", tag: "MPV", spec: "6 passengers" },
    { name: "Kia Carens", tag: "MPV", spec: "6 passengers" },
  ];

  const luxury = [
    { name: "Mercedes E-Class", tag: "Luxury Sedan", spec: "Premium executive" },
    { name: "BMW 5 Series", tag: "Luxury Sedan", spec: "Premium executive" },
    { name: "Audi A6", tag: "Luxury Sedan", spec: "Premium executive" },
    { name: "Toyota Camry", tag: "Luxury Sedan", spec: "Business class" },
    { name: "Toyota Fortuner", tag: "Luxury SUV", spec: "7 passengers" },
    { name: "Range Rover", tag: "Luxury SUV", spec: "Ultra premium" },
    { name: "MG Gloster", tag: "Luxury SUV", spec: "7 passengers" },
  ];

  const VehicleCard = ({ name, tag, spec }) => (
    <div className="card-hover" style={{
      padding: "28px", background: bgCard,
      border: `1px solid ${border}`, borderRadius: "16px",
    }}>
      <div style={{
        fontSize: "10px", fontWeight: 600, letterSpacing: "2px",
        textTransform: "uppercase", color: gold, marginBottom: "12px",
      }}>{tag}</div>
      <h4 className="serif" style={{
        fontSize: "22px", fontWeight: 400, color: "#f5ede0", marginBottom: "6px",
      }}>{name}</h4>
      <p style={{ fontSize: "13px", color: "rgba(232,226,217,0.4)", fontWeight: 300 }}>{spec}</p>
    </div>
  );

  const FleetSection = ({ label, title, vehicles, innerRef }) => (
    <section style={{ padding: "80px 48px" }}>
      <div ref={innerRef} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "56px" }}>
          <div>
            <div className="tag" style={{ marginBottom: "8px" }}>{label}</div>
            <h2 className="serif" style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, color: "#f5ede0" }}>{title}</h2>
          </div>
          <div style={{ flex: 1, height: "1px", background: border }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
          {vehicles.map(v => <VehicleCard key={v.name} {...v} />)}
        </div>
      </div>
    </section>
  );

  return (
    <div className="page" style={{ paddingTop: "80px" }}>
      <section style={{
        padding: "100px 48px 80px", textAlign: "center",
        background: `linear-gradient(180deg, rgba(201,169,110,0.05) 0%, transparent 100%)`,
        borderBottom: `1px solid ${border}`,
      }}>
        <div ref={ref1} className="fade-up">
          <div className="tag" style={{ marginBottom: "16px" }}>Pioneer Travels</div>
          <div className="divider-gold" style={{ margin: "16px auto 28px" }} />
          <h1 className="serif" style={{ fontSize: "clamp(48px, 6vw, 72px)", fontWeight: 400, color: "#f5ede0", marginBottom: "20px" }}>
            Our Fleet
          </h1>
          <p style={{ color: "rgba(232,226,217,0.5)", fontSize: "16px", maxWidth: "500px", margin: "0 auto", fontWeight: 300, lineHeight: 1.8 }}>
            A curated collection of executive and luxury vehicles for every occasion and requirement.
          </p>
        </div>
      </section>

      <FleetSection label="Fleet Category" title="Executive Fleet" vehicles={executive} innerRef={ref2} />

      <div style={{ height: "1px", background: border, maxWidth: "1200px", margin: "0 auto 0 auto", padding: "0 48px" }}>
        <div style={{ height: "1px", background: border }} />
      </div>

      <FleetSection label="Premium Category" title="SUV / MPV Fleet" vehicles={suv} innerRef={ref3} />

      <section style={{
        padding: "80px 48px 100px",
        background: "rgba(201,169,110,0.03)",
        borderTop: `1px solid ${border}`,
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "56px" }}>
            <div>
              <div className="tag" style={{ marginBottom: "8px" }}>Premium Collection</div>
              <h2 className="serif" style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 400, color: "#f5ede0" }}>Luxury Fleet</h2>
            </div>
            <div style={{ flex: 1, height: "1px", background: border }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "56px" }}>
            {luxury.map(v => <VehicleCard key={v.name} {...v} />)}
          </div>
          <div style={{ textAlign: "center", padding: "48px", border: `1px solid ${borderGold}`, borderRadius: "20px", background: "rgba(201,169,110,0.04)" }}>
            <p className="serif" style={{ fontSize: "24px", color: "#f5ede0", marginBottom: "8px", fontStyle: "italic" }}>
              Additional vehicles available on request
            </p>
            <p style={{ color: "rgba(232,226,217,0.4)", fontSize: "14px", marginBottom: "28px", fontWeight: 300 }}>
              Based on availability and travel requirements
            </p>
            <a href="tel:+919872130111" style={{ textDecoration: "none" }}>
              <button className="btn-gold" style={{ padding: "14px 40px", borderRadius: "100px" }}>
                Contact for Fleet Booking
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── CONTACT PAGE ─── */
function ContactPage() {
  const ref1 = useFadeUp();
  const ref2 = useFadeUp();

  return (
    <div className="page" style={{ paddingTop: "80px" }}>
      <section style={{
        padding: "100px 48px 80px", textAlign: "center",
        background: `linear-gradient(180deg, rgba(201,169,110,0.05) 0%, transparent 100%)`,
        borderBottom: `1px solid ${border}`,
      }}>
        <div ref={ref1} className="fade-up">
          <div className="tag" style={{ marginBottom: "16px" }}>Get In Touch</div>
          <div className="divider-gold" style={{ margin: "16px auto 28px" }} />
          <h1 className="serif" style={{
            fontSize: "clamp(48px, 6vw, 72px)",
            fontWeight: 400, color: "#f5ede0", marginBottom: "20px",
          }}>
            Contact Us
          </h1>
          <p style={{ color: "rgba(232,226,217,0.5)", fontSize: "16px", maxWidth: "480px", margin: "0 auto", fontWeight: 300, lineHeight: 1.8 }}>
            Available 24/7. Reach us by call, WhatsApp, or email for instant booking and support.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 48px" }}>
        <div ref={ref2} className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* CALL CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <a href="tel:+919872130111" style={{ textDecoration: "none" }}>
              <div className="contact-card" style={{ cursor: "pointer" }}>
                <div style={{ fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: gold, marginBottom: "16px" }}>Primary</div>
                <h3 className="serif" style={{ fontSize: "30px", fontWeight: 400, color: "#f5ede0", marginBottom: "6px" }}>+91 98721 30111</h3>
                <p style={{ fontSize: "13px", color: "rgba(232,226,217,0.4)" }}>Tap to call directly</p>
                <div style={{ marginTop: "24px" }}>
                  <span className="btn-gold" style={{
                    display: "inline-block", padding: "10px 24px",
                    borderRadius: "100px", fontSize: "12px",
                  }}>Call Now</span>
                </div>
              </div>
            </a>

            <a href="tel:+919917600079" style={{ textDecoration: "none" }}>
              <div className="contact-card" style={{ cursor: "pointer" }}>
                <div style={{ fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: gold, marginBottom: "16px" }}>Alternate</div>
                <h3 className="serif" style={{ fontSize: "30px", fontWeight: 400, color: "#f5ede0", marginBottom: "6px" }}>+91 99176 00079</h3>
                <p style={{ fontSize: "13px", color: "rgba(232,226,217,0.4)" }}>Tap to call directly</p>
                <div style={{ marginTop: "24px" }}>
                  <span className="btn-outline" style={{
                    display: "inline-block", padding: "10px 24px",
                    borderRadius: "100px", fontSize: "12px",
                  }}>Call Now</span>
                </div>
              </div>
            </a>
          </div>

          {/* WHATSAPP + EMAIL */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <a href="https://wa.me/919872130111" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <div className="contact-card" style={{ cursor: "pointer", borderColor: "rgba(37,211,102,0.2)" }}>
                <div style={{ fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: "#25D366", marginBottom: "16px" }}>WhatsApp</div>
                <h3 className="serif" style={{ fontSize: "26px", fontWeight: 400, color: "#f5ede0", marginBottom: "6px" }}>+91 98721 30111</h3>
                <p style={{ fontSize: "13px", color: "rgba(232,226,217,0.4)" }}>Chat with us anytime</p>
              </div>
            </a>

            <div className="contact-card">
              <div style={{ fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: gold, marginBottom: "16px" }}>Email</div>
              <h3 className="serif" style={{ fontSize: "20px", fontWeight: 400, color: "#f5ede0", marginBottom: "6px" }}>info@pioneertravels.com</h3>
              <p style={{ fontSize: "13px", color: "rgba(232,226,217,0.4)" }}>Response within 24 hours</p>
            </div>
          </div>

          {/* INFO */}
          <div className="contact-card" style={{ textAlign: "center", padding: "48px" }}>
            <p className="serif" style={{ fontSize: "22px", color: "#f5ede0", fontStyle: "italic", marginBottom: "10px" }}>
              Pioneer Travels
            </p>
            <p style={{ color: "rgba(232,226,217,0.4)", fontSize: "14px", lineHeight: "1.8" }}>
              Available 24 hours · 7 days a week<br />
              Chandigarh · Delhi · Pan North India
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── FOOTER ─── */
function Footer({ setPage }) {
  return (
    <footer style={{
      borderTop: `1px solid ${border}`,
      padding: "60px 48px 40px",
      background: "#050505",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "48px", flexWrap: "wrap", gap: "32px" }}>
          <div>
            <div style={{
              fontFamily: "'Manrope', sans-serif", fontWeight: 300,
              fontSize: "18px", letterSpacing: "5px", color: "#e8e2d9",
              textTransform: "uppercase", marginBottom: "12px",
            }}>
              PIONEER <span style={{ color: gold }}>TRAVELS</span>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(232,226,217,0.35)", lineHeight: "1.7", maxWidth: "280px", fontWeight: 300 }}>
              Executive mobility solutions across North India with over 25 years of trusted service.
            </p>
          </div>

          <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: gold, marginBottom: "20px" }}>Navigate</div>
              {["home", "services", "fleet", "contact"].map(p => (
                <div key={p} style={{ marginBottom: "12px" }}>
                  <button onClick={() => setPage(p)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'Manrope', sans-serif",
                    fontSize: "14px", color: "rgba(232,226,217,0.5)",
                    textTransform: "capitalize", fontWeight: 300,
                    transition: "color 0.3s",
                  }}
                    onMouseEnter={e => e.target.style.color = gold}
                    onMouseLeave={e => e.target.style.color = "rgba(232,226,217,0.5)"}
                  >{p}</button>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: gold, marginBottom: "20px" }}>Contact</div>
              {["+91 98721 30111", "+91 99176 00079", "info@pioneertravels.com"].map(c => (
                <div key={c} style={{ marginBottom: "12px", fontSize: "14px", color: "rgba(232,226,217,0.5)", fontWeight: 300 }}>{c}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: `1px solid ${border}`, paddingTop: "24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "12px",
        }}>
          <p style={{ fontSize: "12px", color: "rgba(232,226,217,0.25)", fontWeight: 300 }}>
            © {new Date().getFullYear()} Pioneer Travels. All rights reserved.
          </p>
          <p style={{ fontSize: "12px", color: "rgba(232,226,217,0.25)", fontWeight: 300 }}>
            Chandigarh · Delhi · Pan North India
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── ROOT APP ─── */
export default function PioneerTravels() {
  const [page, setPage] = useState("home");
  const topRef = useRef(null);

  const navigate = (p) => {
    setPage(p);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div ref={topRef} style={{ background: bg, minHeight: "100vh", color: "#e8e2d9" }}>
      <FontStyle />
      <Navbar page={page} setPage={navigate} />

      {page === "home" && <HomePage setPage={navigate} />}
      {page === "services" && <ServicesPage />}
      {page === "fleet" && <FleetPage />}
      {page === "contact" && <ContactPage />}

      <Footer setPage={navigate} />
      <WhatsApp />
    </div>
  );
}
