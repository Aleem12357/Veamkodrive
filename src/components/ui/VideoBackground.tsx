import { useState } from "react";

interface VideoBackgroundProps {
  src: string;
  fallbackSrc?: string;
  fallbackAlt?: string;
  opacity?: number;
}

export const VideoBackground = ({
  src,
  fallbackSrc,
  fallbackAlt = "Background",
  opacity = 0.4,
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
      className="absolute inset-0 w-full h-full object-cover"
      style={{ opacity }}
      onError={() => setFailed(true)}
    >
      {/* Mixkit CDN allows hotlinking — primary source */}
      <source src={src} type="video/mp4" />
      {/* Fallback if video fails */}
      {fallbackSrc && (
        <img src={fallbackSrc} alt={fallbackAlt} className="absolute inset-0 w-full h-full object-cover" style={{ opacity }} />
      )}
    </video>
  );
};
