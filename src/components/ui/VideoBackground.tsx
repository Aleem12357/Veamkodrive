import { useState } from "react";

interface VideoBackgroundProps {
  src: string;
  fallbackSrc?: string;
  fallbackAlt?: string;
  opacity?: number;
  poster?: string;
}

export const VideoBackground = ({
  src,
  fallbackSrc,
  fallbackAlt = "Background",
  opacity = 0.4,
  poster,
}: VideoBackgroundProps) => {
  const [failed, setFailed] = useState(false);

  if (failed && fallbackSrc) {
    return (
      <img
        src={fallbackSrc}
        alt={fallbackAlt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity }}
      />
    );
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster || fallbackSrc}
      className="absolute inset-0 w-full h-full object-cover"
      style={{ opacity }}
      onError={() => setFailed(true)}
      {...({ fetchpriority: "high" } as any)}
    >
      <source src={src} type="video/mp4" />
      {fallbackSrc && (
        <img src={fallbackSrc} alt={fallbackAlt} className="absolute inset-0 w-full h-full object-cover" style={{ opacity }} />
      )}
    </video>
  );
};
