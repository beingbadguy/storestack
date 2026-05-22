"use client";

export default function HeroVideo() {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden bg-black">
      {/* FALLBACK BACKGROUND */}

      <div className="absolute inset-0 bg-black" />

      {/* VIDEO */}

      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source
          src="https://www.pexels.com/download/video/36782108/"
          type="video/mp4"
        />
      </video>

      {/* OVERLAY */}

      <div className="absolute inset-0 bg-black/30" />
    </section>
  );
}
