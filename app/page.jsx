"use client";
import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─── */
const gold = "#C9A96E";
const goldLight = "#E2C97E";
const bg = "#080808";
const bgCard = "rgba(255,255,255,0.035)";
const bgCardHover = "rgba(255,255,255,0.06)";
const border = "rgba(255,255,255,0.07)";
const borderGold = "rgba(201,169,110,0.3)";

/* ─── FONT + GLOBAL STYLES ─── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Manrope:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { overflow-x: hidden; }
    body { background: ${bg}; color: #e8e2d9; font-family: 'Manrope', sans-serif; overflow-x: hidden; -webkit-text-size-adjust: 100%; }

    .serif { font-family: 'Cormorant Garamond', serif; }

    /* ── FADE-UP ANIMATION ── */
    .fade-up {
      opacity: 0; transform: translateY(28px);
      transition: opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1);
    }
    .fade-up.visible { opacity: 1; transform: translateY(0); }
    .stagger-1 { transition-delay: 0.1s !important; }
    .stagger-2 { transition-delay: 0.2s !important; }
    .stagger-3 { transition-delay: 0.3s !important; }
    .stagger-4 { transition-delay: 0.4s !important; }

    /* ── CARD HOVER ── */
    .card-hover { transition: background 0.4s ease, border-color 0.4s ease, transform 0.35s ease; }
    .card-hover:hover { background: ${bgCardHover} !important; border-color: ${borderGold} !important; transform: translateY(-3px); }

    /* ── BUTTONS ── */
    .btn-gold {
      background: ${gold}; color: #0a0806;
      font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px;
      letter-spacing: 1.5px; text-transform: uppercase;
      border: none; cursor: pointer; display: inline-block;
      transition: background 0.3s ease, transform 0.2s ease;
    }
    .btn-gold:hover { background: ${goldLight}; transform: translateY(-1px); }

    .btn-outline {
      background: transparent; color: #e8e2d9;
      font-family: 'Manrope', sans-serif; font-weight: 500; font-size: 13px;
      letter-spacing: 1.5px; text-transform: uppercase;
      border: 1px solid rgba(255,255,255,0.18); cursor: pointer; display: inline-block;
      transition: border-color 0.3s ease, color 0.3s ease;
    }
    .btn-outline:hover { border-color: ${gold}; color: ${gold}; }

    /* ── NAV LINKS ── */
    .nav-link {
      background: none; border: none;
      font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 500;
      letter-spacing: 1.5px; text-transform: uppercase;
      color: rgba(232,226,217,0.65); cursor: pointer;
      transition: color 0.3s ease; padding: 0; text-decoration: none;
      white-space: nowrap;
    }
    .nav-link:hover { color: ${gold}; }

    /* ── HAMBURGER ── */
    .hamburger { display: none; }
    @media (max-width: 768px) {
      .hamburger { display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; z-index: 200; }
      .hamburger span { display: block; width: 22px; height: 1.5px; background: #e8e2d9; transition: all 0.3s ease; }
      .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
      .hamburger.open span:nth-child(2) { opacity: 0; }
      .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
      .desktop-nav { display: none !important; }
    }

    /* ── MOBILE MENU ── */
    .mobile-menu {
      position: fixed; inset: 0; z-index: 150;
      background: rgba(8,8,8,0.97); backdrop-filter: blur(24px);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 40px; opacity: 0; pointer-events: none;
      transition: opacity 0.35s ease;
    }
    .mobile-menu.open { opacity: 1; pointer-events: all; }
    .mobile-menu button {
      background: none; border: none; cursor: pointer;
      font-family: 'Cormorant Garamond', serif; font-size: 40px; font-weight: 400;
      color: #e8e2d9; letter-spacing: 1px;
      transition: color 0.3s ease;
    }
    .mobile-menu button:hover { color: ${gold}; }

    /* ── MISC ── */
    .tag {
      display: inline-block; font-family: 'Manrope', sans-serif;
      font-size: 10px; font-weight: 600; letter-spacing: 3px;
      text-transform: uppercase; color: ${gold};
    }
    .divider-gold { width: 36px; height: 1px; background: ${gold}; margin: 0 auto; }
    .price-tag { font-family: 'Cormorant Garamond', serif; font-size: 40px; font-weight: 500; color: #e8e2d9; line-height: 1; }

    /* ── WHATSAPP ── */
    .whatsapp-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 300;
      width: 50px; height: 50px; border-radius: 50%; background: #25D366;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; border: none;
      box-shadow: 0 4px 20px rgba(37,211,102,0.28);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .whatsapp-btn:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(37,211,102,0.4); }

    /* ── STAR RATING ── */
    .star { cursor: pointer; font-size: 22px; transition: color 0.2s; color: rgba(201,169,110,0.3); }
    .star.active { color: ${gold}; }
    .star:hover { color: ${goldLight}; }

    /* ── REVIEW FORM ── */
    .review-input {
      width: 100%; background: rgba(255,255,255,0.04);
      border: 1px solid ${border}; border-radius: 10px;
      padding: 14px 16px; color: #e8e2d9;
      font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 300;
      outline: none; transition: border-color 0.3s;
    }
    .review-input:focus { border-color: ${borderGold}; }
    .review-input::placeholder { color: rgba(232,226,217,0.3); }

    /* ── ONWARDS HOVER ── */
    .onwards-link { cursor: pointer; transition: color 0.3s ease; }
    .onwards-link:hover { color: ${gold} !important; }

    /* ── FLOAT ── */
    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .float { animation: float 6s ease-in-out infinite; }
    @keyframes shimmer { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
    .shimmer { animation: shimmer 3s ease-in-out infinite; }

    /* ── SCROLLBAR ── */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #0a0a0a; }
    ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }

    /* ── RESPONSIVE PADDING ── */
    .section-pad { padding: 90px 48px; }
    @media (max-width: 1024px) { .section-pad { padding: 70px 32px; } }
    @media (max-width: 768px)  { .section-pad { padding: 60px 20px; } }

    /* ── SERVICE GRID ── */
    .service-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }
    @media (max-width: 900px) { .service-grid { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 580px) { .service-grid { grid-template-columns: 1fr; } }

    /* ── HERO GRID ── */
    .hero-grid {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 60px; align-items: center;
    }
    @media (max-width: 900px) {
      .hero-grid { grid-template-columns: 1fr; gap: 40px; }
      .hero-right { display: none; }
    }

    /* ── RATES GRID ── */
    .rates-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media (max-width: 768px) { .rates-grid { grid-template-columns: 1fr; } }

    /* ── FLEET GRID ── */
    .fleet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
    @media (max-width: 480px) { .fleet-grid { grid-template-columns: 1fr 1fr; } }

    /* ── CONTACT GRID ── */
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    @media (max-width: 600px) { .contact-grid { grid-template-columns: 1fr; } }

    /* ── STATS ROW ── */
    .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); }
    @media (max-width: 600px) { .stats-grid { grid-template-columns: repeat(2,1fr); } }

    /* ── HERO STATS ── */
    .hero-stats { display: flex; gap: 40px; }
    @media (max-width: 480px) { .hero-stats { gap: 24px; } }

    /* ── REVIEWS GRID ── */
    .reviews-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
    @media (max-width: 900px) { .reviews-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 580px) { .reviews-grid { grid-template-columns: 1fr; } }

    /* ── SERVICES CAT GRID ── */
    .services-cat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
    @media (max-width: 900px) { .services-cat-grid { grid-template-columns: 1fr; } }

    /* ── FOOTER GRID ── */
    .footer-grid { display: flex; justify-content: space-between; align-items: flex-start; gap: 32px; flex-wrap: wrap; }
    .footer-links { display: flex; gap: 60px; flex-wrap: wrap; }
    @media (max-width: 600px) { .footer-links { gap: 32px; } }
  `}</style>
);

/* ─── INTERSECTION OBSERVER HOOK ─── */
function useFadeUp(threshold = 0.12) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── LOCAL STORAGE REVIEWS ─── */
const REVIEWS_KEY = "pioneer_reviews_v1";
function loadReviews() {
  try { return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || []; }
  catch { return []; }
}
function saveReviews(r) {
  try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(r)); } catch {}
}

/* ════════════════════════════════
   NAVBAR
════════════════════════════════ */
function Navbar({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // close menu on page change
  const go = (p) => { setPage(p); setMenuOpen(false); };

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100,
        padding: "0 32px",
        background: scrolled ? "rgba(8,8,8,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? `1px solid ${border}` : "1px solid transparent",
        transition: "all 0.5s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "70px",
      }}>
        {/* LOGO */}
        <button onClick={() => go("home")} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Manrope', sans-serif", fontWeight: 300,
          fontSize: "clamp(13px,3.5vw,17px)", letterSpacing: "5px",
          color: "#e8e2d9", textTransform: "uppercase", whiteSpace: "nowrap",
        }}>
          PIONEER <span style={{ color: gold }}>TRAVELS</span>
        </button>

        {/* DESKTOP NAV */}
        <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <button className="nav-link" onClick={() => go("services")}>Services</button>
          <button className="nav-link" onClick={() => go("fleet")}>Fleet</button>
          <button className="btn-gold nav-link" onClick={() => go("contact")}
            style={{ padding: "10px 22px", borderRadius: "100px", color: "#0a0806" }}>
            Book Now
          </button>
        </nav>

        {/* HAMBURGER */}
        <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </header>

      {/* MOBILE MENU OVERLAY */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {["home","services","fleet","contact"].map(p => (
          <button key={p} onClick={() => go(p)} style={{ textTransform: "capitalize" }}>
            {p === "contact" ? "Book Now" : p}
          </button>
        ))}
        <div style={{ marginTop: "16px", display: "flex", gap: "20px" }}>
          <a href="tel:+919872130111" style={{ textDecoration: "none" }}>
            <span className="btn-gold" style={{ padding: "12px 28px", borderRadius: "100px", fontSize: "13px" }}>
              Call Now
            </span>
          </a>
        </div>
      </div>
    </>
  );
}

/* ─── WHATSAPP ─── */
function WhatsApp() {
  return (
    <a href="https://wa.me/919872130111" target="_blank" rel="noopener noreferrer"
      style={{ textDecoration: "none" }}>
      <button className="whatsapp-btn" aria-label="WhatsApp">
        <svg viewBox="0 0 32 32" width="24" height="24" fill="white">
          <path d="M19.11 17.21c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.15-.19.29-.74.94-.91 1.13-.17.19-.33.22-.62.07-.29-.14-1.22-.45-2.32-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.13-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.44 0 1.44 1.04 2.82 1.19 3.02.14.19 2.04 3.11 4.95 4.36.69.3 1.24.47 1.66.6.7.22 1.34.19 1.84.11.56-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.11-.26-.18-.55-.33z"/>
          <path d="M16.01 3C8.83 3 3 8.83 3 16c0 2.53.74 5 2.13 7.11L3 29l6.08-2.07A12.93 12.93 0 0016.01 29C23.18 29 29 23.17 29 16S23.18 3 16.01 3zm0 23.67c-2.07 0-4.09-.56-5.85-1.62l-.42-.25-3.61 1.23 1.18-3.52-.27-.44A10.61 10.61 0 015.33 16c0-5.88 4.79-10.67 10.68-10.67 2.85 0 5.52 1.11 7.53 3.12A10.57 10.57 0 0126.67 16c0 5.89-4.79 10.67-10.66 10.67z"/>
        </svg>
      </button>
    </a>
  );
}

/* ─── STAR DISPLAY ─── */
function StarDisplay({ rating, size = 16 }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= rating ? gold : "rgba(201,169,110,0.2)" }}>★</span>
      ))}
    </div>
  );
}

/* ─── REVIEWS SECTION ─── */
function ReviewsSection() {
  const ref = useFadeUp();
  const formRef = useFadeUp();
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setReviews(loadReviews()); }, []);

  const topReviews = [...reviews].sort((a,b) => b.rating - a.rating).slice(0,3);

  const handleSubmit = () => {
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!rating) { setError("Please select a rating."); return; }
    if (!text.trim() || text.trim().length < 10) { setError("Please write at least 10 characters."); return; }
    const r = { id: Date.now(), name: name.trim(), rating, text: text.trim(), date: new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" }) };
    const updated = [r, ...reviews];
    setReviews(updated); saveReviews(updated);
    setName(""); setRating(0); setText(""); setError(""); setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section style={{ padding: "90px 48px", borderTop: `1px solid ${border}` }}
      className="section-pad">
      <div ref={ref} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <div className="tag" style={{ marginBottom: "14px" }}>Client Experiences</div>
          <div className="divider-gold" style={{ margin: "14px auto 24px" }} />
          <h2 className="serif" style={{ fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 400, color: "#f5ede0" }}>
            What Our Clients Say
          </h2>
        </div>

        {/* TOP 3 REVIEWS */}
        {topReviews.length > 0 && (
          <div className="reviews-grid" style={{ marginBottom: "60px" }}>
            {topReviews.map((r, i) => (
              <div key={r.id} className="card-hover" style={{
                padding: "32px 28px", background: bgCard,
                border: `1px solid ${border}`, borderRadius: "20px",
                backdropFilter: "blur(16px)",
              }}>
                <StarDisplay rating={r.rating} size={18} />
                <p className="serif" style={{
                  fontSize: "18px", fontStyle: "italic", color: "#e8e2d9",
                  lineHeight: "1.65", margin: "18px 0 20px", fontWeight: 300,
                }}>
                  "{r.text}"
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: gold, letterSpacing: "0.5px" }}>{r.name}</span>
                  <span style={{ fontSize: "11px", color: "rgba(232,226,217,0.3)" }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {topReviews.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "rgba(232,226,217,0.3)", marginBottom: "40px", fontSize: "15px" }}>
            Be the first to share your experience
          </div>
        )}

        {/* SUBMIT FORM */}
        <div ref={formRef} className="fade-up" style={{
          maxWidth: "600px", margin: "0 auto",
          background: bgCard, border: `1px solid ${border}`,
          borderRadius: "24px", padding: "40px 36px",
          backdropFilter: "blur(20px)",
        }}>
          <h3 className="serif" style={{ fontSize: "26px", fontWeight: 400, color: gold, marginBottom: "28px" }}>
            Share Your Experience
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input
              className="review-input"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={50}
            />

            <div>
              <div style={{ fontSize: "12px", color: "rgba(232,226,217,0.4)", marginBottom: "10px", letterSpacing: "1px", textTransform: "uppercase" }}>
                Your Rating
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={`star ${(hover || rating) >= i ? "active" : ""}`}
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}>★</span>
                ))}
              </div>
            </div>

            <textarea
              className="review-input"
              placeholder="Tell us about your journey..."
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              maxLength={400}
              style={{ resize: "none" }}
            />

            {error && <p style={{ fontSize: "13px", color: "#e87070", fontWeight: 300 }}>{error}</p>}
            {submitted && <p style={{ fontSize: "13px", color: "#70e8a0", fontWeight: 300 }}>Thank you — your review has been submitted.</p>}

            <button className="btn-gold" onClick={handleSubmit}
              style={{ padding: "14px 32px", borderRadius: "100px", fontSize: "13px", width: "fit-content" }}>
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════
   HOME PAGE
════════════════════════════════ */
function HomePage({ setPage }) {
  const heroRef = useRef(null);
  const s2 = useFadeUp(); const s3 = useFadeUp(); const s4 = useFadeUp();

  useEffect(() => {
    const el = heroRef.current; if (!el) return;
    setTimeout(() => el.classList.add("visible"), 120);
  }, []);

  const services = [
    { icon: "✈", title: "Airport Transfers", desc: "Precision pickup and drop with real-time flight tracking." },
    { icon: "→", title: "One Way Drop", desc: "Efficient intercity transfers with fixed transparent pricing." },
    { icon: "◎", title: "Outstation Cabs", desc: "Long-distance travel in supreme comfort across North India." },
    { icon: "◆", title: "Bus / Tempo Traveller", desc: "Group travel solutions with spacious fleet for any occasion." },
    { icon: "⬡", title: "Local Taxi Services", desc: "On-demand city rides with professional chauffeurs." },
    { icon: "◈", title: "Driver On Demand", desc: "We supply a professional driver for your own car — any transmission, any route." },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        position: "relative", minHeight: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "center",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "brightness(0.22)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(8,8,8,0.92) 45%, rgba(8,8,8,0.6) 100%)",
        }} />
        <div className="shimmer" style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "480px", height: "480px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div ref={heroRef} className="fade-up" style={{
          position: "relative", zIndex: 2,
          maxWidth: "1200px", margin: "0 auto",
          padding: "0 32px", paddingTop: "80px",
          width: "100%",
        }}>
          <div className="hero-grid">
            {/* LEFT */}
            <div>
              <div className="tag" style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "20px", height: "1px", background: gold }} />
                Chandigarh · Delhi · Pan India
              </div>

              <h1 className="serif" style={{
                fontSize: "clamp(44px, 7vw, 78px)", fontWeight: 400,
                lineHeight: 1.05, letterSpacing: "-0.5px",
                color: "#f5ede0", marginBottom: "22px",
              }}>
                Executive<br />
                <span style={{ fontStyle: "italic", color: gold }}>Mobility</span><br />
                Redefined
              </h1>

              <p style={{
                fontSize: "clamp(14px,1.6vw,16px)", lineHeight: "1.8",
                color: "rgba(232,226,217,0.58)", maxWidth: "400px",
                marginBottom: "36px", fontWeight: 300,
              }}>
                Premium chauffeur services across North India — airport transfers,
                outstation cabs, and executive travel delivered with precision.
              </p>

              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <button className="btn-gold" onClick={() => setPage("contact")}
                  style={{ padding: "15px 32px", borderRadius: "100px" }}>
                  Reserve a Ride
                </button>
                <button className="btn-outline" onClick={() => setPage("fleet")}
                  style={{ padding: "15px 32px", borderRadius: "100px" }}>
                  View Fleet
                </button>
              </div>

              <div className="hero-stats" style={{
                marginTop: "48px", paddingTop: "36px",
                borderTop: `1px solid ${border}`,
              }}>
                {[["25+", "Years Experience"], ["24/7", "Available"], ["100%", "Professional"]].map(([n, l]) => (
                  <div key={l}>
                    <div className="serif" style={{ fontSize: "clamp(24px,3.5vw,32px)", fontWeight: 500, color: gold, lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: "11px", color: "rgba(232,226,217,0.45)", marginTop: "5px", letterSpacing: "0.5px" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT GLASS CARD — hidden on mobile via CSS */}
            <div className="hero-right float" style={{
              background: "rgba(255,255,255,0.04)", border: `1px solid ${border}`,
              borderRadius: "26px", padding: "36px", backdropFilter: "blur(40px)",
            }}>
              <h3 className="serif" style={{ fontSize: "26px", fontWeight: 400, color: gold, marginBottom: "28px" }}>Our Services</h3>
              <div>
                {services.map((s, i) => (
                  <button key={s.title} onClick={() => setPage("contact")} style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 0", background: "none", border: "none", cursor: "pointer",
                    borderBottom: i < services.length - 1 ? `1px solid ${border}` : "none",
                    transition: "color 0.3s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = gold; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#e8e2d9"; }}
                  >
                    <span style={{ fontSize: "15px", color: "inherit", fontWeight: 300, fontFamily: "'Manrope',sans-serif" }}>{s.title}</span>
                    <span style={{ color: gold, fontSize: "16px" }}>→</span>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: "28px", display: "flex", gap: "10px" }}>
                <a href="tel:+919872130111" style={{ textDecoration: "none", flex: 1 }}>
                  <button className="btn-gold" style={{ width: "100%", padding: "13px", borderRadius: "10px", fontSize: "12px" }}>
                    +91 98721 30111
                  </button>
                </a>
                <a href="tel:+919814100111" style={{ textDecoration: "none", flex: 1 }}>
                  <button className="btn-outline" style={{ width: "100%", padding: "13px", borderRadius: "10px", fontSize: "12px" }}>
                    +91 98141 00111
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SCROLL HINT */}
        <div style={{
          position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
          zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
        }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(232,226,217,0.28)", textTransform: "uppercase" }}>Scroll</div>
          <div style={{ width: "1px", height: "36px", background: `linear-gradient(to bottom, transparent, ${gold}, transparent)` }} />
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section-pad">
        <div ref={s2} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div className="tag" style={{ marginBottom: "12px" }}>What We Offer</div>
            <div className="divider-gold" style={{ margin: "12px auto 22px" }} />
            <h2 className="serif" style={{ fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 400, color: "#f5ede0" }}>
              Tailored for Every Journey
            </h2>
          </div>
          <div className="service-grid">
            {services.map(s => (
              <button key={s.title} onClick={() => setPage("contact")} className="card-hover"
                style={{
                  padding: "32px 24px", background: bgCard,
                  border: `1px solid ${border}`, borderRadius: "18px",
                  backdropFilter: "blur(20px)", cursor: "pointer",
                  textAlign: "left", width: "100%",
                }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "12px",
                  border: `1px solid ${borderGold}`, display: "flex",
                  alignItems: "center", justifyContent: "center", marginBottom: "18px",
                  transition: "background 0.3s",
                }}>
                  <span style={{ fontSize: "18px", color: gold }}>{s.icon}</span>
                </div>
                <h3 className="serif" style={{ fontSize: "20px", fontWeight: 500, color: "#f5ede0", marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ fontSize: "13px", lineHeight: "1.7", color: "rgba(232,226,217,0.48)", fontWeight: 300 }}>{s.desc}</p>
                <div style={{ marginTop: "18px", fontSize: "12px", color: gold, letterSpacing: "1px", textTransform: "uppercase" }}>
                  Book Now →
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── RATES ── */}
      <section style={{
        background: "rgba(201,169,110,0.025)", borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`,
      }} className="section-pad">
        <div ref={s3} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div className="tag" style={{ marginBottom: "12px" }}>Transparent Pricing</div>
            <div className="divider-gold" style={{ margin: "12px auto 22px" }} />
            <h2 className="serif" style={{ fontSize: "clamp(30px,4vw,50px)", fontWeight: 400, color: "#f5ede0", marginBottom: "10px" }}>
              Chandigarh ↔ Delhi
            </h2>
            <p style={{ color: "rgba(232,226,217,0.45)", fontSize: "14px" }}>One-way executive rates. No hidden charges.</p>
          </div>
          <div className="rates-grid">
            {/* SEDAN */}
            <div style={{
              border: `1px solid ${border}`, borderRadius: "22px",
              padding: "36px", background: bgCard, backdropFilter: "blur(20px)",
              transition: "border-color 0.4s, transform 0.4s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = borderGold; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.transform = "none"; }}>
              <div className="tag" style={{ marginBottom: "16px" }}>Executive Sedan</div>
              <h3 className="serif" style={{ fontSize: "clamp(24px,3vw,32px)", fontWeight: 400, color: "#f5ede0", marginBottom: "6px" }}>
                Etios · Aura · Dzire
              </h3>
              <p style={{ color: "rgba(232,226,217,0.4)", fontSize: "13px", marginBottom: "28px" }}>4 passengers · Comfortable & reliable</p>
              <div style={{ borderTop: `1px solid ${border}`, paddingTop: "24px", display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span className="price-tag">₹3,499</span>
                <button className="onwards-link" onClick={() => setPage("contact")}
                  style={{ color: "rgba(232,226,217,0.45)", fontSize: "14px", background: "none", border: "none", fontFamily: "'Manrope',sans-serif" }}>
                  onwards ↗
                </button>
              </div>
            </div>
            {/* SUVs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {[
                { tag: "SUV / MPV", name: "Toyota Innova Crysta", spec: "7 passengers · Premium spacious", price: "₹5,499" },
                { tag: "SUV / MPV", name: "Ertiga / Rumion", spec: "6 passengers · Versatile family SUV", price: "₹4,499" },
              ].map(item => (
                <div key={item.name} style={{
                  border: `1px solid ${border}`, borderRadius: "22px",
                  padding: "28px", background: bgCard, backdropFilter: "blur(20px)",
                  flex: 1, transition: "border-color 0.4s, transform 0.4s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = borderGold; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.transform = "none"; }}>
                  <div className="tag" style={{ marginBottom: "12px" }}>{item.tag}</div>
                  <h3 className="serif" style={{ fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 400, color: "#f5ede0", marginBottom: "4px" }}>{item.name}</h3>
                  <p style={{ color: "rgba(232,226,217,0.4)", fontSize: "12px", marginBottom: "20px" }}>{item.spec}</p>
                  <div style={{ borderTop: `1px solid ${border}`, paddingTop: "18px", display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span className="price-tag" style={{ fontSize: "32px" }}>{item.price}</span>
                    <button className="onwards-link" onClick={() => setPage("contact")}
                      style={{ color: "rgba(232,226,217,0.45)", fontSize: "13px", background: "none", border: "none", fontFamily: "'Manrope',sans-serif" }}>
                      onwards ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <ReviewsSection />

      {/* ── CTA ── */}
      <section className="section-pad" style={{ textAlign: "center" }}>
        <div ref={s4} className="fade-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="tag" style={{ marginBottom: "18px" }}>Ready to Travel?</div>
          <h2 className="serif" style={{ fontSize: "clamp(36px,5vw,62px)", fontWeight: 400, lineHeight: 1.05, color: "#f5ede0", marginBottom: "20px" }}>
            Experience the Difference<br />
            <span style={{ fontStyle: "italic", color: gold }}>Firsthand</span>
          </h2>
          <p style={{ color: "rgba(232,226,217,0.45)", fontSize: "15px", lineHeight: "1.8", marginBottom: "40px", fontWeight: 300 }}>
            Call us directly for instant booking. Available 24/7.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:+919872130111" style={{ textDecoration: "none" }}>
              <button className="btn-gold" style={{ padding: "16px 40px", borderRadius: "100px" }}>Call +91 98721 30111</button>
            </a>
            <a href="https://wa.me/919872130111" style={{ textDecoration: "none" }}>
              <button className="btn-outline" style={{ padding: "16px 40px", borderRadius: "100px" }}>WhatsApp Us</button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ════════════════════════════════
   SERVICES PAGE
════════════════════════════════ */
function ServicesPage({ setPage }) {
  const r1 = useFadeUp(); const r2 = useFadeUp(); const r3 = useFadeUp();

  const categories = [
    {
      title: "City to City",
      subtitle: "Executive intercity transfers between major cities across North India.",
      items: ["Executive Sedan — Toyota Etios, Maruti Dzire, Hyundai Aura", "Executive SUV / MPV — Innova Crysta, Ertiga, Rumion", "Luxury Fleet — Mercedes, BMW, Audi"],
    },
    {
      title: "Intra City",
      subtitle: "Premium local rides within Chandigarh and Delhi NCR.",
      items: ["Executive Sedan", "Executive SUV / MPV", "Luxury Fleet"],
    },
    {
      title: "Airport Transfers",
      subtitle: "Seamless airport pickup and drop with real-time flight tracking.",
      items: ["Executive Sedan", "Executive SUV / MPV", "Luxury Fleet"],
    },
  ];

  const extraServices = [
    {
      icon: "◈", title: "Driver On Demand",
      desc: "We provide a professional driver for your own vehicle — manual or automatic transmission. Share your pickup location, drop location, and timings. Pricing is discussed directly based on your requirement.",
      cta: "Request a Driver",
    },
    {
      icon: "⬡", title: "Bus / Tempo Traveller",
      desc: "Group travel solutions for corporate outings, family trips, and large events. Available in various seating capacities to match your group size.",
      cta: "Book Group Travel",
    },
  ];

  return (
    <div style={{ paddingTop: "70px" }}>
      <section className="section-pad" style={{
        textAlign: "center",
        background: `linear-gradient(180deg, rgba(201,169,110,0.05) 0%, transparent 100%)`,
        borderBottom: `1px solid ${border}`,
      }}>
        <div ref={r1} className="fade-up">
          <div className="tag" style={{ marginBottom: "14px" }}>Pioneer Travels</div>
          <div className="divider-gold" style={{ margin: "14px auto 24px" }} />
          <h1 className="serif" style={{ fontSize: "clamp(42px,6vw,68px)", fontWeight: 400, color: "#f5ede0", marginBottom: "16px" }}>
            Our Services
          </h1>
          <p style={{ color: "rgba(232,226,217,0.48)", fontSize: "15px", maxWidth: "500px", margin: "0 auto", fontWeight: 300, lineHeight: 1.8 }}>
            A complete suite of executive mobility solutions for every occasion.
          </p>
        </div>
      </section>

      {/* CATEGORY CARDS */}
      <section className="section-pad">
        <div ref={r2} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="services-cat-grid">
            {categories.map((cat) => (
              <button key={cat.title} onClick={() => setPage("contact")} className="card-hover"
                style={{
                  padding: "40px 32px", background: bgCard,
                  border: `1px solid ${border}`, borderRadius: "22px",
                  backdropFilter: "blur(20px)", cursor: "pointer", textAlign: "left", width: "100%",
                }}>
                <div style={{ width: "28px", height: "1px", background: gold, marginBottom: "22px" }} />
                <h2 className="serif" style={{ fontSize: "30px", fontWeight: 400, color: gold, marginBottom: "10px" }}>{cat.title}</h2>
                <p style={{ fontSize: "13px", color: "rgba(232,226,217,0.45)", marginBottom: "26px", lineHeight: "1.7", fontWeight: 300 }}>{cat.subtitle}</p>
                <div>
                  {cat.items.map((item, j) => (
                    <div key={j} style={{
                      display: "flex", alignItems: "flex-start", gap: "10px",
                      padding: "12px 0", borderBottom: j < cat.items.length - 1 ? `1px solid ${border}` : "none",
                    }}>
                      <span style={{ color: gold, fontSize: "9px", marginTop: "5px" }}>◆</span>
                      <span style={{ fontSize: "13px", color: "#e8e2d9", fontWeight: 300, lineHeight: "1.5" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "22px", fontSize: "11px", color: gold, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  Book Now →
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* DRIVER ON DEMAND + BUS */}
      <section className="section-pad" style={{ borderTop: `1px solid ${border}`, background: "rgba(201,169,110,0.025)" }}>
        <div ref={r3} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="tag" style={{ marginBottom: "12px" }}>Specialised Services</div>
            <div className="divider-gold" style={{ margin: "12px auto 20px" }} />
            <h2 className="serif" style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 400, color: "#f5ede0" }}>More Ways to Move</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "24px" }}>
            {extraServices.map(s => (
              <div key={s.title} style={{
                padding: "40px 32px", background: bgCard,
                border: `1px solid ${borderGold}`, borderRadius: "22px",
                backdropFilter: "blur(20px)",
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "14px",
                  border: `1px solid ${borderGold}`, display: "flex",
                  alignItems: "center", justifyContent: "center", marginBottom: "22px",
                }}>
                  <span style={{ fontSize: "20px", color: gold }}>{s.icon}</span>
                </div>
                <h3 className="serif" style={{ fontSize: "28px", fontWeight: 400, color: "#f5ede0", marginBottom: "14px" }}>{s.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.8", color: "rgba(232,226,217,0.5)", fontWeight: 300, marginBottom: "28px" }}>{s.desc}</p>
                <button className="btn-gold" onClick={() => setPage("contact")}
                  style={{ padding: "12px 28px", borderRadius: "100px", fontSize: "12px" }}>
                  {s.cta}
                </button>
              </div>
            ))}
          </div>

          {/* STATS */}
          <div className="stats-grid" style={{
            marginTop: "56px", border: `1px solid ${border}`, borderRadius: "18px", overflow: "hidden",
          }}>
            {[["25+","Years of Service"],["24/7","Availability"],["Professional","Chauffeurs"],["Fixed","Transparent Rates"]].map(([n,l],i,arr) => (
              <div key={l} style={{
                padding: "40px 24px", textAlign: "center", background: bgCard,
                borderRight: i < arr.length - 1 ? `1px solid ${border}` : "none",
              }}>
                <div className="serif" style={{ fontSize: "clamp(32px,4vw,44px)", fontWeight: 400, color: gold, lineHeight: 1, marginBottom: "8px" }}>{n}</div>
                <div style={{ fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(232,226,217,0.38)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ════════════════════════════════
   FLEET PAGE
════════════════════════════════ */
function FleetPage({ setPage }) {
  const r1 = useFadeUp(); const r2 = useFadeUp(); const r3 = useFadeUp(); const r4 = useFadeUp();

  const VehicleCard = ({ name, tag, spec }) => (
    <div className="card-hover" style={{
      padding: "24px 20px", background: bgCard,
      border: `1px solid ${border}`, borderRadius: "14px",
    }}>
      <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: gold, marginBottom: "10px" }}>{tag}</div>
      <h4 className="serif" style={{ fontSize: "19px", fontWeight: 400, color: "#f5ede0", marginBottom: "5px" }}>{name}</h4>
      <p style={{ fontSize: "12px", color: "rgba(232,226,217,0.38)", fontWeight: 300 }}>{spec}</p>
    </div>
  );

  const Section = ({ label, title, vehicles, innerRef, dark }) => (
    <section className="section-pad" style={dark ? { background: "rgba(201,169,110,0.025)", borderTop: `1px solid ${border}` } : { borderTop: `1px solid ${border}` }}>
      <div ref={innerRef} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "44px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <div className="tag" style={{ marginBottom: "6px" }}>{label}</div>
            <h2 className="serif" style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, color: "#f5ede0" }}>{title}</h2>
          </div>
          <div style={{ flex: 1, height: "1px", background: border, minWidth: "20px" }} />
        </div>
        <div className="fleet-grid">
          {vehicles.map(v => <VehicleCard key={v.name} {...v} />)}
        </div>
      </div>
    </section>
  );

  return (
    <div style={{ paddingTop: "70px" }}>
      <section className="section-pad" style={{
        textAlign: "center",
        background: `linear-gradient(180deg, rgba(201,169,110,0.05) 0%, transparent 100%)`,
        borderBottom: `1px solid ${border}`,
      }}>
        <div ref={r1} className="fade-up">
          <div className="tag" style={{ marginBottom: "14px" }}>Pioneer Travels</div>
          <div className="divider-gold" style={{ margin: "14px auto 24px" }} />
          <h1 className="serif" style={{ fontSize: "clamp(42px,6vw,68px)", fontWeight: 400, color: "#f5ede0", marginBottom: "16px" }}>
            Our Fleet
          </h1>
          <p style={{ color: "rgba(232,226,217,0.48)", fontSize: "15px", maxWidth: "460px", margin: "0 auto", fontWeight: 300, lineHeight: 1.8 }}>
            A curated collection of executive and luxury vehicles for every requirement.
          </p>
        </div>
      </section>

      <Section label="Fleet Category" title="Executive Fleet" innerRef={r2} vehicles={[
        { name: "Toyota Etios", tag: "Sedan", spec: "4 passengers" },
        { name: "Maruti Dzire", tag: "Sedan", spec: "4 passengers" },
        { name: "Hyundai Aura", tag: "Sedan", spec: "4 passengers" },
        { name: "Honda Amaze", tag: "Sedan", spec: "4 passengers" },
        { name: "Traveller", tag: "Van", spec: "12+ passengers" },
        { name: "Bus", tag: "Coach", spec: "Group travel" },
      ]} />
      <Section label="SUV / MPV" title="SUV & MPV Fleet" innerRef={r3} dark vehicles={[
        { name: "Toyota Innova Crysta", tag: "SUV", spec: "7 passengers" },
        { name: "Maruti Ertiga", tag: "MPV", spec: "6 passengers" },
        { name: "Toyota Rumion", tag: "MPV", spec: "6 passengers" },
        { name: "Kia Carens", tag: "MPV", spec: "6 passengers" },
      ]} />

      {/* LUXURY */}
      <section className="section-pad" style={{ borderTop: `1px solid ${border}` }}>
        <div ref={r4} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "44px", flexWrap: "wrap" }}>
            <div>
              <div className="tag" style={{ marginBottom: "6px" }}>Premium Collection</div>
              <h2 className="serif" style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 400, color: "#f5ede0" }}>Luxury Fleet</h2>
            </div>
            <div style={{ flex: 1, height: "1px", background: border, minWidth: "20px" }} />
          </div>
          <div className="fleet-grid" style={{ marginBottom: "44px" }}>
            {[
              { name: "Mercedes E-Class", tag: "Luxury Sedan", spec: "Premium executive" },
              { name: "BMW 5 Series", tag: "Luxury Sedan", spec: "Premium executive" },
              { name: "Audi A6", tag: "Luxury Sedan", spec: "Premium executive" },
              { name: "Toyota Camry", tag: "Luxury Sedan", spec: "Business class" },
              { name: "Toyota Fortuner", tag: "Luxury SUV", spec: "7 passengers" },
              { name: "Range Rover", tag: "Luxury SUV", spec: "Ultra premium" },
              { name: "MG Gloster", tag: "Luxury SUV", spec: "7 passengers" },
            ].map(v => <VehicleCard key={v.name} {...v} />)}
          </div>
          <div style={{
            textAlign: "center", padding: "40px 32px",
            border: `1px solid ${borderGold}`, borderRadius: "18px",
            background: "rgba(201,169,110,0.04)",
          }}>
            <p className="serif" style={{ fontSize: "22px", color: "#f5ede0", fontStyle: "italic", marginBottom: "6px" }}>
              Additional vehicles available on request
            </p>
            <p style={{ color: "rgba(232,226,217,0.38)", fontSize: "13px", marginBottom: "24px", fontWeight: 300 }}>
              Based on availability and travel requirements
            </p>
            <button className="btn-gold" onClick={() => setPage("contact")}
              style={{ padding: "13px 36px", borderRadius: "100px" }}>
              Contact for Fleet Booking
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ════════════════════════════════
   CONTACT PAGE
════════════════════════════════ */
function ContactPage() {
  const r1 = useFadeUp(); const r2 = useFadeUp();

  return (
    <div style={{ paddingTop: "70px" }}>
      <section className="section-pad" style={{
        textAlign: "center",
        background: `linear-gradient(180deg, rgba(201,169,110,0.05) 0%, transparent 100%)`,
        borderBottom: `1px solid ${border}`,
      }}>
        <div ref={r1} className="fade-up">
          <div className="tag" style={{ marginBottom: "14px" }}>Get In Touch</div>
          <div className="divider-gold" style={{ margin: "14px auto 24px" }} />
          <h1 className="serif" style={{ fontSize: "clamp(42px,6vw,68px)", fontWeight: 400, color: "#f5ede0", marginBottom: "16px" }}>
            Book a Ride
          </h1>
          <p style={{ color: "rgba(232,226,217,0.48)", fontSize: "15px", maxWidth: "440px", margin: "0 auto", fontWeight: 300, lineHeight: 1.8 }}>
            Call us or message on WhatsApp for instant booking. Available 24 hours, 7 days a week.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div ref={r2} className="fade-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="contact-grid" style={{ marginBottom: "18px" }}>
            <a href="tel:+919872130111" style={{ textDecoration: "none" }}>
              <div className="card-hover" style={{
                padding: "32px 28px", background: bgCard,
                border: `1px solid ${border}`, borderRadius: "18px",
                cursor: "pointer", backdropFilter: "blur(16px)",
              }}>
                <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: gold, marginBottom: "14px" }}>Primary Line</div>
                <h3 className="serif" style={{ fontSize: "clamp(22px,3.5vw,28px)", fontWeight: 400, color: "#f5ede0", marginBottom: "5px" }}>
                  +91 98721 30111
                </h3>
                <p style={{ fontSize: "12px", color: "rgba(232,226,217,0.38)" }}>Tap to call directly</p>
                <div style={{ marginTop: "20px" }}>
                  <span className="btn-gold" style={{ padding: "9px 22px", borderRadius: "100px", fontSize: "11px" }}>Call Now</span>
                </div>
              </div>
            </a>

            <a href="tel:+919917600079" style={{ textDecoration: "none" }}>
              <div className="card-hover" style={{
                padding: "32px 28px", background: bgCard,
                border: `1px solid ${border}`, borderRadius: "18px",
                cursor: "pointer", backdropFilter: "blur(16px)",
              }}>
                <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: gold, marginBottom: "14px" }}>Alternate Line</div>
                <h3 className="serif" style={{ fontSize: "clamp(22px,3.5vw,28px)", fontWeight: 400, color: "#f5ede0", marginBottom: "5px" }}>
                  +91 99176 00079
                </h3>
                <p style={{ fontSize: "12px", color: "rgba(232,226,217,0.38)" }}>Tap to call directly</p>
                <div style={{ marginTop: "20px" }}>
                  <span className="btn-outline" style={{ padding: "9px 22px", borderRadius: "100px", fontSize: "11px" }}>Call Now</span>
                </div>
              </div>
            </a>
          </div>

          {/* WHATSAPP FULL WIDTH */}
          <a href="https://wa.me/919872130111" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <div style={{
              padding: "28px 32px", background: "rgba(37,211,102,0.06)",
              border: "1px solid rgba(37,211,102,0.18)", borderRadius: "18px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", marginBottom: "18px",
              transition: "background 0.3s, border-color 0.3s",
              backdropFilter: "blur(16px)", flexWrap: "wrap", gap: "12px",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(37,211,102,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(37,211,102,0.06)"; }}>
              <div>
                <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#25D366", marginBottom: "6px" }}>WhatsApp</div>
                <div className="serif" style={{ fontSize: "clamp(18px,3vw,24px)", color: "#f5ede0", fontWeight: 400 }}>+91 98721 30111</div>
                <div style={{ fontSize: "12px", color: "rgba(232,226,217,0.38)", marginTop: "3px" }}>Chat with us instantly</div>
              </div>
              <div style={{
                background: "#25D366", width: "48px", height: "48px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg viewBox="0 0 32 32" width="22" height="22" fill="white">
                  <path d="M19.11 17.21c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.15-.19.29-.74.94-.91 1.13-.17.19-.33.22-.62.07-.29-.14-1.22-.45-2.32-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.13-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.44 0 1.44 1.04 2.82 1.19 3.02.14.19 2.04 3.11 4.95 4.36.69.3 1.24.47 1.66.6.7.22 1.34.19 1.84.11.56-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.11-.26-.18-.55-.33z"/>
                  <path d="M16.01 3C8.83 3 3 8.83 3 16c0 2.53.74 5 2.13 7.11L3 29l6.08-2.07A12.93 12.93 0 0016.01 29C23.18 29 29 23.17 29 16S23.18 3 16.01 3zm0 23.67c-2.07 0-4.09-.56-5.85-1.62l-.42-.25-3.61 1.23 1.18-3.52-.27-.44A10.61 10.61 0 015.33 16c0-5.88 4.79-10.67 10.68-10.67 2.85 0 5.52 1.11 7.53 3.12A10.57 10.57 0 0126.67 16c0 5.89-4.79 10.67-10.66 10.67z"/>
                </svg>
              </div>
            </div>
          </a>

          {/* INFO CARD */}
          <div style={{
            textAlign: "center", padding: "36px",
            background: bgCard, border: `1px solid ${border}`,
            borderRadius: "18px", backdropFilter: "blur(16px)",
          }}>
            <p className="serif" style={{ fontSize: "22px", color: "#f5ede0", fontStyle: "italic", marginBottom: "8px" }}>Pioneer Travels</p>
            <p style={{ color: "rgba(232,226,217,0.38)", fontSize: "13px", lineHeight: "1.8", fontWeight: 300 }}>
              Available 24 hours · 7 days a week<br />
              Chandigarh · Delhi · Pan North India
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ════════════════════════════════
   FOOTER
════════════════════════════════ */
function Footer({ setPage }) {
  return (
    <footer style={{ borderTop: `1px solid ${border}`, padding: "56px 32px 36px", background: "#040404" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="footer-grid" style={{ marginBottom: "44px" }}>
          <div style={{ maxWidth: "260px" }}>
            <div style={{
              fontFamily: "'Manrope',sans-serif", fontWeight: 300,
              fontSize: "16px", letterSpacing: "5px", color: "#e8e2d9",
              textTransform: "uppercase", marginBottom: "12px",
            }}>
              PIONEER <span style={{ color: gold }}>TRAVELS</span>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(232,226,217,0.32)", lineHeight: "1.7", fontWeight: 300 }}>
              Executive mobility solutions across North India with over 25 years of trusted service.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: gold, marginBottom: "18px" }}>Navigate</div>
              {["home","services","fleet","contact"].map(p => (
                <div key={p} style={{ marginBottom: "10px" }}>
                  <button onClick={() => setPage(p)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "'Manrope',sans-serif", fontSize: "13px",
                    color: "rgba(232,226,217,0.45)", textTransform: "capitalize",
                    fontWeight: 300, transition: "color 0.3s", padding: 0,
                  }}
                    onMouseEnter={e => e.target.style.color = gold}
                    onMouseLeave={e => e.target.style.color = "rgba(232,226,217,0.45)"}
                  >{p === "contact" ? "Book Now" : p}</button>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: gold, marginBottom: "18px" }}>Contact</div>
              <a href="tel:+919872130111" style={{ textDecoration: "none" }}>
                <div style={{ marginBottom: "10px", fontSize: "13px", color: "rgba(232,226,217,0.45)", fontWeight: 300, cursor: "pointer" }}>+91 98721 30111</div>
              </a>
              <a href="tel:+919917600079" style={{ textDecoration: "none" }}>
                <div style={{ marginBottom: "10px", fontSize: "13px", color: "rgba(232,226,217,0.45)", fontWeight: 300 }}>+91 99176 00079</div>
              </a>
              <a href="https://wa.me/919872130111" style={{ textDecoration: "none" }}>
                <div style={{ fontSize: "13px", color: "#25D366", fontWeight: 300 }}>WhatsApp</div>
              </a>
            </div>
          </div>
        </div>
        <div style={{
          borderTop: `1px solid ${border}`, paddingTop: "22px",
          display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px",
        }}>
          <p style={{ fontSize: "11px", color: "rgba(232,226,217,0.2)", fontWeight: 300 }}>
            © {new Date().getFullYear()} Pioneer Travels. All rights reserved.
          </p>
          <p style={{ fontSize: "11px", color: "rgba(232,226,217,0.2)", fontWeight: 300 }}>
            Chandigarh · Delhi · Pan North India
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════
   ROOT APP
════════════════════════════════ */
export default function PioneerTravels() {
  const [page, setPage] = useState("home");
  const topRef = useRef(null);

  const navigate = (p) => {
    setPage(p);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 30);
  };

  return (
    <div ref={topRef} style={{ background: bg, minHeight: "100vh", color: "#e8e2d9", overflowX: "hidden" }}>
      <FontStyle />
      <Navbar page={page} setPage={navigate} />

      {page === "home"     && <HomePage setPage={navigate} />}
      {page === "services" && <ServicesPage setPage={navigate} />}
      {page === "fleet"    && <FleetPage setPage={navigate} />}
      {page === "contact"  && <ContactPage />}

      <Footer setPage={navigate} />
      <WhatsApp />
    </div>
  );
}