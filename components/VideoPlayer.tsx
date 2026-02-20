"use client";

export default function VideoPlayer() {
  const CLOUDINARY_BASE = "https://res.cloudinary.com/dzqm5gmyg/video/upload";
  const TRANSFORMS = "q_auto,f_auto,w_800";
  const VIDEO_ID = "v1771619958/Definitivo_qujptu";

  return (
    <div className="relative h-[230px] w-full overflow-hidden rounded-xl bg-gray-900">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/video-poster.jpg"
        className="h-full w-full object-cover"
      >
        <source
          src={`${CLOUDINARY_BASE}/${TRANSFORMS}/${VIDEO_ID}.webm`}
          type="video/webm"
        />
        <source
          src={`${CLOUDINARY_BASE}/${TRANSFORMS}/${VIDEO_ID}.mp4`}
          type="video/mp4"
        />
        Tu navegador no soporta el elemento de video.
      </video>
    </div>
  );
}