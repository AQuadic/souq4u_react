"use client";
// import { useTranslations } from "next-intl";
import React, { useState } from "react";

type Props = {
  lat?: number | null;
  lng?: number | null;
  className?: string;
};

const MapWithSkeleton: React.FC<Props> = ({ lat, lng, className }) => {
  // const t = useTranslations("Common");
  const [loaded, setLoaded] = useState(false);

  // Fallback: if iframe doesn't fire onLoad (some browsers or CSPs), hide skeleton after timeout
  React.useEffect(() => {
    if (loaded) return;
    const t = setTimeout(() => setLoaded(true), 6000);
    return () => clearTimeout(t);
  }, [loaded]);

  // Use a maps.google.com embed URL that does not require the Maps Embed API key.
  // This centers the map on the coordinates and shows a marker via the 'q' param.
  const defaultLat = 30.04442;
  const defaultLng = 31.23571;
  const centerLat = lat ?? defaultLat;
  const centerLng = lng ?? defaultLng;
  const mapSrc = `https://maps.google.com/maps?q=${centerLat},${centerLng}&z=15&output=embed`;
  console.log("mapSrc", mapSrc);
  return (
    <div className={`relative ${className}`}>
      {/* skeleton overlay */}
      {!loaded && (
        <div className="absolute inset-0 w-full h-full animate-pulse bg-[#1f1f1f] rounded-2xl flex items-center justify-center z-20">
          <div className="w-3/4 h-3/4 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
            <div className="text-[#4a4a4a] text-sm">{('loadingMap')}</div>
          </div>
        </div>
      )}

      {/* iframe is always rendered; we control visibility using opacity so onLoad fires reliably */}
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0, opacity: loaded ? 1 : 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        title="Location map"
      />
    </div>
  );
};

export default MapWithSkeleton;
