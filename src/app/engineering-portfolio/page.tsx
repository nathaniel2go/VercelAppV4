"use client";

import SideBar from "../sidebar";
import { useRouter } from "next/navigation";

export default function EngineeringPortfolioPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white">
      <SideBar />

      <button
        onClick={() => router.push("/")}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          fontSize: "26px",
          lineHeight: 1,
          fontWeight: 700,
          cursor: "pointer",
          zIndex: 10001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Close engineering portfolio"
      >
        ×
      </button>

      <main className="w-full px-6 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full h-[88vh] border border-white/10 rounded-3xl overflow-hidden bg-black shadow-2xl">
            <iframe
              src="/EngineeringPortfolio2026.pdf#toolbar=1&navpanes=0&scrollbar=1"
              title="Engineering Portfolio 2026"
              className="w-full h-full"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
