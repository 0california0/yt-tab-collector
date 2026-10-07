const grid = document.getElementById("grid");
const meta = document.getElementById("meta");

function buildCard(item) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = item.url;
  a.target = "_blank";

  let thumb;
  if (item.videoId) {
    thumb = document.createElement("img");
    thumb.src = `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
    thumb.alt = "";
  } else {
    thumb = document.createElement("div");
    thumb.className = "placeholder";
    thumb.textContent = "Kein Video";
  }
  thumb.classList.add("thumb");

  const info = document.createElement("div");
  info.className = "info";
  const title = document.createElement("div");
  title.className = "title";
  title.textContent = item.title || item.url;
  const url = document.createElement("div");
  url.className = "url";
  url.textContent = item.url;
  info.append(title, url);

  a.append(thumb, info);
  return a;
}

chrome.storage.local.get("collection", ({ collection }) => {
  if (!collection || !collection.items.length) {
    meta.textContent = "Keine YouTube-Tabs gefunden.";
    return;
  }
  const date = new Date(collection.collectedAt).toLocaleString("de-DE");
  meta.textContent = `${collection.items.length} Tabs gefunden`;
  collection.items.forEach((item) => grid.appendChild(buildCard(item)));

});
