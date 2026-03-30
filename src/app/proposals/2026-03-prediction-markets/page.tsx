"use client";
import { useState, useEffect, useRef } from "react";

const css = `
  .proposal-root {
    --bg:       #060810;
    --surface:  #0D1220;
    --surface2: #111828;
    --border:   #1A2235;
    --accent:   #00D4AA;
    --blue:     #0099FF;
    --gold:     #F5C842;
    --purple:   #A78BFA;
    --red:      #FF4D6D;
    --text:     #F0F4FF;
    --sec:      #8B95B0;
    --muted:    #4A5268;
    --max:      1100px;

    position: fixed;
    inset: 0;
    z-index: 9999;
    overflow-y: auto;
    overflow-x: hidden;
    background: var(--bg);
    font-family: 'Inter', sans-serif;
    color: var(--text);
    line-height: 1.6;
    scroll-behavior: smooth;
  }

  .proposal-root * { margin: 0; padding: 0; box-sizing: border-box; }

  /* ── NOISE OVERLAY ── */
  .proposal-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  /* ── NAV ── */
  .proposal-root nav {
    position: sticky;
    top: 0; left: 0; right: 0;
    z-index: 100;
    background: rgba(6,8,16,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .proposal-root .nav-logo {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--accent);
    letter-spacing: 0.08em;
  }
  .proposal-root .nav-links {
    display: flex;
    gap: 28px;
    list-style: none;
  }
  .proposal-root .nav-links a {
    font-size: 11px;
    color: var(--sec);
    text-decoration: none;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: color 0.2s;
  }
  .proposal-root .nav-links a:hover { color: var(--text); }
  .proposal-root .nav-cta {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    background: var(--accent);
    color: #060810;
    padding: 7px 18px;
    border-radius: 5px;
    text-decoration: none;
    font-weight: 600;
    transition: opacity 0.2s, transform 0.15s;
    letter-spacing: 0.04em;
  }
  .proposal-root .nav-cta:hover { opacity: 0.88; transform: translateY(-1px); }
  .proposal-root .nav-pdf {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--sec);
    padding: 7px 14px;
    border-radius: 5px;
    border: 1px solid var(--border);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s, border-color 0.2s;
    letter-spacing: 0.04em;
  }
  .proposal-root .nav-pdf:hover { color: var(--text); border-color: var(--sec); }

  /* ── LAYOUT ── */
  .proposal-root .container {
    max-width: var(--max);
    margin: 0 auto;
    padding: 0 32px;
  }

  .proposal-root section {
    padding: 80px 0;
    position: relative;
  }

  /* ── HERO ── */
  .proposal-root #hero {
    min-height: auto;
    display: flex;
    align-items: center;
    padding-top: 72px;
    padding-bottom: 56px;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,212,170,0.07) 0%, transparent 70%),
      var(--bg);
    overflow: hidden;
  }

  .proposal-root #hero::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
  }

  .proposal-root .hero-inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    width: 100%;
  }

  .proposal-root .hero-left { min-width: 0; }

  .proposal-root .badges {
    display: flex;
    gap: 6px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .proposal-root .badge {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.1em;
    padding: 4px 12px;
    border-radius: 999px;
    border: 1px solid;
    text-transform: uppercase;
  }
  .proposal-root .badge-teal   { color: var(--accent); border-color: rgba(0,212,170,0.35); background: rgba(0,212,170,0.08); }
  .proposal-root .badge-blue   { color: var(--blue);   border-color: rgba(0,153,255,0.35); background: rgba(0,153,255,0.08); }
  .proposal-root .badge-gold   { color: var(--gold);   border-color: rgba(245,200,66,0.35); background: rgba(245,200,66,0.08); }
  .proposal-root .badge-purple { color: var(--purple); border-color: rgba(167,139,250,0.35); background: rgba(167,139,250,0.08); }

  .proposal-root .hero-name {
    font-family: 'Syne', sans-serif;
    font-size: clamp(36px, 5vw, 52px);
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
    margin-bottom: 10px;
    background: linear-gradient(100deg, #F0F4FF 55%, #00D4AA);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .proposal-root .hero-role {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--accent);
    letter-spacing: 0.06em;
    margin-bottom: 16px;
  }
  .proposal-root .hero-tagline {
    font-size: 17px;
    color: var(--sec);
    max-width: 460px;
    line-height: 1.65;
    margin-bottom: 32px;
  }
  .proposal-root .hero-tagline strong { color: var(--text); font-weight: 500; }

  .proposal-root .hero-contacts {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 36px;
  }
  .proposal-root .hero-contacts a {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--sec);
    text-decoration: none;
    transition: color 0.2s;
  }
  .proposal-root .hero-contacts a:hover { color: var(--accent); }
  .proposal-root .hero-contacts .ci { color: var(--accent); font-size: 11px; }

  .proposal-root .hero-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .proposal-root .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--accent);
    color: #060810;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 600;
    padding: 13px 26px;
    border-radius: 6px;
    text-decoration: none;
    letter-spacing: 0.04em;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 0 24px rgba(0,212,170,0.25);
  }
  .proposal-root .btn-primary:hover {
    opacity: 0.88;
    transform: translateY(-2px);
    box-shadow: 0 6px 32px rgba(0,212,170,0.35);
  }
  .proposal-root .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    padding: 13px 24px;
    border-radius: 6px;
    border: 1px solid var(--border);
    text-decoration: none;
    letter-spacing: 0.04em;
    transition: border-color 0.2s, color 0.2s;
  }
  .proposal-root .btn-secondary:hover { border-color: var(--sec); color: var(--accent); }

  /* right: mock dashboard */
  .proposal-root .hero-right {
    position: relative;
  }
  .proposal-root .mock-dashboard {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,170,0.08);
  }
  .proposal-root .mock-topbar {
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
    padding: 10px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .proposal-root .mock-dots { display: flex; gap: 5px; }
  .proposal-root .mock-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
  }
  .proposal-root .d-red    { background: #FF5F57; }
  .proposal-root .d-yellow { background: #FFBD2E; }
  .proposal-root .d-green  { background: #28CA41; }
  .proposal-root .mock-url {
    flex: 1;
    background: rgba(255,255,255,0.04);
    border-radius: 4px;
    padding: 4px 10px;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--sec);
    border: 1px solid var(--border);
  }
  .proposal-root .mock-body { padding: 16px; }
  .proposal-root .mock-head-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .proposal-root .mock-title {
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
  }
  .proposal-root .mock-live {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--accent);
  }
  .proposal-root .live-dot {
    width: 6px; height: 6px;
    background: var(--accent);
    border-radius: 50%;
    animation: proposal-pulse 1.5s ease-in-out infinite;
  }
  @keyframes proposal-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.8); }
  }
  .proposal-root .mock-row {
    display: grid;
    grid-template-columns: 1fr 70px 60px 70px;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 5px;
    font-size: 10px;
    align-items: center;
    border: 1px solid transparent;
    transition: background 0.2s, border-color 0.2s;
    cursor: default;
  }
  .proposal-root .mock-row:hover { background: rgba(255,255,255,0.03); border-color: var(--border); }
  .proposal-root .mock-row-head {
    font-family: 'DM Mono', monospace;
    font-size: 8px;
    color: var(--muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0 10px 6px;
  }
  .proposal-root .market-name { font-size: 10px; font-weight: 500; color: var(--text); }
  .proposal-root .market-tag {
    font-size: 8px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
  }
  .proposal-root .prob { font-family: 'DM Mono', monospace; font-weight: 500; font-size: 11px; }
  .proposal-root .chg-pos { color: var(--accent); font-size: 9px; font-family: 'DM Mono', monospace; }
  .proposal-root .chg-neg { color: var(--red);    font-size: 9px; font-family: 'DM Mono', monospace; }
  .proposal-root .vol { color: var(--muted); font-size: 9px; font-family: 'DM Mono', monospace; }
  .proposal-root .mini-bar {
    height: 3px; border-radius: 2px; margin-top: 4px;
  }

  /* sparkline */
  .proposal-root .mock-chart {
    margin-top: 12px;
    background: var(--surface2);
    border-radius: 6px;
    padding: 10px 12px;
    border: 1px solid var(--border);
  }
  .proposal-root .chart-label {
    font-family: 'DM Mono', monospace;
    font-size: 8px;
    color: var(--muted);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .proposal-root svg.sparkline { width: 100%; height: 40px; display: block; }
  .proposal-root svg.sparkline path { transition: d 0.7s ease; }

  @keyframes proposal-flash-pos {
    0%   { background: rgba(0,212,170,0.25); }
    100% { background: transparent; }
  }
  @keyframes proposal-flash-neg {
    0%   { background: rgba(255,77,109,0.25); }
    100% { background: transparent; }
  }
  .proposal-root .flash-pos { animation: proposal-flash-pos 0.6s ease; }
  .proposal-root .flash-neg { animation: proposal-flash-neg 0.6s ease; }

  /* ── SECTION EYEBROW ── */
  .proposal-root .eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }
  .proposal-root .eyebrow::before {
    content: '';
    display: block;
    width: 28px; height: 2px;
    background: linear-gradient(90deg, var(--accent), transparent);
    border-radius: 2px;
    box-shadow: 0 0 8px var(--accent);
  }
  .proposal-root .eyebrow-text {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  .proposal-root .section-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(26px, 3vw, 36px);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 40px;
  }

  /* ── STATS ── */
  .proposal-root #stats {
    padding: 40px 0;
    background: var(--surface);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .proposal-root .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }
  .proposal-root .stat-item {
    padding: 28px 36px;
    position: relative;
  }
  .proposal-root .stat-item + .stat-item::before {
    content: '';
    position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 1px;
    background: var(--border);
  }
  .proposal-root .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: clamp(40px, 8vw, 72px);
    font-weight: 800;
    line-height: 1;
    margin-bottom: 6px;
  }
  .proposal-root .sv-teal   { color: var(--accent); }
  .proposal-root .sv-blue   { color: var(--blue); }
  .proposal-root .sv-gold   { color: var(--gold); }
  .proposal-root .stat-label { font-size: 13px; color: var(--sec); }

  /* ── WHY ME ── */
  .proposal-root .exp-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .proposal-root .exp-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px 22px;
    display: flex;
    gap: 14px;
    align-items: flex-start;
    transition: border-color 0.2s, transform 0.2s;
    position: relative;
    overflow: hidden;
  }
  .proposal-root .exp-card:hover { transform: translateY(-2px); }
  .proposal-root .exp-card::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    border-radius: 3px 0 0 3px;
  }
  .proposal-root .ec-teal::before    { background: var(--accent); }
  .proposal-root .ec-teal:hover      { border-color: rgba(0,212,170,0.3); }
  .proposal-root .ec-blue::before    { background: var(--blue); }
  .proposal-root .ec-blue:hover      { border-color: rgba(0,153,255,0.3); }
  .proposal-root .ec-gold::before    { background: var(--gold); }
  .proposal-root .ec-gold:hover      { border-color: rgba(245,200,66,0.3); }
  .proposal-root .ec-purple::before  { background: var(--purple); }
  .proposal-root .ec-purple:hover    { border-color: rgba(167,139,250,0.3); }

  .proposal-root .exp-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 3px;
  }
  .proposal-root .exp-company {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .proposal-root .exp-desc {
    font-size: 12px;
    color: var(--sec);
    line-height: 1.5;
  }

  /* ── NORMALIZATION ── */
  .proposal-root #norm {
    background:
      radial-gradient(ellipse 60% 50% at 50% 100%, rgba(0,153,255,0.05) 0%, transparent 70%),
      var(--bg);
  }
  .proposal-root .norm-question {
    font-size: 14px;
    color: var(--sec);
    background: var(--surface);
    border: 1px solid rgba(245,200,66,0.2);
    border-left: 3px solid var(--gold);
    border-radius: 0 6px 6px 0;
    padding: 14px 18px;
    margin-bottom: 32px;
    font-style: italic;
    line-height: 1.6;
  }
  .proposal-root .norm-question strong { color: var(--gold); font-style: normal; }

  .proposal-root .norm-flow {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    background: var(--border);
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid var(--border);
    margin-bottom: 24px;
  }
  .proposal-root .norm-step {
    background: var(--surface);
    padding: 24px 20px;
    position: relative;
  }
  .proposal-root .norm-step + .norm-step::before {
    content: '→';
    position: absolute;
    left: -10px; top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    font-size: 14px;
    z-index: 1;
  }
  .proposal-root .step-num {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    width: 24px; height: 24px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 12px;
  }
  .proposal-root .step-name {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 6px;
  }
  .proposal-root .step-desc {
    font-size: 11px;
    color: var(--sec);
    line-height: 1.55;
  }

  .proposal-root .ns1 .step-num { background: rgba(0,212,170,0.15); color: var(--accent); }
  .proposal-root .ns1 .step-name { color: var(--accent); }
  .proposal-root .ns2 .step-num { background: rgba(0,153,255,0.15); color: var(--blue); }
  .proposal-root .ns2 .step-name { color: var(--blue); }
  .proposal-root .ns3 .step-num { background: rgba(245,200,66,0.15); color: var(--gold); }
  .proposal-root .ns3 .step-name { color: var(--gold); }
  .proposal-root .ns4 .step-num { background: rgba(167,139,250,0.15); color: var(--purple); }
  .proposal-root .ns4 .step-name { color: var(--purple); }

  .proposal-root .code-header {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px 8px 0 0;
    padding: 10px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .proposal-root .code-header-left {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .proposal-root .code-header-dot {
    width: 9px; height: 9px;
    border-radius: 50%;
    display: inline-block;
  }
  .proposal-root .code-header-title {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--sec);
    margin-left: 4px;
  }
  .proposal-root .code-header-badge {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--accent);
    background: rgba(0,212,170,0.08);
    border: 1px solid rgba(0,212,170,0.25);
    padding: 3px 10px;
    border-radius: 999px;
    letter-spacing: 0.08em;
  }

  .proposal-root .code-snippet {
    background: #070C14;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px 24px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    line-height: 1.8;
    overflow-x: auto;
  }
  .proposal-root .code-snippet .k { color: var(--purple); }
  .proposal-root .code-snippet .fn { color: var(--blue); }
  .proposal-root .code-snippet .str { color: var(--gold); }
  .proposal-root .code-snippet .cm { color: var(--muted); }
  .proposal-root .code-snippet .num { color: var(--accent); }
  .proposal-root .code-snippet .prop { color: var(--text); }

  /* ── TIMELINE ── */
  .proposal-root #timeline {
    background: var(--surface);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .proposal-root .weeks-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
  .proposal-root .week-card {
    background: var(--bg);
    border-radius: 8px;
    padding: 20px 18px;
    border-left: 3px solid;
    border-top: 1px solid var(--border);
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    transition: transform 0.2s;
  }
  .proposal-root .week-card:hover { transform: translateY(-3px); }
  .proposal-root .week-label {
    font-family: 'DM Mono', monospace;
    font-size: 8px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 999px;
    display: inline-block;
    margin-bottom: 10px;
    letter-spacing: 0.06em;
  }
  .proposal-root .week-title {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .proposal-root .week-items { list-style: none; }
  .proposal-root .week-items li {
    font-size: 11px;
    color: var(--sec);
    padding: 4px 0 4px 14px;
    position: relative;
    line-height: 1.45;
  }
  .proposal-root .week-items li::before {
    content: '▸';
    position: absolute;
    left: 0;
    font-size: 9px;
  }

  .proposal-root .w1 { border-left-color: var(--accent); }
  .proposal-root .w1 .week-label { color: var(--accent); background: rgba(0,212,170,0.1); }
  .proposal-root .w1 .week-title { color: var(--accent); }
  .proposal-root .w1 li::before  { color: var(--accent); }

  .proposal-root .w2 { border-left-color: var(--blue); }
  .proposal-root .w2 .week-label { color: var(--blue); background: rgba(0,153,255,0.1); }
  .proposal-root .w2 .week-title { color: var(--blue); }
  .proposal-root .w2 li::before  { color: var(--blue); }

  .proposal-root .w3 { border-left-color: var(--gold); }
  .proposal-root .w3 .week-label { color: var(--gold); background: rgba(245,200,66,0.1); }
  .proposal-root .w3 .week-title { color: var(--gold); }
  .proposal-root .w3 li::before  { color: var(--gold); }

  .proposal-root .w4 { border-left-color: var(--purple); }
  .proposal-root .w4 .week-label { color: var(--purple); background: rgba(167,139,250,0.1); }
  .proposal-root .w4 .week-title { color: var(--purple); }
  .proposal-root .w4 li::before  { color: var(--purple); }

  .proposal-root .warning-box {
    background: rgba(245,200,66,0.05);
    border: 1px solid rgba(245,200,66,0.2);
    border-radius: 7px;
    padding: 14px 18px;
    font-size: 12px;
    color: var(--sec);
    line-height: 1.6;
  }
  .proposal-root .warning-box strong { color: var(--gold); }

  /* ── DELIVERABLES + PRICE ── */
  .proposal-root .pricing-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  .proposal-root .deliverables-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .proposal-root .del-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 13px;
    color: var(--sec);
    line-height: 1.5;
    padding: 12px 14px;
    background: var(--surface);
    border-radius: 6px;
    border: 1px solid var(--border);
    transition: border-color 0.2s;
  }
  .proposal-root .del-item:hover { border-color: rgba(0,212,170,0.2); }
  .proposal-root .del-check {
    width: 20px; height: 20px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .proposal-root .price-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 32px 30px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 60px rgba(0,212,170,0.06);
  }
  .proposal-root .price-card::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 200px; height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,170,0.08), transparent 70%);
    pointer-events: none;
  }
  .proposal-root .price-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .proposal-root .price-value {
    font-family: 'Syne', sans-serif;
    font-size: clamp(42px, 5vw, 64px);
    font-weight: 800;
    color: var(--accent);
    line-height: 1;
    margin-bottom: 8px;
  }
  .proposal-root .price-sub {
    font-size: 12px;
    color: var(--sec);
    margin-bottom: 28px;
    line-height: 1.5;
  }
  .proposal-root .payment-splits {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }
  .proposal-root .split-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    padding: 11px 16px;
    border-radius: 6px;
    font-weight: 500;
  }
  .proposal-root .split-teal { background: rgba(0,212,170,0.1); color: var(--accent); border: 1px solid rgba(0,212,170,0.2); }
  .proposal-root .split-blue { background: rgba(0,153,255,0.1); color: var(--blue);   border: 1px solid rgba(0,153,255,0.2); }
  .proposal-root .split-note {
    font-size: 11px;
    color: var(--muted);
    font-style: italic;
    line-height: 1.5;
  }

  /* ── CTA ── */
  .proposal-root #cta {
    background:
      radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,212,170,0.07) 0%, transparent 70%),
      var(--surface);
    border-top: 1px solid var(--border);
    text-align: center;
  }
  .proposal-root .cta-inner {
    max-width: 640px;
    margin: 0 auto;
  }
  .proposal-root .cta-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--accent);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .proposal-root .cta-eyebrow::before, .proposal-root .cta-eyebrow::after {
    content: '';
    display: block;
    width: 32px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent));
  }
  .proposal-root .cta-eyebrow::after { transform: scaleX(-1); }
  .proposal-root .cta-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 4vw, 48px);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 16px;
    letter-spacing: -0.02em;
  }
  .proposal-root .cta-sub {
    font-size: 15px;
    color: var(--sec);
    line-height: 1.6;
    margin-bottom: 40px;
  }
  .proposal-root .cta-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 48px;
  }
  .proposal-root .btn-calendly {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--accent);
    color: #060810;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    padding: 16px 32px;
    border-radius: 7px;
    text-decoration: none;
    letter-spacing: 0.04em;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 0 32px rgba(0,212,170,0.3);
  }
  .proposal-root .btn-calendly:hover {
    opacity: 0.88;
    transform: translateY(-2px);
    box-shadow: 0 8px 40px rgba(0,212,170,0.4);
  }
  .proposal-root .btn-calendly svg { width: 16px; height: 16px; }

  .proposal-root .social-links {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .proposal-root .social-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: var(--sec);
    text-decoration: none;
    padding: 10px 18px;
    border-radius: 6px;
    border: 1px solid var(--border);
    font-family: 'DM Mono', monospace;
    letter-spacing: 0.04em;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .proposal-root .social-link:hover {
    color: var(--text);
    border-color: var(--sec);
    background: rgba(255,255,255,0.03);
  }

  /* ── FOOTER ── */
  .proposal-root footer {
    background: var(--bg);
    border-top: 1px solid var(--border);
    padding: 24px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .proposal-root footer span {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--muted);
  }

  /* ── BET SIDEBAR ── */
  .proposal-root .bet-overlay {
    position: absolute;
    inset: 0;
    z-index: 10;
    cursor: default;
  }
  .proposal-root .bet-sidebar {
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 230px;
    background: var(--surface2);
    border-left: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 20px 16px;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 20;
    border-radius: 0 12px 12px 0;
  }
  .proposal-root .bet-sidebar.open {
    transform: translateX(0);
  }
  .proposal-root .bet-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--sec);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-align: center;
  }
  .proposal-root .bet-market-name {
    font-family: 'Syne', sans-serif;
    font-size: 11px;
    font-weight: 700;
    color: var(--text);
    text-align: center;
    line-height: 1.3;
  }
  .proposal-root .bet-buttons {
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;
  }
  .proposal-root .bet-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    width: 100%;
    padding: 10px 0;
    border-radius: 7px;
    border: none;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.15s;
  }
  .proposal-root .bet-btn:hover { opacity: 0.85; transform: scale(1.03); }
  .proposal-root .bet-btn-yes {
    background: rgba(0,212,170,0.15);
    color: var(--accent);
    border: 1px solid rgba(0,212,170,0.35);
  }
  .proposal-root .bet-btn-no {
    background: rgba(255,77,109,0.15);
    color: var(--red);
    border: 1px solid rgba(255,77,109,0.35);
  }
  .proposal-root .bet-close {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    background: none;
    border: none;
    cursor: pointer;
    letter-spacing: 0.06em;
    transition: color 0.15s;
  }
  .proposal-root .bet-close:hover { color: var(--sec); }
  .proposal-root .mock-row {
    cursor: pointer;
  }
  .proposal-root .mock-row.selected {
    background: rgba(255,255,255,0.04);
    border-color: var(--border);
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 860px) {
    .proposal-root .hero-inner { grid-template-columns: 1fr; }
    .proposal-root .hero-right { display: none; }
    .proposal-root .exp-grid { grid-template-columns: 1fr; }
    .proposal-root .norm-flow {
      grid-template-columns: unset;
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      gap: 2px;
      padding-left: 32px;
      padding-right: 32px;
      margin-left: -32px;
      margin-right: -32px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      border-radius: 0;
    }
    .proposal-root .norm-flow::-webkit-scrollbar { display: none; }
    .proposal-root .norm-step {
      scroll-snap-align: start;
      flex: 0 0 68vw;
      min-width: 0;
    }
    .proposal-root .norm-hint { display: flex; }
    .proposal-root .pricing-grid { grid-template-columns: 1fr; }
    .proposal-root .stats-grid { grid-template-columns: 1fr; }
    .proposal-root nav .nav-links { display: none; }

    .proposal-root .weeks-grid {
      grid-template-columns: unset;
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      gap: 12px;
      padding-bottom: 16px;
      padding-left: 32px;
      padding-right: 32px;
      margin-left: -32px;
      margin-right: -32px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .proposal-root .weeks-grid::-webkit-scrollbar { display: none; }
    .proposal-root .week-card {
      scroll-snap-align: start;
      flex: 0 0 68vw;
      min-width: 0;
    }
    .proposal-root .carousel-hint { display: flex; }
  }
  .proposal-root .norm-hint {
    display: none;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    margin-bottom: 4px;
  }
  .proposal-root .norm-hint span {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .proposal-root .norm-hint .carousel-arrow {
    animation: proposal-slide 1.4s ease-in-out infinite;
  }
  .proposal-root .carousel-hint {
    display: none;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    margin-bottom: 4px;
  }
  .proposal-root .carousel-hint span {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .proposal-root .carousel-arrow {
    display: flex;
    align-items: center;
    gap: 2px;
    color: var(--muted);
    animation: proposal-slide 1.4s ease-in-out infinite;
  }
  @keyframes proposal-slide {
    0%, 100% { transform: translateX(0); opacity: 0.5; }
    50% { transform: translateX(6px); opacity: 1; }
  }
`;

const INITIAL_MARKETS = [
  { name: "BTC above $100k", tag: "POLYMARKET", color: "var(--accent)", prob: 62, change: 4.2,  vol: 2.4,  volUnit: "M" },
  { name: "Fed cuts in June", tag: "KALSHI",     color: "var(--blue)",   prob: 38, change: -1.8, vol: 880,  volUnit: "K" },
  { name: "US recession 2025", tag: "POLYMARKET",color: "var(--gold)",   prob: 29, change: 7.1,  vol: 3.1,  volUnit: "M" },
  { name: "ETH ETF approval", tag: "KALSHI",     color: "var(--purple)", prob: 71, change: -0.5, vol: 1.7,  volUnit: "M" },
];

const INITIAL_CHART_Y = [32, 28, 30, 22, 18, 20, 14, 16, 10, 8, 6];
const CHART_STEPS = INITIAL_CHART_Y.length;

function buildPath(ys: number[], close = false) {
  const pts = ys.map((y, i) => `${i === 0 ? "M" : "L"}${(i * 300) / (CHART_STEPS - 1)},${y}`).join(" ");
  return close ? `${pts} L300,40 L0,40 Z` : pts;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function ProposalPage() {
  const [markets, setMarkets] = useState(INITIAL_MARKETS);
  const [chartY, setChartY] = useState(INITIAL_CHART_Y);
  const flashRef = useRef<{ [key: number]: string }>({});
  const [flashKey, setFlashKey] = useState(0);
  const [selectedMarket, setSelectedMarket] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const scrollToCta = () => {
    const root = rootRef.current;
    const cta = root?.querySelector("#cta") as HTMLElement | null;
    if (root && cta) root.scrollTo({ top: cta.offsetTop, behavior: "smooth" });
    setSelectedMarket(null);
  };

  const scrollToPrice = () => {
    const root = rootRef.current;
    const cta = root?.querySelector("#pricing") as HTMLElement | null;
    if (root && cta) root.scrollTo({ top: cta.offsetTop, behavior: "smooth" });
    setSelectedMarket(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMarkets(prev =>
        prev.map((m, i) => {
          const delta = (Math.random() - 0.5) * 1.6;
          const newProb = clamp(m.prob + delta, 5, 95);
          const newChange = clamp(m.change + (Math.random() - 0.5) * 0.4, -15, 15);
          const newVol = clamp(m.vol + (Math.random() - 0.48) * (m.volUnit === "M" ? 0.05 : 20), 0.1, 99);
          flashRef.current[i] = delta >= 0 ? "flash-pos" : "flash-neg";
          return { ...m, prob: newProb, change: newChange, vol: newVol };
        })
      );
      setChartY(prev => {
        const last = prev[prev.length - 1];
        const delta = (Math.random() - 0.5) * 5;
        const next = clamp(last + delta, 3, 37);
        return [...prev.slice(1), next];
      });
      setFlashKey(k => k + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const linePath = buildPath(chartY);
  const areaPath = buildPath(chartY, true);

  return (
    <div className="proposal-root" ref={rootRef}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* NAV */}
      <nav>
        <span className="nav-logo">AT · PROPOSAL</span>
        <ul className="nav-links">
          <li><a href="#why">Experience</a></li>
          <li><a href="#norm">Tech Approach</a></li>
          <li><a href="#timeline">Roadmap</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <a href="/proposals_files/proposal_prediction_markets_2026_03.pdf" download className="nav-pdf">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            PDF
          </a>
          <a href="#cta" className="nav-cta">Book a Call →</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-left">
              <div className="badges">
                <span className="badge badge-teal">NEXT.JS EXPERT</span>
                <span className="badge badge-blue">REAL-TIME DATA</span>
                <span className="badge badge-gold">IBM · DYNATRACE</span>
                <span className="badge badge-purple">PUBLISHED AUTHOR</span>
              </div>

              <div className="hero-name">Andrei Tazetdinov</div>
              <div className="hero-role">Full-Stack Engineer · Real-Time Systems &amp; Data Dashboards</div>
              <div className="hero-tagline">
                I&apos;ve built platforms for <strong>real money, real users, real deadlines</strong> —<br />
                at IBM, Dynatrace, and FXTM. Your application is exactly my lane.
              </div>

              <div className="hero-contacts">
                <a href="mailto:webconsult.ekb@gmail.com"><span className="ci">✉</span> webconsult.ekb@gmail.com</a>
                <a href="https://andreitazetdinov.com" target="_blank" rel="noopener noreferrer"><span className="ci">⌂</span> andreitazetdinov.com</a>
                <a href="https://github.com/ataztech910" target="_blank" rel="noopener noreferrer"><span className="ci">▷</span> github.com/ataztech910</a>
                <a href="https://linkedin.com/in/andreitazetdinov" target="_blank" rel="noopener noreferrer"><span className="ci">in</span> LinkedIn</a>
              </div>

              <div className="hero-actions">
                <a href="#cta" className="btn-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Book a Call
                </a>
                <a href="#timeline" className="btn-secondary">View Roadmap →</a>
              </div>
            </div>

            {/* MOCK DASHBOARD */}
            <div className="hero-right">
              <div className="mock-dashboard">
                <div className="mock-topbar">
                  <div className="mock-dots">
                    <div className="mock-dot d-red"></div>
                    <div className="mock-dot d-yellow"></div>
                    <div className="mock-dot d-green"></div>
                  </div>
                  <div className="mock-url">prediction-markets.app/dashboard</div>
                </div>
                <div className="mock-body" style={{ position: 'relative', overflow: 'hidden' }}>
                  <div className="mock-head-row">
                    <div className="mock-title">Markets</div>
                    <div className="mock-live"><div className="live-dot"></div> LIVE</div>
                  </div>
                  <div className="mock-row-head" style={{ display: 'grid', gridTemplateColumns: '1fr 70px 60px 70px', gap: '8px', padding: '0 10px 6px' }}>
                    <span>EVENT</span><span>PROB</span><span>24H</span><span>VOL</span>
                  </div>
                  {markets.map((m, i) => {
                    const pos = m.change >= 0;
                    const flash = flashRef.current[i] || "";
                    const vol = m.volUnit === "M"
                      ? `$${m.vol.toFixed(1)}M`
                      : `$${Math.round(m.vol)}K`;
                    return (
                      <div
                        key={m.name}
                        className={`mock-row ${flash}${selectedMarket === i ? " selected" : ""}`}
                        data-flash={flashKey}
                        onClick={() => setSelectedMarket(selectedMarket === i ? null : i)}
                      >
                        <div>
                          <div className="market-name">{m.name}</div>
                          <div className="market-tag">{m.tag}</div>
                        </div>
                        <div className="prob" style={{ color: m.color }}>{Math.round(m.prob)}%</div>
                        <div className={pos ? "chg-pos" : "chg-neg"}>
                          {pos ? "+" : ""}{m.change.toFixed(1)}%
                        </div>
                        <div className="vol">{vol}</div>
                      </div>
                    );
                  })}

                  {/* BET SIDEBAR */}
                  {selectedMarket !== null && (
                    <div className="bet-overlay" onClick={() => setSelectedMarket(null)} />
                  )}
                  <div className={`bet-sidebar${selectedMarket !== null ? " open" : ""}`}>
                    {selectedMarket !== null && (
                      <>
                        <div className="bet-market-name">{markets[selectedMarket].name}</div>
                        <div className="bet-label">Want to bet?</div>
                        <div className="bet-buttons">
                          <button className="bet-btn bet-btn-yes" onClick={scrollToPrice}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
                            </svg>
                            YES
                          </button>
                          <button className="bet-btn bet-btn-no" onClick={scrollToCta}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                            </svg>
                            NO
                          </button>
                        </div>
                        <button className="bet-close" onClick={e => { e.stopPropagation(); setSelectedMarket(null); }}>✕ close</button>
                      </>
                    )}
                  </div>
                  <div className="mock-chart">
                    <div className="chart-label">BTC $100k · live probability</div>
                    <svg className="sparkline" viewBox="0 0 300 40" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#00D4AA" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={linePath} fill="none" stroke="#00D4AA" strokeWidth="1.8" strokeLinejoin="round" />
                      <path d={areaPath} fill="url(#sg)" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value sv-teal">15+</div>
              <div className="stat-label">Years in production — fintech, enterprise, real-time</div>
            </div>
            <div className="stat-item">
              <div className="stat-value sv-blue">4</div>
              <div className="stat-label">Enterprise clients via IBM — Siemens, Adobe, SAP, LOT</div>
            </div>
            <div className="stat-item">
              <div className="stat-value sv-gold">2</div>
              <div className="stat-label">Published Next.js books — I literally wrote the manual to Senior Developers</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY ME */}
      <section id="why">
        <div className="container">
          <div className="eyebrow"><span className="eyebrow-text">Why me</span></div>
          <div className="section-title">Built for this exact project</div>

          <div className="exp-grid">
            <div className="exp-card ec-teal">
              <div className="exp-dot" style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }}></div>
              <div>
                <div className="exp-company" style={{ color: 'var(--accent)' }}>IBM — Frontend Architect</div>
                <div className="exp-desc">Consulted for Siemens, Adobe, SAP &amp; LOT Polish Airlines — frontend architecture, design systems, and performance-critical dashboards at enterprise scale.</div>
              </div>
            </div>
            <div className="exp-card ec-blue">
              <div className="exp-dot" style={{ background: 'var(--blue)', boxShadow: '0 0 8px var(--blue)' }}></div>
              <div>
                <div className="exp-company" style={{ color: 'var(--blue)' }}>FXTM — Trading App</div>
                <div className="exp-desc">Led 0 → production for a regulated forex broker. 50K+ active traders, live on App Store &amp; Google Play. WebSockets, real-time ticks, sub-second UI.</div>
              </div>
            </div>
            <div className="exp-card ec-gold">
              <div className="exp-dot" style={{ background: 'var(--gold)', boxShadow: '0 0 8px var(--gold)' }}></div>
              <div>
                <div className="exp-company" style={{ color: 'var(--gold)' }}>Dynatrace — Senior SWE</div>
                <div className="exp-desc">Data dashboards trusted by 10,000+ engineers at Fortune 500 companies. I know what "performance-critical" actually means at scale.</div>
              </div>
            </div>
            <div className="exp-card ec-purple">
              <div className="exp-dot" style={{ background: 'var(--purple)', boxShadow: '0 0 8px var(--purple)' }}></div>
              <div>
                <div className="exp-company" style={{ color: 'var(--purple)' }}>Full-Stack Ownership</div>
                <div className="exp-desc">I write the schema, the API, the UI, and the deploy pipeline. No handoffs, no delays — one person accountable for the whole product.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NORMALIZATION */}
      <section id="norm">
        <div className="container">
          <div className="eyebrow"><span className="eyebrow-text">Technical approach</span></div>
          <div className="section-title">Data Normalization Strategy</div>

          <div className="norm-question">
            <strong>Your question:</strong> "If one platform provides odds as prices (0.62) and another as percentages (62%), how would you normalize and store this data?"
          </div>

          <div className="norm-flow">
            <div className="norm-step ns1">
              <div className="step-num">01</div>
              <div className="step-name">Ingest</div>
              <div className="step-desc">Collect raw values from each source as-is. No transformation yet — preserve the original for audit.</div>
            </div>
            <div className="norm-step ns2">
              <div className="step-num">02</div>
              <div className="step-name">Normalize</div>
              <div className="step-desc">Convert everything to float 0–1 at ingestion layer. 62% → 0.62, 0.62 stays as-is.</div>
            </div>
            <div className="norm-step ns3">
              <div className="step-num">03</div>
              <div className="step-name">Store</div>
              <div className="step-desc">FLOAT in Postgres + <code style={{ color: 'var(--gold)', fontSize: '10px' }}>source_format</code> column for full traceability.</div>
            </div>
            <div className="norm-step ns4">
              <div className="step-num">04</div>
              <div className="step-name">Display</div>
              <div className="step-desc">Render as % in UI. One source of truth, always consistent across all markets.</div>
            </div>
          </div>

          <div className="norm-hint">
            <span>scroll</span>
            <div className="carousel-arrow">
              <svg width="48" height="12" viewBox="0 0 48 12" fill="none">
                <line x1="0" y1="6" x2="42" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <polyline points="36,1 43,6 36,11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
          </div>

          <div className="code-header">
            <div className="code-header-left">
              <span className="code-header-dot" style={{background:'#FF5F57'}}></span>
              <span className="code-header-dot" style={{background:'#FFBD2E'}}></span>
              <span className="code-header-dot" style={{background:'#28CA41'}}></span>
              <span className="code-header-title">ingestion/normalise.ts</span>
            </div>
            <span className="code-header-badge">copy-paste ready</span>
          </div>
          <div className="code-snippet" style={{borderRadius: '0 0 8px 8px', borderTop: 'none'}}>
            <span className="cm">{'// ingestion/normalise.ts'}</span>{'\n'}
            <span className="k">function</span> <span className="fn">toProbability</span>(<span className="prop">raw</span>: <span className="prop">number</span>, <span className="prop">format</span>: <span className="str">&apos;decimal&apos;</span> | <span className="str">&apos;percentage&apos;</span>): <span className="prop">number</span> {'{'}{'\n'}
            {'  '}<span className="k">return</span> <span className="prop">format</span> === <span className="str">&apos;percentage&apos;</span> ? <span className="prop">raw</span> / <span className="num">100</span> : <span className="prop">raw</span>;  <span className="cm">{'// always 0–1'}</span>{'\n'}
            {'}'}{'\n\n'}
            <span className="cm">{'// Polymarket returns 0.62  → toProbability(0.62, \'decimal\')  → 0.62'}</span>{'\n'}
            <span className="cm">{'// Kalshi   returns 62     → toProbability(62,   \'percentage\') → 0.62'}</span>{'\n\n'}
            <span className="cm">{'// schema'}</span>{'\n'}
            <span className="k">type</span> <span className="prop">MarketSnapshot</span> = {'{'}{'\n'}
            {'  '}<span className="prop">market_id</span>:     <span className="prop">string</span>;{'\n'}
            {'  '}<span className="prop">source</span>:        <span className="str">&apos;polymarket&apos;</span> | <span className="str">&apos;kalshi&apos;</span>;{'\n'}
            {'  '}<span className="prop">probability</span>:   <span className="prop">number</span>;   <span className="cm">{'// FLOAT 0–1, single truth'}</span>{'\n'}
            {'  '}<span className="prop">raw_value</span>:     <span className="prop">number</span>;   <span className="cm">{'// original value for audit'}</span>{'\n'}
            {'  '}<span className="prop">source_format</span>: <span className="prop">string</span>;   <span className="cm">{'// \'decimal\' | \'percentage\''}</span>{'\n'}
            {'  '}<span className="prop">fetched_at</span>:    <span className="prop">Date</span>;{'\n'}
            {'}'};
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline">
        <div className="container">
          <div className="eyebrow"><span className="eyebrow-text">Delivery plan</span></div>
          <div className="section-title">4-Week Roadmap</div>

          <div className="weeks-grid">
            <div className="week-card w1">
              <span className="week-label">WEEK 1</span>
              <div className="week-title">Foundation</div>
              <ul className="week-items">
                <li>Polymarket API pipeline + cron</li>
                <li>Supabase schema setup</li>
                <li>Basic dashboard UI in Next.js</li>
                <li>Markets table + live refresh</li>
              </ul>
            </div>
            <div className="week-card w2">
              <span className="week-label">WEEK 2</span>
              <div className="week-title">Core Product</div>
              <ul className="week-items">
                <li>Market detail pages</li>
                <li>Price history charts (Recharts)</li>
                <li>Top movers section</li>
                <li>Trade buttons (external links)</li>
              </ul>
            </div>
            <div className="week-card w3">
              <span className="week-label">WEEK 3</span>
              <div className="week-title">Second Source</div>
              <ul className="week-items">
                <li>Kalshi integration</li>
                <li>Cross-platform normalization</li>
                <li>Platform comparison view</li>
                <li>Stable cron jobs + monitoring</li>
              </ul>
            </div>
            <div className="week-card w4">
              <span className="week-label">WEEK 4</span>
              <div className="week-title">Ship It</div>
              <ul className="week-items">
                <li>UI polish &amp; performance</li>
                <li>Vercel deploy + SEO</li>
                <li>Handoff + docs</li>
                <li>Buffer for QA &amp; fixes</li>
              </ul>
            </div>
          </div>

          <div className="carousel-hint">
            <span>scroll</span>
            <div className="carousel-arrow">
              <svg width="48" height="12" viewBox="0 0 48 12" fill="none">
                <line x1="0" y1="6" x2="42" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <polyline points="36,1 43,6 36,11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
          </div>

          <div className="warning-box">
            <strong>⚠ One dependency to flag:</strong> Kalshi API requires account verification which can take a few business days.
            Please confirm active API access before we start — this is the only external timeline risk I can&apos;t control.
          </div>
        </div>
      </section>

      {/* PRICING + DELIVERABLES */}
      <section id="pricing">
        <div className="container">
          <div className="eyebrow"><span className="eyebrow-text">Scope &amp; investment</span></div>
          <div className="section-title">What you&apos;re getting</div>

          <div className="pricing-grid">
            <div className="deliverables-list">
              <div className="del-item">
                <div className="del-check" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>✓</div>
                Live markets dashboard — Polymarket + Kalshi, synced every 1–5 min, always consistent
              </div>
              <div className="del-item">
                <div className="del-check" style={{ background: 'rgba(0,153,255,0.15)', color: 'var(--blue)' }}>✓</div>
                Per-market detail pages — YES/NO history, platform arbitrage view, probability chart
              </div>
              <div className="del-item">
                <div className="del-check" style={{ background: 'rgba(245,200,66,0.15)', color: 'var(--gold)' }}>✓</div>
                Production-grade backend — Supabase schema, idempotent upserts, cron with error alerting
              </div>
              <div className="del-item">
                <div className="del-check" style={{ background: 'rgba(167,139,250,0.15)', color: 'var(--purple)' }}>✓</div>
                Deployed on Vercel — fast globally, SEO-ready, zero devops headache for you
              </div>
              <div className="del-item">
                <div className="del-check" style={{ background: 'rgba(0,212,170,0.15)', color: 'var(--accent)' }}>✓</div>
                Daily Loom updates — you see the product growing every day, no black boxes
              </div>
            </div>

            <div className="price-card">
              <div className="price-label">Total Investment</div>
              <div className="price-value">$8,080</div>
              <div className="price-sub">
                Fixed price · No surprises · No agency markup<br />
                You get a senior engineer, not a junior with a manager
              </div>
              <div className="payment-splits">
                <div className="split-row split-teal">50% Upfront — $4,040</div>
                <div className="split-row split-blue">50% On delivery — $4,040</div>
              </div>
              <div className="split-note">
                Direct communication · Daily updates · Fast iterations<br />
                Milestone review at end of Week 2 before second source work begins.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta">
        <div className="container">
          <div className="cta-inner">
            <div className="cta-eyebrow">I&apos;m available now</div>
            <div className="cta-title">Your application,<br />live in 4 weeks.</div>
            <div className="cta-sub">
              15-minute call. I&apos;ll walk you through the exact schema,<br />
              the data pipeline, and Week 1 deliverables. Come with questions.
            </div>

            <div className="cta-buttons">
              <a href="https://calendly.com/webconsult-ekb/15min" target="_blank" rel="noopener noreferrer" className="btn-calendly">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Book a 15-min Call
              </a>
            </div>

            <div className="social-links">
              <a href="mailto:webconsult.ekb@gmail.com" className="social-link">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                Email
              </a>
              <a href="https://linkedin.com/in/andreitazetdinov" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
              <a href="https://github.com/ataztech910" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                GitHub
              </a>
              <a href="https://andreitazetdinov.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                Website
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <span>Andrei Tazetdinov · Fintech Dashboard Proposal · 2025</span>
        <span>andreitazetdinov.com</span>
      </footer>
    </div>
  );
}
