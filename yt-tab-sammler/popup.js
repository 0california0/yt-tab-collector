const box = document.getElementById("links");
const status = document.getElementById("status");

chrome.tabs.query({ url: ["*://www.youtube.com/*", "*://youtu.be/*"] }, (tabs) => { // for youtube music: "*://m.youtube.com/*", "*://music.youtube.com/*"
  const links = tabs.map((t) => t.url);
  box.value = links.join("\n");
  document.getElementById("title").textContent = `${links.length} YouTube-Tab(s) gefunden`;
});

document.getElementById("copy").addEventListener("click", async () => {
  await navigator.clipboard.writeText(box.value);
  status.textContent = "In die Zwischenablage kopiert.";
});

document.getElementById("download").addEventListener("click", () => {
  const blob = new Blob([box.value], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "youtube-links.txt";
  a.click();
  status.textContent = "Datei wird gespeichert.";
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("overview.html") });
});