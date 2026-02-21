"use client";
import SideBar from "../../sidebar";
import { videoEntries } from "@/data/videoPortfolio";
import { useParams, useRouter } from "next/navigation";
import VideoPlayerClient from "./VideoPlayerClient";

export default function VideoPlayerPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const video = videoEntries.find((entry) => entry.id === params.id);

  if (!video) {
    return (
      <div className="min-h-screen bg-black text-white">
        <SideBar />
        <main className="w-full px-6 md:px-8 py-12">
          <div className="max-w-5xl mx-auto space-y-6 text-center">
            <h1 className="text-2xl md:text-3xl font-bold">Video not found</h1>
            <button
              onClick={() => router.push("/videos")}
              className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-white/40 text-white/90 hover:border-white hover:text-white transition"
            >
              Back to videos
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SideBar />
      <button
        onClick={() => router.push("/videos")}
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
        aria-label="Back to video list"
      >
        ×
      </button>
      <main className="w-full px-6 md:px-8 py-12">
        <VideoPlayerClient video={video} />
      </main>
    </div>
  );
}
