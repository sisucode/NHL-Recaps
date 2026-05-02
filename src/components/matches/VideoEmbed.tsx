import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import { YouTubeVideo } from "../../types/nhl";

interface VideoEmbedProps {
  video: YouTubeVideo | null;
}

export default function VideoEmbed({ video }: VideoEmbedProps) {
  if (!video) {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-center p-6">
        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <span className="text-2xl">🎬</span>
        </div>
        <h3 className="text-lg font-bold text-text-primary">Video ej tillgänglig ännu</h3>
        <p className="text-sm text-text-secondary mt-1">Vi visar matchens händelser direkt här istället.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 glow-blue aspect-video">
      <LiteYouTubeEmbed
        id={video.videoId}
        title={video.title}
        poster="maxresdefault"
        noCookie={true}
      />
    </div>
  );
}
