// /s/<slug> → HTML con Open Graph tags reales del track.
// WhatsApp/Telegram/IG leen estos meta tags y muestran preview con cover, artist y title.
// El usuario humano (browser) ve un <meta http-equiv="refresh"> que lo manda a la SPA real.

const BACKEND = "https://djfreeapp-api-730989854717.southamerica-east1.run.app";
const APP = "https://app.djfreeapp.ar";

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

exports.handler = async (event) => {
  // El path puede llegar como /s/<slug> o /share/<slug>; extraemos el slug.
  const m = event.path && event.path.match(/\/s\/(.+?)\/?$/);
  const slug = m ? decodeURIComponent(m[1]) : "";
  if (!slug) {
    return { statusCode: 302, headers: { Location: APP + "/" }, body: "" };
  }

  let meta = { artist: "", title: "", artwork_url: "", preview_url: "" };
  try {
    const res = await fetch(`${BACKEND}/api/share/${encodeURIComponent(slug)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.ok) {
        meta = {
          artist: data.artist || "",
          title: data.title || "",
          artwork_url: data.artwork_url || "",
          preview_url: data.preview_url || "",
        };
      }
    }
  } catch (e) {
    // Si falla el fetch, seguimos con valores por defecto. El user igual llega a la app.
  }

  const trackLabel = [meta.artist, meta.title].filter(Boolean).join(" — ") || "DJ Free App";
  const ogImage = meta.artwork_url || "https://djfreeapp.ar/images/og-image.jpg";
  const appUrl = `${APP}/s/${encodeURIComponent(slug)}`;
  const desc = meta.artist && meta.title
    ? `Escuchá "${meta.title}" de ${meta.artist} en DJ Free App.`
    : "Compartido desde DJ Free App.";

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${esc(trackLabel)} · DJ Free App</title>
<meta name="description" content="${esc(desc)}" />

<!-- Open Graph (WhatsApp / Telegram / Facebook / LinkedIn) -->
<meta property="og:type" content="music.song" />
<meta property="og:site_name" content="DJ Free App" />
<meta property="og:title" content="${esc(trackLabel)}" />
<meta property="og:description" content="${esc(desc)}" />
<meta property="og:image" content="${esc(ogImage)}" />
<meta property="og:image:width" content="640" />
<meta property="og:image:height" content="640" />
<meta property="og:url" content="https://djfreeapp.ar/s/${esc(slug)}" />
${meta.preview_url ? `<meta property="og:audio" content="${esc(meta.preview_url)}" />` : ""}

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(trackLabel)}" />
<meta name="twitter:description" content="${esc(desc)}" />
<meta name="twitter:image" content="${esc(ogImage)}" />

<!-- Para humanos: redirigir a la app real -->
<meta http-equiv="refresh" content="0; url=${esc(appUrl)}" />
<link rel="canonical" href="${esc(appUrl)}" />
</head>
<body>
<p>Abriendo <a href="${esc(appUrl)}">${esc(trackLabel)}</a> en DJ Free App...</p>
<script>window.location.replace(${JSON.stringify(appUrl)});</script>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // No cacheo agresivo — la metadata puede cambiar
      "Cache-Control": "public, max-age=300, must-revalidate",
    },
    body: html,
  };
};
