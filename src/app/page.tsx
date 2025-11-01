"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.yourcompany.crew";
const APP_STORE_URL = "https://apps.apple.com/app/id0000000000";

const featureList = [
  {
    title: "就近发现",
    description: "基于位置的活动流，随时随地都能找到好玩的。",
  },
  {
    title: "一键报名",
    description: "轻量交互，入队不啰嗦；主办方管理也更顺手。",
  },
  {
    title: "安全可信",
    description: "Firebase 加持的登录与风控，隐私设置可控。",
  },
];

const screenshots = Array.from({ length: 3 }, (_, index) => index);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "Crew",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "iOS, Android",
  description: "基于地理位置的同城活动平台。",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
  author: { "@type": "Organization", name: "Your Company" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "128" },
};

export default function Home() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [smartDownloadHref, setSmartDownloadHref] = useState(APP_STORE_URL);

  useEffect(() => {
    setYear(new Date().getFullYear());

    if (typeof window !== "undefined") {
      const { navigator } = window;
      const ua = navigator.userAgent || navigator.vendor || "";
      const isAndroid = /android/i.test(ua);
      const isIOS =
        /iPad|iPhone|iPod/.test(ua) && typeof (window as { MSStream?: unknown }).MSStream === "undefined";

      if (isAndroid) {
        setSmartDownloadHref(PLAY_URL);
      } else if (isIOS) {
        setSmartDownloadHref(APP_STORE_URL);
      } else {
        setSmartDownloadHref(APP_STORE_URL);
      }
    }
  }, []);

  return (
    <>
      <Script id="crew-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(jsonLd)}
      </Script>
      <div className="container">
        <nav className="nav">
          <div className="logo">
            <div className="logo-badge" aria-hidden="true" />
            <span className="logo-text">Crew</span>
          </div>
          <div className="links">
            <a href="#features">功能</a>
            <a href="#screens">截图</a>
            <a href="#download">下载</a>
            <Link href="/map">地图</Link>
          </div>
        </nav>

        <header className="hero">
          <div>
            <span className="tag">同城活动 · 基于地理位置</span>
            <h1>
              发现活动，加入队伍，
              <br />认识同好。
            </h1>
            <p>
              Crew 帮你用最轻的方式组织、报名与管理活动。简洁界面、即时提醒、可靠
              的安全与隐私设置。
            </p>
            <div className="cta" id="download">
              <a className="btn primary" href={smartDownloadHref}>
                <DownloadIcon />
                智能下载
              </a>
              <a className="btn" href={PLAY_URL} target="_blank" rel="noopener noreferrer">
                <PlayIcon />
                Google Play
              </a>
              <a
                className="btn"
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AppStoreIcon />
                App Store
              </a>
            </div>
          </div>
          <div className="card" aria-label="App 预览">
            <div className="shot" aria-hidden="true" />
          </div>
        </header>

        <section id="features" className="section">
          <div className="grid features">
            {featureList.map((feature) => (
              <div className="card" key={feature.title}>
                <strong>{feature.title}</strong>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="screens" className="section">
          <div className="grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            {screenshots.map((shot) => (
              <div className="card" key={shot}>
                <div className="shot" aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          <div>© {year} Crew. 保留所有权利。</div>
          <div className="links">
            <Link href="/privacy">隐私政策</Link>
            <Link href="/terms">使用条款</Link>
            <a href="mailto:contact@yourcompany.com">联系</a>
          </div>
        </footer>
      </div>
    </>
  );
}

function DownloadIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5 3h14a2 2 0 0 1 2 2v14l-4-3H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 4.27v15.46L14.82 12zM16.53 10.82l-2.17 1.25 2.17 1.25L21 15.5V8.5z" />
    </svg>
  );
}

function AppStoreIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c-1.9 0-3.6 1.1-4.4 2.7C6.6 6.2 7 7.9 8 9c.7.7 1.5 1 2.3 1 .2 0 .4 0 .6-.1-.1.4-.2.9-.2 1.3 0 2.3 1.9 4.2 4.2 4.2.5 0 .9-.1 1.3-.2 0 .2.1.4.1.6 0 .8-.3 1.6-1 2.3-1 1-2.8 1.5-4.3.4C9.1 18 8 16.3 8 14.4 8 11 11 8 14.4 8c.4 0 .9.1 1.3.2 0-.2.1-.4.1-.6 0-.8-.3-1.6-1-2.3C13.9 3.1 13 2 12 2z" />
    </svg>
  );
}
