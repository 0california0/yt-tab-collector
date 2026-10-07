const YT_PATTERNS = [
  "*://www.youtube.com/*",
  "*://youtu.be/*"
];

function getVideoId(urlString) {
  try {
    const u = new URL(urlString);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const m = u.pathname.match(/^\/(shorts|live|embed)\/([\w-]{11})/);
    return m ? m[2] : null;
  } catch {
    return null;
  }
}

function cleanTitle(title) {
  return (title || "").replace(/^\(\d+\)\s*/, "").replace(/\s*-\s*YouTube( Music)?$/, "");
}

chrome.action.onClicked.addListener(async () => {
  const tabs = await chrome.tabs.query({ url: YT_PATTERNS });
  const items = tabs
  .map((t) => ({
    url: t.url,
    title: cleanTitle(t.title),
    videoId: getVideoId(t.url)
  }))
  .filter((item) => item.videoId);
  await chrome.storage.local.set({
    collection: { collectedAt: Date.now(), items }
  });
  await chrome.tabs.create({ url: chrome.runtime.getURL("overview.html") });
});
