"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DESIGN TOKENS ─── */
const gold = "#A67C3C";
const goldLight = "#C49A50";
const bg = "#F5F0E8";
const bgDark = "#EDE8DC";
const bgCard = "rgba(255,255,255,0.7)";
const bgCardHover = "rgba(255,255,255,0.9)";
const border = "rgba(160,140,110,0.2)";
const borderGold = "rgba(166,124,60,0.35)";
const textPrimary = "#1A1612";
const textSecondary = "#5C5040";
const textMuted = "#8C7A62";

/* ─── FONT + GLOBAL STYLES ─── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Manrope:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { overflow-x: hidden; }
    body { background: #F5F0E8; color: #1A1612; font-family: 'Manrope', sans-serif; overflow-x: hidden; -webkit-text-size-adjust: 100%; }
    .serif { font-family: 'Cormorant Garamond', serif; }

    .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1); }
    .fade-up.visible { opacity: 1; transform: translateY(0); }
    .stagger-1 { transition-delay: 0.1s !important; }
    .stagger-2 { transition-delay: 0.2s !important; }
    .stagger-3 { transition-delay: 0.3s !important; }

    .card-hover { transition: background 0.4s ease, border-color 0.4s ease, transform 0.35s ease, box-shadow 0.35s ease; }
    .card-hover:hover { background: rgba(255,255,255,0.9) !important; border-color: rgba(166,124,60,0.35) !important; transform: translateY(-3px); box-shadow: 0 12px 40px rgba(160,120,60,0.1) !important; }

    .btn-gold {
      background: #A67C3C; color: #fff;
      font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px;
      letter-spacing: 1.5px; text-transform: uppercase;
      border: none; cursor: pointer; display: inline-block;
      transition: background 0.3s ease, transform 0.2s ease;
    }
    .btn-gold:hover { background: #C49A50; transform: translateY(-1px); }

    .btn-outline {
      background: transparent; color: #1A1612;
      font-family: 'Manrope', sans-serif; font-weight: 500; font-size: 13px;
      letter-spacing: 1.5px; text-transform: uppercase;
      border: 1px solid rgba(26,22,18,0.25); cursor: pointer; display: inline-block;
      transition: border-color 0.3s ease, color 0.3s ease, background 0.3s ease;
    }
    .btn-outline:hover { border-color: #A67C3C; color: #A67C3C; background: rgba(166,124,60,0.05); }

    .nav-link {
      background: none; border: none; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 500;
      letter-spacing: 1.5px; text-transform: uppercase; color: rgba(26,22,18,0.55); cursor: pointer;
      transition: color 0.3s ease; padding: 0; text-decoration: none; white-space: nowrap;
    }
    .nav-link:hover { color: #A67C3C; }

    .hamburger { display: none; }
    @media (max-width: 768px) {
      .hamburger { display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; z-index: 200; }
      .hamburger span { display: block; width: 22px; height: 1.5px; background: #1A1612; transition: all 0.3s ease; }
      .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
      .hamburger.open span:nth-child(2) { opacity: 0; }
      .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
      .desktop-nav { display: none !important; }
    }

    .mobile-menu {
      position: fixed; inset: 0; z-index: 150;
      background: rgba(245,240,232,0.98); backdrop-filter: blur(24px);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 36px; opacity: 0; pointer-events: none; transition: opacity 0.35s ease;
    }
    .mobile-menu.open { opacity: 1; pointer-events: all; }
    .mobile-menu button {
      background: none; border: none; cursor: pointer;
      font-family: 'Cormorant Garamond', serif; font-size: 38px; font-weight: 400;
      color: #1A1612; transition: color 0.3s ease;
    }
    .mobile-menu button:hover { color: #A67C3C; }

    .tag { display: inline-block; font-family: 'Manrope', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #A67C3C; }
    .divider-gold { width: 36px; height: 1px; background: #A67C3C; margin: 0 auto; }
    .price-tag { font-family: 'Cormorant Garamond', serif; font-size: 40px; font-weight: 500; color: #1A1612; line-height: 1; }

    .whatsapp-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 300;
      width: 50px; height: 50px; border-radius: 50%; background: #25D366;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; border: none; box-shadow: 0 4px 20px rgba(37,211,102,0.3);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .whatsapp-btn:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(37,211,102,0.45); }

    .star { cursor: pointer; font-size: 22px; transition: color 0.2s; color: rgba(166,124,60,0.25); }
    .star.active { color: #A67C3C; }
    .star:hover { color: #C49A50; }

    .review-input {
      width: 100%; background: rgba(255,255,255,0.8); border: 1px solid rgba(160,140,110,0.25);
      border-radius: 10px; padding: 14px 16px; color: #1A1612;
      font-family: 'Manrope', sans-serif; font-size: 14px; font-weight: 300;
      outline: none; transition: border-color 0.3s, box-shadow 0.3s;
    }
    .review-input:focus { border-color: rgba(166,124,60,0.5); box-shadow: 0 0 0 3px rgba(166,124,60,0.08); }
    .review-input::placeholder { color: rgba(26,22,18,0.3); }

    .booking-input {
      width: 100%; background: rgba(255,255,255,0.8); border: 1px solid rgba(160,140,110,0.25);
      border-radius: 12px; padding: 15px 18px; color: #1A1612;
      font-family: 'Manrope', sans-serif; font-size: 15px; font-weight: 300;
      outline: none; transition: border-color 0.35s, box-shadow 0.35s;
      appearance: none; -webkit-appearance: none;
    }
    .booking-input:focus { border-color: rgba(166,124,60,0.5); box-shadow: 0 0 0 3px rgba(166,124,60,0.08); }
    .booking-input::placeholder { color: rgba(26,22,18,0.3); }
    .booking-input option { background: #fff; color: #1A1612; }

    .service-card-btn { color: #1A1612 !important; }
    .service-card-btn * { color: inherit; }

    .onwards-link { cursor: pointer; transition: color 0.3s ease; }
    .onwards-link:hover { color: #A67C3C !important; }

    @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .float { animation: float 6s ease-in-out infinite; }
    @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
    .shimmer { animation: shimmer 3s ease-in-out infinite; }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: #EDE8DC; }
    ::-webkit-scrollbar-thumb { background: #C4B090; border-radius: 2px; }

    .section-pad { padding: 90px 48px; }
    @media (max-width: 1024px) { .section-pad { padding: 70px 32px; } }
    @media (max-width: 768px)  { .section-pad { padding: 56px 20px; } }

    .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
    @media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; gap: 40px; } .hero-right { display: none; } }

    .service-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
    @media (max-width: 900px) { .service-grid { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 560px) { .service-grid { grid-template-columns: 1fr; } }

    .rates-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    @media (max-width: 760px) { .rates-grid { grid-template-columns: 1fr; } }

    .fleet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr)); gap: 14px; }
    @media (max-width: 480px) { .fleet-grid { grid-template-columns: 1fr 1fr; } }

    .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); }
    @media (max-width: 600px) { .stats-grid { grid-template-columns: repeat(2,1fr); } }

    .hero-stats { display: flex; gap: 40px; }
    @media (max-width: 480px) { .hero-stats { gap: 24px; } }

    .reviews-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
    @media (max-width: 900px) { .reviews-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 560px) { .reviews-grid { grid-template-columns: 1fr; } }

    .services-cat-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
    @media (max-width: 900px) { .services-cat-grid { grid-template-columns: 1fr; } }

    .booking-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 640px) { .booking-grid { grid-template-columns: 1fr; } }

    .footer-grid { display: flex; justify-content: space-between; align-items: flex-start; gap: 32px; flex-wrap: wrap; }
    .footer-links { display: flex; gap: 60px; flex-wrap: wrap; }
    @media (max-width: 600px) { .footer-links { gap: 32px; } }

    .driver-tab {
      padding: 10px 28px; border-radius: 100px; cursor: pointer;
      font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 600;
      letter-spacing: 1.5px; text-transform: uppercase; transition: all 0.3s ease;
      border: 1px solid rgba(26,22,18,0.2); color: rgba(26,22,18,0.45); background: transparent;
    }
    .driver-tab.active { background: #A67C3C; color: #fff; border-color: #A67C3C; }
    .driver-tab:hover:not(.active) { border-color: rgba(166,124,60,0.5); color: #A67C3C; }

    .trans-btn {
      flex: 1; padding: 14px 10px; border-radius: 10px; cursor: pointer;
      font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 500;
      letter-spacing: 0.5px; transition: all 0.3s; border: 1px solid rgba(26,22,18,0.15);
      color: rgba(26,22,18,0.45); background: rgba(255,255,255,0.5);
    }
    .trans-btn.active { background: rgba(166,124,60,0.1); border-color: rgba(166,124,60,0.5); color: #A67C3C; }
    .trans-btn:hover:not(.active) { border-color: rgba(166,124,60,0.3); color: #5C5040; }

    .field-label {
      display: block; font-size: 10px; font-weight: 600; letter-spacing: 2px;
      text-transform: uppercase; color: rgba(166,124,60,0.8); margin-bottom: 8px;
      font-family: 'Manrope', sans-serif;
    }

    @keyframes popIn { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
    .pop-in { animation: popIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards; }

    /* ── PLACES AUTOCOMPLETE ── */
    .places-wrapper { position: relative; }
    .places-dropdown {
      position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 500;
      background: #fff; border: 1px solid rgba(160,140,110,0.3);
      border-radius: 12px; overflow: hidden;
      box-shadow: 0 8px 32px rgba(160,120,60,0.12);
    }
    .places-item {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 12px 16px; cursor: pointer;
      transition: background 0.2s ease;
      border-bottom: 1px solid rgba(160,140,110,0.1);
      font-family: 'Manrope', sans-serif;
    }
    .places-item:last-child { border-bottom: none; }
    .places-item:hover { background: rgba(166,124,60,0.06); }
    .places-item-icon { color: #A67C3C; margin-top: 2px; flex-shrink: 0; font-size: 15px; }
    .places-item-main { font-size: 14px; color: #1A1612; font-weight: 400; }
    .places-item-sub { font-size: 12px; color: #8C7A62; margin-top: 2px; font-weight: 300; }
    .places-loading { padding: 14px 16px; text-align: center; font-size: 13px; color: #8C7A62; font-family: 'Manrope', sans-serif; }
  `}</style>
);

/* ─── NOMINATIM LOCATION SEARCH (no API key, pincode + name support) ─── */
const nominatimCache = {};

async function searchNominatim(query) {
  const q = query.trim();
  if (nominatimCache[q]) return nominatimCache[q];

  // Detect if query looks like a pincode (all digits, 5-6 chars)
  const isPincode = /^\d{5,6}$/.test(q);
  const params = new URLSearchParams({
    format: "json",
    addressdetails: "1",
    limit: "7",
    countrycodes: "in",
    dedupe: "1",
    ...(isPincode ? { postalcode: q } : { q: `${q}, India` }),
  });

  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { "Accept-Language": "en", "User-Agent": "PioneerTravels/1.0" },
  });
  if (!res.ok) return [];
  const data = await res.json();

  const results = data.map((item) => {
    const a = item.address || {};
    // Build a clean main label
    const main =
      a.amenity || a.tourism || a.shop || a.building ||
      a.neighbourhood || a.suburb || a.village ||
      a.town || a.city_district || a.city ||
      item.name || q;
    // Build secondary line
    const parts = [
      a.city || a.town || a.village || a.county,
      a.state,
      a.postcode,
    ].filter(Boolean);
    const secondary = parts.join(", ");
    return { id: item.place_id, main, secondary, full: item.display_name };
  });

  nominatimCache[q] = results;
  return results;
}

/* ─── LOCATION INPUT COMPONENT ─── */
function LocationInput({ label, placeholder, value, onChange, error }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (val) => {
    setQuery(val);
    onChange(val);
    clearTimeout(debounceRef.current);
    if (!val || val.length < 2) { setSuggestions([]); setOpen(false); setLoading(false); return; }
    setLoading(true); setOpen(true);
    debounceRef.current = setTimeout(async () => {
      // Cancel any previous in-flight request via abort controller
      if (abortRef.current) abortRef.current.abort();
      try {
        const results = await searchNominatim(val);
        setSuggestions(results);
      } catch (_) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 180); // 180ms debounce — feels near-instant
  };

  const handleSelect = (item) => {
    // Use "main, secondary" as the display value for clarity
    const selected = item.secondary ? `${item.main}, ${item.secondary}` : item.main;
    setQuery(selected);
    onChange(selected);
    setSuggestions([]); setOpen(false);
  };

  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="places-wrapper" ref={wrapperRef}>
        <input
          className="booking-input"
          placeholder={placeholder}
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
          autoComplete="off"
          style={error ? { border: "1px solid rgba(192,57,43,0.5)" } : {}}
        />
        {open && (
          <div className="places-dropdown">
            {loading ? (
              <div className="places-loading">Searching…</div>
            ) : suggestions.length === 0 ? (
              <div className="places-loading">No results — try a different name or pincode</div>
            ) : (
              suggestions.map((item) => (
                <div key={item.id} className="places-item" onMouseDown={() => handleSelect(item)}>
                  <span className="places-item-icon">📍</span>
                  <div>
                    <div className="places-item-main">{item.main}</div>
                    {item.secondary && <div className="places-item-sub">{item.secondary}</div>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {error && <span style={{ fontSize: "11px", color: "#c0392b", marginTop: "5px", display: "block" }}>{error}</span>}
    </div>
  );
}

/* ─── HOOKS ─── */
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

/* ─── REVIEWS STORAGE ─── */
const REVIEWS_KEY = "pioneer_reviews_v1";
function loadReviews() {
  try { return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || []; } catch { return []; }
}
function saveReviews(r) { try { localStorage.setItem(REVIEWS_KEY, JSON.stringify(r)); } catch {} }

/* ════════════════════════════════
   HISTORY / NAVIGATION HOOK
════════════════════════════════ */
function usePageHistory(initialPage = "home") {
  const [history, setHistory] = useState([initialPage]);
  const [index, setIndex] = useState(0);

  const page = history[index];

  const navigate = useCallback((newPage) => {
    if (newPage === history[index]) return;
    setHistory(prev => {
      const newHistory = prev.slice(0, index + 1);
      return [...newHistory, newPage];
    });
    setIndex(prev => prev + 1);
  }, [history, index]);

  const canGoBack = index > 0;

  const goBack = useCallback(() => {
    if (canGoBack) setIndex(prev => prev - 1);
  }, [canGoBack]);

  useEffect(() => {
    const handleKeydown = (e) => {
      const inInput = ["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName);
      if (e.altKey && e.key === "ArrowLeft" && !inInput) {
        e.preventDefault();
        if (index > 0) setIndex(prev => prev - 1);
      }
      if (e.altKey && e.key === "ArrowRight" && !inInput) {
        e.preventDefault();
        if (index < history.length - 1) setIndex(prev => prev + 1);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [index, history.length]);

  useEffect(() => {
    let startX = 0; let startY = 0;
    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = Math.abs(e.changedTouches[0].clientY - startY);
      if (startX < 60 && dx > 80 && dy < 60) {
        if (index > 0) setIndex(prev => prev - 1);
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [index]);

  return { page, navigate, goBack, canGoBack };
}

/* ════════════════════════════════
   NAVBAR
════════════════════════════════ */
function Navbar({ page, setPage, goBack, canGoBack }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = (p) => { setPage(p); setMenuOpen(false); };
  const navItems = [
    { key: "services", label: "Services" },
    { key: "driver",   label: "Driver On Demand" },
    { key: "fleet",    label: "Fleet" },
  ];
  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100,
        padding: "0 32px",
        background: scrolled ? "rgba(245,240,232,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? `1px solid ${border}` : "1px solid transparent",
        transition: "all 0.5s ease",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "70px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {canGoBack && (
            <button
              onClick={goBack}
              aria-label="Go back"
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "34px", height: "34px", borderRadius: "50%",
                color: textMuted, transition: "color 0.3s, background 0.3s",
                marginRight: "2px",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = gold; e.currentTarget.style.background = "rgba(166,124,60,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = textMuted; e.currentTarget.style.background = "none"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>
          )}
          <button onClick={() => go("home")} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Manrope', sans-serif", fontWeight: 300,
            fontSize: "clamp(12px,3vw,16px)", letterSpacing: "5px",
            color: textPrimary, textTransform: "uppercase", whiteSpace: "nowrap",
          }}>
            PIONEER <span style={{ color: gold }}>TRAVELS</span>
          </button>
        </div>
        <nav className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {navItems.map(n => (
            <button key={n.key} className="nav-link" onClick={() => go(n.key)}
              style={{ color: page === n.key ? gold : undefined }}>{n.label}</button>
          ))}
          <button className="btn-gold nav-link" onClick={() => go("contact")}
            style={{ padding: "10px 22px", borderRadius: "100px", color: "#fff" }}>
            Book Now
          </button>
        </nav>
        <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </header>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {[...navItems, { key: "contact", label: "Book Now" }].map(n => (
          <button key={n.key} onClick={() => go(n.key)} style={{ color: page === n.key ? gold : textPrimary }}>
            {n.label}
          </button>
        ))}
        <a href="tel:+919917600079" style={{ textDecoration: "none", marginTop: "8px" }}>
          <span className="btn-gold" style={{ padding: "13px 32px", borderRadius: "100px", fontSize: "13px" }}>Call Now</span>
        </a>
      </div>
    </>
  );
}

/* ─── WHATSAPP ─── */
function WhatsApp() {
  return (
    <a href="https://wa.me/919917600079" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
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
        <span key={i} style={{ fontSize: size, color: i <= rating ? gold : "rgba(166,124,60,0.2)" }}>★</span>
      ))}
    </div>
  );
}

/* ─── REVIEWS SECTION ─── */
function ReviewsSection() {
  const ref = useFadeUp(); const formRef = useFadeUp();
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState(""); const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0); const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false); const [error, setError] = useState("");
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
    <section className="section-pad" style={{ borderTop: `1px solid ${border}`, background: bgDark }}>
      <div ref={ref} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <div className="tag" style={{ marginBottom: "12px" }}>Client Experiences</div>
          <div className="divider-gold" style={{ margin: "12px auto 22px" }} />
          <h2 className="serif" style={{ fontSize: "clamp(32px,4.5vw,52px)", fontWeight: 400, color: textPrimary }}>What Our Clients Say</h2>
        </div>
        {topReviews.length > 0 && (
          <div className="reviews-grid" style={{ marginBottom: "56px" }}>
            {topReviews.map(r => (
              <div key={r.id} className="card-hover" style={{ padding: "30px 26px", background: bgCard, border: `1px solid ${border}`, borderRadius: "20px", boxShadow: "0 4px 20px rgba(160,120,60,0.06)" }}>
                <StarDisplay rating={r.rating} size={17} />
                <p className="serif" style={{ fontSize: "18px", fontStyle: "italic", color: textPrimary, lineHeight: "1.65", margin: "16px 0 18px", fontWeight: 300 }}>"{r.text}"</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: gold }}>{r.name}</span>
                  <span style={{ fontSize: "11px", color: textMuted }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {topReviews.length === 0 && (
          <div style={{ textAlign: "center", padding: "36px", color: textMuted, marginBottom: "36px", fontSize: "14px" }}>Be the first to share your experience</div>
        )}
        <div ref={formRef} className="fade-up" style={{ maxWidth: "580px", margin: "0 auto", background: bgCard, border: `1px solid ${border}`, borderRadius: "22px", padding: "36px 32px", boxShadow: "0 4px 24px rgba(160,120,60,0.07)" }}>
          <h3 className="serif" style={{ fontSize: "24px", fontWeight: 400, color: gold, marginBottom: "24px" }}>Share Your Experience</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <input className="review-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} maxLength={50} />
            <div>
              <div style={{ fontSize: "10px", color: textMuted, marginBottom: "9px", letterSpacing: "1.5px", textTransform: "uppercase" }}>Your Rating</div>
              <div style={{ display: "flex", gap: "5px" }}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={`star ${(hover||rating) >= i ? "active" : ""}`} onClick={() => setRating(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}>★</span>
                ))}
              </div>
            </div>
            <textarea className="review-input" placeholder="Tell us about your journey..." value={text} onChange={e => setText(e.target.value)} rows={4} maxLength={400} style={{ resize: "none" }} />
            {error && <p style={{ fontSize: "13px", color: "#c0392b", fontWeight: 300 }}>{error}</p>}
            {submitted && <p style={{ fontSize: "13px", color: "#27ae60", fontWeight: 300 }}>Thank you — your review has been submitted.</p>}
            <button className="btn-gold" onClick={handleSubmit} style={{ padding: "13px 30px", borderRadius: "100px", fontSize: "12px", width: "fit-content" }}>Submit Review</button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════
   DRIVER ON DEMAND PAGE
════════════════════════════════ */
function DriverPage() {
  const r1 = useFadeUp(); const r2 = useFadeUp();
  const [tripType, setTripType] = useState("oneway");
  const [transmission, setTransmission] = useState("manual");
  const [pickup, setPickup] = useState(""); const [drop, setDrop] = useState("");
  const [pickupDate, setPickupDate] = useState(""); const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState(""); const [returnTime, setReturnTime] = useState("");
  const [name, setName] = useState(""); const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false); const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!phone.trim() || phone.trim().length < 10) e.phone = "Valid phone number required";
    if (!pickup.trim()) e.pickup = "Pickup location required";
    if (!drop.trim()) e.drop = "Drop location required";
    if (!pickupDate) e.pickupDate = "Pickup date required";
    if (!pickupTime) e.pickupTime = "Pickup time required";
    if (tripType === "roundtrip" && !returnDate) e.returnDate = "Return date required";
    if (tripType === "roundtrip" && !returnTime) e.returnTime = "Return time required";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const buildWhatsAppMessage = () => {
    const lines = [
      "🚗 *Driver On Demand Request*", "─────────────────",
      `*Name:* ${name}`, `*Phone:* ${phone}`,
      `*Trip Type:* ${tripType === "oneway" ? "One Way" : "Round Trip"}`,
      `*Transmission:* ${transmission === "manual" ? "Manual" : "Automatic"}`, "",
      `*Pickup:* ${pickup}`, `*Drop:* ${drop}`,
      `*Date:* ${pickupDate}`, `*Time:* ${pickupTime}`,
      tripType === "roundtrip" ? `*Return Date:* ${returnDate}` : null,
      tripType === "roundtrip" ? `*Return Time:* ${returnTime}` : null,
      "─────────────────", "Please confirm pricing and availability.",
    ].filter(Boolean);
    return encodeURIComponent(lines.join("\n"));
  };

  const handleRequest = () => {
    if (!validate()) return;
    setSubmitted(true);
    setTimeout(() => { window.open(`https://wa.me/919917600079?text=${buildWhatsAppMessage()}`, "_blank"); }, 600);
  };

  const cardBg = { background: bgCard, border: `1px solid ${border}`, borderRadius: "28px", overflow: "visible", boxShadow: "0 8px 40px rgba(160,120,60,0.08)" };

  if (submitted) {
    return (
      <div style={{ paddingTop: "70px", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: bg }}>
        <div className="pop-in" style={{ textAlign: "center", padding: "40px 32px", maxWidth: "480px" }}>
          <div style={{ fontSize: "56px", color: gold, marginBottom: "24px" }}>✓</div>
          <h2 className="serif" style={{ fontSize: "36px", fontWeight: 400, color: textPrimary, marginBottom: "12px" }}>Request Sent</h2>
          <p style={{ color: textSecondary, fontSize: "15px", lineHeight: "1.8", marginBottom: "32px", fontWeight: 300 }}>
            Opening WhatsApp with your booking details. Our team will confirm pricing shortly.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:+919917600079" style={{ textDecoration: "none" }}>
              <button className="btn-gold" style={{ padding: "13px 28px", borderRadius: "100px" }}>Call Us Instead</button>
            </a>
            <button className="btn-outline" onClick={() => setSubmitted(false)} style={{ padding: "13px 28px", borderRadius: "100px" }}>New Request</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "70px" }}>
      <section className="section-pad" style={{ background: bg }}>
        <div ref={r1} className="fade-up" style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={cardBg}>
            <div style={{ padding: "28px 36px", borderBottom: `1px solid ${border}`, background: "rgba(166,124,60,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", borderRadius: "28px 28px 0 0" }}>
              <h2 className="serif" style={{ fontSize: "26px", fontWeight: 400, color: textPrimary }}>Book a Driver</h2>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className={`driver-tab ${tripType === "oneway" ? "active" : ""}`} onClick={() => setTripType("oneway")}>One Way</button>
                <button className={`driver-tab ${tripType === "roundtrip" ? "active" : ""}`} onClick={() => setTripType("roundtrip")}>Round Trip</button>
              </div>
            </div>

            <div style={{ padding: "32px 36px", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <label className="field-label">Car Transmission</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button className={`trans-btn ${transmission === "manual" ? "active" : ""}`} onClick={() => setTransmission("manual")}>⚙ Manual</button>
                  <button className={`trans-btn ${transmission === "automatic" ? "active" : ""}`} onClick={() => setTransmission("automatic")}>◈ Automatic</button>
                </div>
              </div>
              <div className="booking-grid">
                <div>
                  <label className="field-label">Your Name</label>
                  <input className="booking-input" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} style={errors.name ? { border: "1px solid rgba(192,57,43,0.5)" } : {}} />
                  {errors.name && <span style={{ fontSize: "11px", color: "#c0392b", marginTop: "5px", display: "block" }}>{errors.name}</span>}
                </div>
                <div>
                  <label className="field-label">Phone Number</label>
                  <input className="booking-input" placeholder="+91 XXXXX XXXXX" value={phone} type="tel" onChange={e => setPhone(e.target.value)} style={errors.phone ? { border: "1px solid rgba(192,57,43,0.5)" } : {}} />
                  {errors.phone && <span style={{ fontSize: "11px", color: "#c0392b", marginTop: "5px", display: "block" }}>{errors.phone}</span>}
                </div>
              </div>

              <LocationInput
                label="Pickup Location"
                placeholder="Enter pickup address or area"
                value={pickup}
                onChange={setPickup}
                error={errors.pickup}
                apiKey={GOOGLE_MAPS_API_KEY}
              />
              <LocationInput
                label="Drop Location"
                placeholder="Enter drop address or area"
                value={drop}
                onChange={setDrop}
                error={errors.drop}
                apiKey={GOOGLE_MAPS_API_KEY}
              />

              <div>
                <label className="field-label">{tripType === "roundtrip" ? "Pickup Date & Time" : "Date & Time"}</label>
                <div className="booking-grid">
                  <div>
                    <input className="booking-input" type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} style={errors.pickupDate ? { border: "1px solid rgba(192,57,43,0.5)", colorScheme: "light" } : { colorScheme: "light" }} />
                    {errors.pickupDate && <span style={{ fontSize: "11px", color: "#c0392b", marginTop: "5px", display: "block" }}>{errors.pickupDate}</span>}
                  </div>
                  <div>
                    <input className="booking-input" type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} style={errors.pickupTime ? { border: "1px solid rgba(192,57,43,0.5)", colorScheme: "light" } : { colorScheme: "light" }} />
                    {errors.pickupTime && <span style={{ fontSize: "11px", color: "#c0392b", marginTop: "5px", display: "block" }}>{errors.pickupTime}</span>}
                  </div>
                </div>
              </div>
              {tripType === "roundtrip" && (
                <div>
                  <label className="field-label">Return Date & Time</label>
                  <div className="booking-grid">
                    <div>
                      <input className="booking-input" type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} style={errors.returnDate ? { border: "1px solid rgba(192,57,43,0.5)", colorScheme: "light" } : { colorScheme: "light" }} />
                      {errors.returnDate && <span style={{ fontSize: "11px", color: "#c0392b", marginTop: "5px", display: "block" }}>{errors.returnDate}</span>}
                    </div>
                    <div>
                      <input className="booking-input" type="time" value={returnTime} onChange={e => setReturnTime(e.target.value)} style={errors.returnTime ? { border: "1px solid rgba(192,57,43,0.5)", colorScheme: "light" } : { colorScheme: "light" }} />
                      {errors.returnTime && <span style={{ fontSize: "11px", color: "#c0392b", marginTop: "5px", display: "block" }}>{errors.returnTime}</span>}
                    </div>
                  </div>
                </div>
              )}
              <div style={{ height: "1px", background: border }} />
              <div style={{ padding: "14px 18px", background: "rgba(166,124,60,0.07)", border: `1px solid ${borderGold}`, borderRadius: "10px", fontSize: "13px", color: textSecondary, lineHeight: "1.7", fontWeight: 300 }}>
                ℹ Pricing will be discussed and confirmed via WhatsApp based on your route and requirements.
              </div>
              <button className="btn-gold" onClick={handleRequest} style={{ width: "100%", padding: "17px", borderRadius: "14px", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor">
                  <path d="M19.11 17.21c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.15-.19.29-.74.94-.91 1.13-.17.19-.33.22-.62.07-.29-.14-1.22-.45-2.32-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.13-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.44 0 1.44 1.04 2.82 1.19 3.02.14.19 2.04 3.11 4.95 4.36.69.3 1.24.47 1.66.6.7.22 1.34.19 1.84.11.56-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.11-.26-.18-.55-.33z"/>
                  <path d="M16.01 3C8.83 3 3 8.83 3 16c0 2.53.74 5 2.13 7.11L3 29l6.08-2.07A12.93 12.93 0 0016.01 29C23.18 29 29 23.17 29 16S23.18 3 16.01 3zm0 23.67c-2.07 0-4.09-.56-5.85-1.62l-.42-.25-3.61 1.23 1.18-3.52-.27-.44A10.61 10.61 0 015.33 16c0-5.88 4.79-10.67 10.68-10.67 2.85 0 5.52 1.11 7.53 3.12A10.57 10.57 0 0126.67 16c0 5.89-4.79 10.67-10.66 10.67z"/>
                </svg>
                Send Request via WhatsApp
              </button>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "12px", color: textMuted, letterSpacing: "1px" }}>OR</span>
              </div>
              <a href="tel:+919917600079" style={{ textDecoration: "none" }}>
                <button className="btn-outline" style={{ width: "100%", padding: "15px", borderRadius: "14px", fontSize: "13px" }}>Call +91 99176 00079</button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ borderTop: `1px solid ${border}`, background: bgDark }}>
        <div ref={r2} className="fade-up" style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="tag" style={{ marginBottom: "12px" }}>Simple Process</div>
            <div className="divider-gold" style={{ margin: "12px auto 22px" }} />
            <h2 className="serif" style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 400, color: textPrimary }}>How It Works</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "2px", border: `1px solid ${border}`, borderRadius: "18px", overflow: "hidden", boxShadow: "0 4px 24px rgba(160,120,60,0.06)" }}>
            {[
              { n: "01", t: "Fill the form", d: "Enter your route, timing & car type" },
              { n: "02", t: "Send on WhatsApp", d: "Details go directly to our team" },
              { n: "03", t: "Get a quote", d: "We confirm pricing & availability" },
              { n: "04", t: "Driver assigned", d: "A verified driver arrives at your location" },
            ].map((s, i, arr) => (
              <div key={s.n} style={{ padding: "36px 22px", textAlign: "center", background: bgCard, borderRight: i < arr.length - 1 ? `1px solid ${border}` : "none" }}>
                <div className="serif" style={{ fontSize: "36px", fontWeight: 300, color: gold, lineHeight: 1, marginBottom: "12px" }}>{s.n}</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: textPrimary, marginBottom: "6px" }}>{s.t}</div>
                <div style={{ fontSize: "12px", color: textMuted, fontWeight: 300, lineHeight: "1.6" }}>{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ borderTop: `1px solid ${border}`, textAlign: "center", background: bg }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="tag" style={{ marginBottom: "14px" }}>Pioneer Travels</div>
          <div className="divider-gold" style={{ margin: "14px auto 24px" }} />
          <h2 className="serif" style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 400, color: textPrimary, lineHeight: 1.05, marginBottom: "16px" }}>
            Driver <span style={{ fontStyle: "italic", color: gold }}>On Demand</span>
          </h2>
          <p style={{ color: textSecondary, fontSize: "15px", maxWidth: "520px", margin: "0 auto", fontWeight: 300, lineHeight: 1.8 }}>
            We provide a professional, verified driver for your own vehicle — manual or automatic. Share your details above and we will confirm pricing on WhatsApp.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ════════════════════════════════
   HOME PAGE
════════════════════════════════ */
function HomePage({ setPage }) {
  const heroRef = useRef(null);
  const s2 = useFadeUp(); const s3 = useFadeUp(); const s4 = useFadeUp();
  useEffect(() => { const el = heroRef.current; if (!el) return; setTimeout(() => el.classList.add("visible"), 120); }, []);
  const services = [
    { icon: "✈", title: "Airport Transfers", desc: "Precision pickup and drop with real-time flight tracking." },
    { icon: "→", title: "One Way Drop", desc: "Efficient intercity transfers with fixed transparent pricing." },
    { icon: "◎", title: "Outstation Cabs", desc: "Long-distance travel in supreme comfort across North India." },
    { icon: "◆", title: "Bus / Tempo Traveller", desc: "Group travel solutions for any occasion." },
    { icon: "⬡", title: "Local Taxi Services", desc: "On-demand city rides with professional chauffeurs." },
    { icon: "◈", title: "Driver On Demand", desc: "Professional driver for your own car — any transmission, any route.", isDriver: true },
  ];
  return (
    <div>
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.35)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(245,240,232,0.88) 40%, rgba(245,240,232,0.5) 100%)" }} />
        <div className="shimmer" style={{ position: "absolute", top: "-80px", right: "-80px", width: "480px", height: "480px", borderRadius: "50%", background: "radial-gradient(circle, rgba(166,124,60,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div ref={heroRef} className="fade-up" style={{ position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: "0 32px", paddingTop: "80px", width: "100%" }}>
          <div className="hero-grid">
            <div>
              <div className="tag" style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "20px", height: "1px", background: gold }} />
                Chandigarh · Delhi · Pan India
              </div>
              <h1 className="serif" style={{ fontSize: "clamp(44px,7vw,78px)", fontWeight: 400, lineHeight: 1.05, color: textPrimary, marginBottom: "22px" }}>
                Executive<br /><span style={{ fontStyle: "italic", color: gold }}>Mobility</span><br />Redefined
              </h1>
              <p style={{ fontSize: "clamp(14px,1.6vw,16px)", lineHeight: "1.8", color: textSecondary, maxWidth: "400px", marginBottom: "36px", fontWeight: 300 }}>
                Premium chauffeur services across North India — airport transfers, outstation cabs, and executive travel with precision.
              </p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                <button className="btn-gold" onClick={() => setPage("contact")} style={{ padding: "15px 32px", borderRadius: "100px" }}>Reserve a Ride</button>
                <button className="btn-outline" onClick={() => setPage("driver")} style={{ padding: "15px 32px", borderRadius: "100px" }}>Driver On Demand</button>
              </div>
              <div className="hero-stats" style={{ marginTop: "48px", paddingTop: "36px", borderTop: `1px solid ${border}` }}>
                {[["25+","Years Experience"],["24/7","Available"],["100%","Professional"]].map(([n,l]) => (
                  <div key={l}>
                    <div className="serif" style={{ fontSize: "clamp(24px,3.5vw,32px)", fontWeight: 500, color: gold, lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: "11px", color: textMuted, marginTop: "5px" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-right float" style={{ background: "rgba(255,255,255,0.75)", border: `1px solid ${border}`, borderRadius: "26px", padding: "36px", backdropFilter: "blur(20px)", boxShadow: "0 8px 40px rgba(160,120,60,0.1)" }}>
              <h3 className="serif" style={{ fontSize: "26px", fontWeight: 400, color: gold, marginBottom: "28px" }}>Our Services</h3>
              <div>
                {services.map((s, i) => (
                  <button key={s.title} onClick={() => setPage(s.isDriver ? "driver" : "contact")} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 0", background: "none", border: "none", cursor: "pointer", borderBottom: i < services.length - 1 ? `1px solid ${border}` : "none", transition: "color 0.3s", color: textPrimary }}
                    onMouseEnter={e => { e.currentTarget.style.color = gold; }} onMouseLeave={e => { e.currentTarget.style.color = textPrimary; }}>
                    <span style={{ fontSize: "14px", fontWeight: 300, fontFamily: "'Manrope',sans-serif" }}>{s.title}</span>
                    <span style={{ color: gold, fontSize: "15px" }}>→</span>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: "26px", display: "flex", gap: "10px" }}>
                <a href="tel:+919917600079" style={{ textDecoration: "none", flex: 1 }}>
                  <button className="btn-gold" style={{ width: "100%", padding: "12px", borderRadius: "10px", fontSize: "12px" }}>+91 99176 00079</button>
                </a>
                <a href="https://wa.me/919917600079" style={{ textDecoration: "none", flex: 1 }}>
                  <button className="btn-outline" style={{ width: "100%", padding: "12px", borderRadius: "10px", fontSize: "12px" }}>WhatsApp</button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: textMuted, textTransform: "uppercase" }}>Scroll</div>
          <div style={{ width: "1px", height: "36px", background: `linear-gradient(to bottom, transparent, ${gold}, transparent)` }} />
        </div>
      </section>

      <section className="section-pad" style={{ background: bgDark }}>
        <div ref={s2} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div className="tag" style={{ marginBottom: "12px" }}>What We Offer</div>
            <div className="divider-gold" style={{ margin: "12px auto 22px" }} />
            <h2 className="serif" style={{ fontSize: "clamp(34px,4.5vw,54px)", fontWeight: 400, color: textPrimary }}>Tailored for Every Journey</h2>
          </div>
          <div className="service-grid">
            {services.map(s => (
              <button key={s.title} onClick={() => setPage(s.isDriver ? "driver" : "contact")} className="card-hover service-card-btn"
                style={{ padding: "30px 22px", background: bgCard, border: `1px solid ${border}`, borderRadius: "18px", cursor: "pointer", textAlign: "left", width: "100%", color: textPrimary, boxShadow: "0 2px 12px rgba(160,120,60,0.05)" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", border: `1px solid ${borderGold}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "18px", background: "rgba(166,124,60,0.06)" }}>
                  <span style={{ fontSize: "18px", color: gold }}>{s.icon}</span>
                </div>
                <h3 className="serif" style={{ fontSize: "20px", fontWeight: 500, color: textPrimary, marginBottom: "9px" }}>{s.title}</h3>
                <p style={{ fontSize: "13px", lineHeight: "1.7", color: textSecondary, fontWeight: 300 }}>{s.desc}</p>
                <div style={{ marginTop: "16px", fontSize: "11px", color: gold, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  {s.isDriver ? "Book a Driver →" : "Book Now →"}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad" style={{ background: bg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div ref={s3} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div className="tag" style={{ marginBottom: "12px" }}>Transparent Pricing</div>
            <div className="divider-gold" style={{ margin: "12px auto 22px" }} />
            <h2 className="serif" style={{ fontSize: "clamp(30px,4vw,50px)", fontWeight: 400, color: textPrimary, marginBottom: "10px" }}>Chandigarh ↔ Delhi</h2>
            <p style={{ color: textMuted, fontSize: "14px" }}>One-way executive rates. No hidden charges.</p>
          </div>
          <div className="rates-grid">
            <div style={{ border: `1px solid ${border}`, borderRadius: "22px", padding: "36px", background: bgCard, boxShadow: "0 4px 20px rgba(160,120,60,0.06)", transition: "border-color 0.4s, transform 0.4s, box-shadow 0.4s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = borderGold; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(160,120,60,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(160,120,60,0.06)"; }}>
              <div className="tag" style={{ marginBottom: "14px" }}>Executive Sedan</div>
              <h3 className="serif" style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 400, color: textPrimary, marginBottom: "6px" }}>Etios · Aura · Dzire</h3>
              <p style={{ color: textMuted, fontSize: "13px", marginBottom: "26px" }}>4 passengers · Comfortable & reliable</p>
              <div style={{ borderTop: `1px solid ${border}`, paddingTop: "22px", display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span className="price-tag">₹3,499</span>
                <button className="onwards-link" onClick={() => setPage("contact")} style={{ color: textMuted, fontSize: "14px", background: "none", border: "none", fontFamily: "'Manrope',sans-serif", cursor: "pointer" }}>onwards ↗</button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {[
                { tag: "SUV / MPV", name: "Toyota Innova Crysta", spec: "7 passengers · Premium spacious", price: "₹5,499" },
                { tag: "SUV / MPV", name: "Ertiga / Rumion", spec: "6 passengers · Versatile family SUV", price: "₹4,499" },
              ].map(item => (
                <div key={item.name} style={{ border: `1px solid ${border}`, borderRadius: "22px", padding: "28px", background: bgCard, flex: 1, boxShadow: "0 4px 20px rgba(160,120,60,0.06)", transition: "border-color 0.4s, transform 0.4s, box-shadow 0.4s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = borderGold; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(160,120,60,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(160,120,60,0.06)"; }}>
                  <div className="tag" style={{ marginBottom: "10px" }}>{item.tag}</div>
                  <h3 className="serif" style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 400, color: textPrimary, marginBottom: "4px" }}>{item.name}</h3>
                  <p style={{ color: textMuted, fontSize: "12px", marginBottom: "18px" }}>{item.spec}</p>
                  <div style={{ borderTop: `1px solid ${border}`, paddingTop: "16px", display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span className="price-tag" style={{ fontSize: "32px" }}>{item.price}</span>
                    <button className="onwards-link" onClick={() => setPage("contact")} style={{ color: textMuted, fontSize: "13px", background: "none", border: "none", fontFamily: "'Manrope',sans-serif", cursor: "pointer" }}>onwards ↗</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ReviewsSection />

      <section className="section-pad" style={{ textAlign: "center", background: bg }}>
        <div ref={s4} className="fade-up" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="tag" style={{ marginBottom: "18px" }}>Ready to Travel?</div>
          <h2 className="serif" style={{ fontSize: "clamp(36px,5vw,62px)", fontWeight: 400, lineHeight: 1.05, color: textPrimary, marginBottom: "20px" }}>
            Experience the Difference<br /><span style={{ fontStyle: "italic", color: gold }}>Firsthand</span>
          </h2>
          <p style={{ color: textSecondary, fontSize: "15px", lineHeight: "1.8", marginBottom: "38px", fontWeight: 300 }}>Call us directly for instant booking. Available 24/7.</p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="tel:+919917600079" style={{ textDecoration: "none" }}>
              <button className="btn-gold" style={{ padding: "16px 40px", borderRadius: "100px" }}>Call +91 99176 00079</button>
            </a>
            <a href="https://wa.me/919917600079" style={{ textDecoration: "none" }}>
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
    { title: "City to City", subtitle: "Executive intercity transfers between major cities across North India.", items: ["Executive Sedan — Toyota Etios, Maruti Dzire, Hyundai Aura", "Executive SUV / MPV — Innova Crysta, Ertiga, Rumion", "Luxury Fleet — Mercedes, BMW, Audi"] },
    { title: "Intra City", subtitle: "Premium local rides within Chandigarh and Delhi NCR.", items: ["Executive Sedan", "Executive SUV / MPV", "Luxury Fleet"] },
    { title: "Airport Transfers", subtitle: "Seamless airport pickup and drop with real-time flight tracking.", items: ["Executive Sedan", "Executive SUV / MPV", "Luxury Fleet"] },
  ];
  return (
    <div style={{ paddingTop: "70px" }}>
      <section className="section-pad" style={{ textAlign: "center", background: "linear-gradient(180deg, rgba(166,124,60,0.08) 0%, transparent 100%)", borderBottom: `1px solid ${border}` }}>
        <div ref={r1} className="fade-up">
          <div className="tag" style={{ marginBottom: "14px" }}>Pioneer Travels</div>
          <div className="divider-gold" style={{ margin: "14px auto 24px" }} />
          <h1 className="serif" style={{ fontSize: "clamp(42px,6vw,68px)", fontWeight: 400, color: textPrimary, marginBottom: "16px" }}>Our Services</h1>
          <p style={{ color: textSecondary, fontSize: "15px", maxWidth: "500px", margin: "0 auto", fontWeight: 300, lineHeight: 1.8 }}>A complete suite of executive mobility solutions for every occasion.</p>
        </div>
      </section>
      <section className="section-pad" style={{ background: bg }}>
        <div ref={r2} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="services-cat-grid">
            {categories.map(cat => (
              <button key={cat.title} onClick={() => setPage("contact")} className="card-hover"
                style={{ padding: "40px 32px", background: bgCard, border: `1px solid ${border}`, borderRadius: "22px", cursor: "pointer", textAlign: "left", width: "100%", color: textPrimary, boxShadow: "0 4px 20px rgba(160,120,60,0.05)" }}>
                <div style={{ width: "28px", height: "1px", background: gold, marginBottom: "22px" }} />
                <h2 className="serif" style={{ fontSize: "30px", fontWeight: 400, color: gold, marginBottom: "10px" }}>{cat.title}</h2>
                <p style={{ fontSize: "13px", color: textSecondary, marginBottom: "26px", lineHeight: "1.7", fontWeight: 300 }}>{cat.subtitle}</p>
                <div>
                  {cat.items.map((item, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 0", borderBottom: j < cat.items.length - 1 ? `1px solid ${border}` : "none" }}>
                      <span style={{ color: gold, fontSize: "9px", marginTop: "5px" }}>◆</span>
                      <span style={{ fontSize: "13px", color: textPrimary, fontWeight: 300, lineHeight: "1.5" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "22px", fontSize: "11px", color: gold, letterSpacing: "1.5px", textTransform: "uppercase" }}>Book Now →</div>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad" style={{ borderTop: `1px solid ${border}`, background: bgDark }}>
        <div ref={r3} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div className="tag" style={{ marginBottom: "12px" }}>Specialised Services</div>
            <div className="divider-gold" style={{ margin: "12px auto 20px" }} />
            <h2 className="serif" style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 400, color: textPrimary }}>More Ways to Move</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "24px" }}>
            {[
              { icon: "◈", title: "Driver On Demand", desc: "Professional driver for your own vehicle — manual or automatic. Share your route and timing, we confirm pricing on WhatsApp.", cta: "Book a Driver", page: "driver" },
              { icon: "⬡", title: "Bus / Tempo Traveller", desc: "Group travel solutions for corporate outings, family trips, and large events. Various seating capacities available.", cta: "Book Group Travel", page: "contact" },
            ].map(s => (
              <div key={s.title} style={{ padding: "40px 32px", background: bgCard, border: `1px solid ${borderGold}`, borderRadius: "22px", boxShadow: "0 4px 20px rgba(160,120,60,0.07)" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", border: `1px solid ${borderGold}`, background: "rgba(166,124,60,0.07)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "22px" }}>
                  <span style={{ fontSize: "20px", color: gold }}>{s.icon}</span>
                </div>
                <h3 className="serif" style={{ fontSize: "28px", fontWeight: 400, color: textPrimary, marginBottom: "14px" }}>{s.title}</h3>
                <p style={{ fontSize: "14px", lineHeight: "1.8", color: textSecondary, fontWeight: 300, marginBottom: "28px" }}>{s.desc}</p>
                <button className="btn-gold" onClick={() => setPage(s.page)} style={{ padding: "12px 28px", borderRadius: "100px", fontSize: "12px" }}>{s.cta}</button>
              </div>
            ))}
          </div>
          <div className="stats-grid" style={{ marginTop: "56px", border: `1px solid ${border}`, borderRadius: "18px", overflow: "hidden", boxShadow: "0 4px 20px rgba(160,120,60,0.05)" }}>
            {[["25+","Years of Service"],["24/7","Availability"],["Professional","Chauffeurs"],["Fixed","Transparent Rates"]].map(([n,l],i,arr) => (
              <div key={l} style={{ padding: "38px 20px", textAlign: "center", background: bgCard, borderRight: i < arr.length - 1 ? `1px solid ${border}` : "none" }}>
                <div className="serif" style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 400, color: gold, lineHeight: 1, marginBottom: "8px" }}>{n}</div>
                <div style={{ fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: textMuted }}>{l}</div>
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
    <div className="card-hover" style={{ padding: "22px 18px", background: bgCard, border: `1px solid ${border}`, borderRadius: "14px", boxShadow: "0 2px 10px rgba(160,120,60,0.05)" }}>
      <div style={{ fontSize: "9px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: gold, marginBottom: "9px" }}>{tag}</div>
      <h4 className="serif" style={{ fontSize: "19px", fontWeight: 400, color: textPrimary, marginBottom: "4px" }}>{name}</h4>
      <p style={{ fontSize: "12px", color: textMuted, fontWeight: 300 }}>{spec}</p>
    </div>
  );
  const FleetSection = ({ label, title, vehicles, innerRef, dark }) => (
    <section className="section-pad" style={dark ? { background: bgDark, borderTop: `1px solid ${border}` } : { background: bg, borderTop: `1px solid ${border}` }}>
      <div ref={innerRef} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "44px", flexWrap: "wrap" }}>
          <div>
            <div className="tag" style={{ marginBottom: "6px" }}>{label}</div>
            <h2 className="serif" style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 400, color: textPrimary }}>{title}</h2>
          </div>
          <div style={{ flex: 1, height: "1px", background: border, minWidth: "20px" }} />
        </div>
        <div className="fleet-grid">{vehicles.map(v => <VehicleCard key={v.name} {...v} />)}</div>
      </div>
    </section>
  );
  return (
    <div style={{ paddingTop: "70px" }}>
      <section className="section-pad" style={{ textAlign: "center", background: "linear-gradient(180deg, rgba(166,124,60,0.08) 0%, transparent 100%)", borderBottom: `1px solid ${border}` }}>
        <div ref={r1} className="fade-up">
          <div className="tag" style={{ marginBottom: "14px" }}>Pioneer Travels</div>
          <div className="divider-gold" style={{ margin: "14px auto 24px" }} />
          <h1 className="serif" style={{ fontSize: "clamp(42px,6vw,68px)", fontWeight: 400, color: textPrimary, marginBottom: "16px" }}>Our Fleet</h1>
          <p style={{ color: textSecondary, fontSize: "15px", maxWidth: "460px", margin: "0 auto", fontWeight: 300, lineHeight: 1.8 }}>A curated collection of executive and luxury vehicles for every requirement.</p>
        </div>
      </section>
      <FleetSection label="Fleet Category" title="Executive Fleet" innerRef={r2} vehicles={[
        { name: "Toyota Etios", tag: "Sedan", spec: "4 passengers" },
        { name: "Maruti Dzire", tag: "Sedan", spec: "4 passengers" },
        { name: "Hyundai Aura", tag: "Sedan", spec: "4 passengers" },
        { name: "Honda Amaze", tag: "Sedan", spec: "4 passengers" },
        { name: "Traveller", tag: "Van", spec: "12+ passengers" },
        { name: "Bus", tag: "Coach", spec: "Group travel" },
      ]} />
      <FleetSection label="SUV / MPV" title="SUV & MPV Fleet" innerRef={r3} dark vehicles={[
        { name: "Toyota Innova Crysta", tag: "SUV", spec: "7 passengers" },
        { name: "Maruti Ertiga", tag: "MPV", spec: "6 passengers" },
        { name: "Toyota Rumion", tag: "MPV", spec: "6 passengers" },
        { name: "Kia Carens", tag: "MPV", spec: "6 passengers" },
      ]} />
      <section className="section-pad" style={{ borderTop: `1px solid ${border}`, background: bg }}>
        <div ref={r4} className="fade-up" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "44px", flexWrap: "wrap" }}>
            <div>
              <div className="tag" style={{ marginBottom: "6px" }}>Premium Collection</div>
              <h2 className="serif" style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 400, color: textPrimary }}>Luxury Fleet</h2>
            </div>
            <div style={{ flex: 1, height: "1px", background: border, minWidth: "20px" }} />
          </div>
          <div className="fleet-grid" style={{ marginBottom: "40px" }}>
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
          <div style={{ textAlign: "center", padding: "36px 28px", border: `1px solid ${borderGold}`, borderRadius: "18px", background: "rgba(166,124,60,0.05)", boxShadow: "0 4px 20px rgba(160,120,60,0.06)" }}>
            <p className="serif" style={{ fontSize: "21px", color: textPrimary, fontStyle: "italic", marginBottom: "6px" }}>Additional vehicles available on request</p>
            <p style={{ color: textMuted, fontSize: "13px", marginBottom: "22px", fontWeight: 300 }}>Based on availability and travel requirements</p>
            <button className="btn-gold" onClick={() => setPage("contact")} style={{ padding: "12px 32px", borderRadius: "100px" }}>Contact for Fleet Booking</button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ════════════════════════════════
   CONTACT PAGE — single number only
════════════════════════════════ */
function ContactPage() {
  const r1 = useFadeUp(); const r2 = useFadeUp();
  return (
    <div style={{ paddingTop: "70px" }}>
      <section className="section-pad" style={{ textAlign: "center", background: "linear-gradient(180deg, rgba(166,124,60,0.08) 0%, transparent 100%)", borderBottom: `1px solid ${border}` }}>
        <div ref={r1} className="fade-up">
          <div className="tag" style={{ marginBottom: "14px" }}>Get In Touch</div>
          <div className="divider-gold" style={{ margin: "14px auto 24px" }} />
          <h1 className="serif" style={{ fontSize: "clamp(42px,6vw,68px)", fontWeight: 400, color: textPrimary, marginBottom: "16px" }}>Book a Ride</h1>
          <p style={{ color: textSecondary, fontSize: "15px", maxWidth: "440px", margin: "0 auto", fontWeight: 300, lineHeight: 1.8 }}>Call or WhatsApp for instant booking. Available 24 hours, 7 days a week.</p>
        </div>
      </section>
      <section className="section-pad" style={{ background: bg }}>
        <div ref={r2} className="fade-up" style={{ maxWidth: "780px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* PRIMARY CALL CARD — full width */}
          <a href="tel:+919917600079" style={{ textDecoration: "none" }}>
            <div className="card-hover" style={{ padding: "36px 32px", background: bgCard, border: `1px solid ${borderGold}`, borderRadius: "18px", cursor: "pointer", boxShadow: "0 4px 16px rgba(160,120,60,0.08)" }}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: gold, marginBottom: "12px" }}>Call Us</div>
              <h3 className="serif" style={{ fontSize: "clamp(26px,4vw,36px)", fontWeight: 400, color: textPrimary, marginBottom: "5px" }}>+91 99176 00079</h3>
              <p style={{ fontSize: "12px", color: textMuted, marginBottom: "22px" }}>Tap to call directly · Available 24/7</p>
              <span className="btn-gold" style={{ padding: "10px 28px", borderRadius: "100px", fontSize: "12px" }}>Call Now</span>
            </div>
          </a>

          {/* WHATSAPP CARD */}
          <a href="https://wa.me/919917600079" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <div style={{ padding: "26px 30px", background: "rgba(37,211,102,0.07)", border: "1px solid rgba(37,211,102,0.25)", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", flexWrap: "wrap", gap: "12px", transition: "background 0.3s", boxShadow: "0 4px 16px rgba(37,211,102,0.08)" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(37,211,102,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(37,211,102,0.07)"}>
              <div>
                <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#1a9e4a", marginBottom: "6px" }}>WhatsApp</div>
                <div className="serif" style={{ fontSize: "clamp(18px,3vw,24px)", color: textPrimary, fontWeight: 400 }}>+91 99176 00079</div>
                <div style={{ fontSize: "12px", color: textMuted, marginTop: "3px" }}>Chat with us instantly</div>
              </div>
              <div style={{ background: "#25D366", width: "46px", height: "46px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg viewBox="0 0 32 32" width="22" height="22" fill="white">
                  <path d="M19.11 17.21c-.29-.14-1.7-.84-1.96-.94-.26-.1-.45-.14-.64.15-.19.29-.74.94-.91 1.13-.17.19-.33.22-.62.07-.29-.14-1.22-.45-2.32-1.44-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.59.13-.13.29-.33.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.64-1.55-.88-2.13-.23-.55-.47-.48-.64-.48h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.44 0 1.44 1.04 2.82 1.19 3.02.14.19 2.04 3.11 4.95 4.36.69.3 1.24.47 1.66.6.7.22 1.34.19 1.84.11.56-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.11-.26-.18-.55-.33z"/>
                  <path d="M16.01 3C8.83 3 3 8.83 3 16c0 2.53.74 5 2.13 7.11L3 29l6.08-2.07A12.93 12.93 0 0016.01 29C23.18 29 29 23.17 29 16S23.18 3 16.01 3zm0 23.67c-2.07 0-4.09-.56-5.85-1.62l-.42-.25-3.61 1.23 1.18-3.52-.27-.44A10.61 10.61 0 015.33 16c0-5.88 4.79-10.67 10.68-10.67 2.85 0 5.52 1.11 7.53 3.12A10.57 10.57 0 0126.67 16c0 5.89-4.79 10.67-10.66 10.67z"/>
                </svg>
              </div>
            </div>
          </a>

          <div style={{ textAlign: "center", padding: "34px", background: bgCard, border: `1px solid ${border}`, borderRadius: "18px", boxShadow: "0 4px 16px rgba(160,120,60,0.05)" }}>
            <p className="serif" style={{ fontSize: "22px", color: textPrimary, fontStyle: "italic", marginBottom: "8px" }}>Pioneer Travels</p>
            <p style={{ color: textMuted, fontSize: "13px", lineHeight: "1.8", fontWeight: 300 }}>Available 24 hours · 7 days a week<br />Chandigarh · Delhi · Pan North India</p>
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
    <footer style={{ borderTop: `1px solid ${border}`, padding: "52px 32px 34px", background: "#EDE8DC" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="footer-grid" style={{ marginBottom: "40px" }}>
          <div style={{ maxWidth: "240px" }}>
            <div style={{ fontFamily: "'Manrope',sans-serif", fontWeight: 300, fontSize: "15px", letterSpacing: "5px", color: textPrimary, textTransform: "uppercase", marginBottom: "12px" }}>
              PIONEER <span style={{ color: gold }}>TRAVELS</span>
            </div>
            <p style={{ fontSize: "13px", color: textMuted, lineHeight: "1.7", fontWeight: 300 }}>Executive mobility solutions across North India with over 25 years of trusted service.</p>
          </div>
          <div className="footer-links">
            <div>
              <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: gold, marginBottom: "16px" }}>Navigate</div>
              {[["home","Home"],["services","Services"],["driver","Driver On Demand"],["fleet","Fleet"],["contact","Book Now"]].map(([p,l]) => (
                <div key={p} style={{ marginBottom: "10px" }}>
                  <button onClick={() => setPage(p)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Manrope',sans-serif", fontSize: "13px", color: textMuted, fontWeight: 300, transition: "color 0.3s", padding: 0 }}
                    onMouseEnter={e => e.target.style.color = gold} onMouseLeave={e => e.target.style.color = textMuted}>{l}</button>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: gold, marginBottom: "16px" }}>Contact</div>
              <a href="tel:+919917600079" style={{ textDecoration: "none" }}>
                <div style={{ marginBottom: "10px", fontSize: "13px", color: textMuted, fontWeight: 300 }}>+91 99176 00079</div>
              </a>
              <a href="https://wa.me/919917600079" style={{ textDecoration: "none" }}>
                <div style={{ fontSize: "13px", color: "#1a9e4a", fontWeight: 300 }}>WhatsApp</div>
              </a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${border}`, paddingTop: "20px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
          <p style={{ fontSize: "11px", color: textMuted, fontWeight: 300 }}>© {new Date().getFullYear()} Pioneer Travels. All rights reserved.</p>
          <p style={{ fontSize: "11px", color: textMuted, fontWeight: 300 }}>Chandigarh · Delhi · Pan North India</p>
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════
   ROOT APP
════════════════════════════════ */
export default function PioneerTravels() {
  const { page, navigate, goBack, canGoBack } = usePageHistory("home");
  const topRef = useRef(null);

  const navigateAndScroll = (p) => {
    navigate(p);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth" }), 30);
  };

  return (
    <div ref={topRef} style={{ background: bg, minHeight: "100vh", color: textPrimary, overflowX: "hidden" }}>
      <FontStyle />
      <Navbar page={page} setPage={navigateAndScroll} goBack={goBack} canGoBack={canGoBack} />
      {page === "home"     && <HomePage setPage={navigateAndScroll} />}
      {page === "services" && <ServicesPage setPage={navigateAndScroll} />}
      {page === "driver"   && <DriverPage />}
      {page === "fleet"    && <FleetPage setPage={navigateAndScroll} />}
      {page === "contact"  && <ContactPage />}
      <Footer setPage={navigateAndScroll} />
      <WhatsApp />
    </div>
  );
}