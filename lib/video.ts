export type VideoSource = {
  kind: "youtube" | "drive";
  embedUrl: string;
};

export function getVideoSource(value: string): VideoSource | null {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    if (host === "youtu.be" || host === "youtube.com" || host === "m.youtube.com") {
      const id = host === "youtu.be"
        ? url.pathname.slice(1).split("/")[0]
        : url.searchParams.get("v") ?? url.pathname.match(/^\/(?:shorts|embed)\/([^/?]+)/)?.[1];
      return id ? { kind: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` } : null;
    }

    if (host === "drive.google.com") {
      const id = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ?? url.searchParams.get("id");
      return id ? { kind: "drive", embedUrl: `https://drive.google.com/file/d/${id}/preview` } : null;
    }
  } catch {
    return null;
  }

  return null;
}