import React from "react";
import { ResolvedVideo } from "../../types/video";

export default function VideoPlayer({ video }: { video: ResolvedVideo }) {
  if (video.provider !== "brightcove") {
    return null;
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
      <iframe
        src={video.embedUrl}
        title={video.title || "NHL recap video"}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}
