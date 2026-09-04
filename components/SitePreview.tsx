export function sitePreviewUrl(liveUrl: string) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(liveUrl)}?w=1600`;
}

export function SitePreview({
  url,
  title,
  className = "h-48",
}: {
  url?: string;
  title: string;
  className?: string;
}) {
  if (!url) {
    return (
      <div className={`grid place-items-center bg-soft text-xs tracking-[0.4em] text-slate-400 ${className}`}>
        WORK
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sitePreviewUrl(url)}
        alt={`${title} website`}
        className="h-full w-full object-cover object-top"
      />
    </div>
  );
}
