"use client";

export default function HeroVideo({ settings }: { settings: any }) {
  const videoSrc = settings?.videoBackground || settings?.videoBackgroundLink;
  console.log("videoSrc", videoSrc);

  if (!videoSrc) {
    return (
      <section className="relative h-[70vh] w-full overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <p className="text-white/80 text-sm md:text-base">
            No banner video is configured yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[70vh] w-full overflow-hidden bg-black">
      <div className="absolute inset-0 bg-black" />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src={videoSrc}
        poster={settings?.bannerImage || undefined}
      />
      <div className="absolute inset-0 bg-black/30" />
    </section>
  );
}
