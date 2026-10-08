const grid = document.getElementById("grid");
const meta = document.getElementById("meta");
const SIZES = { small: 260, medium: 310, large: 360 };
const sizeButtons = document.querySelectorAll("#sizes button");

function buildCard(item) {
  const a = document.createElement("a");
  a.className = "card";
  a.href = item.url;

  a.addEventListener("click", async (e) => {
    e.preventDefault();
    await chrome.tabs.create({ url: item.url });
    const current = await chrome.tabs.getCurrent();
    chrome.tabs.remove(current.id);
  });

  let thumb;
  if (item.videoId) {
    thumb = document.createElement("img");
    thumb.src = `https://i.ytimg.com/vi/${item.videoId}/mqdefault.jpg`;
    thumb.alt = "";
  } else {
    thumb = document.createElement("div");
    thumb.className = "placeholder";
    thumb.textContent = "no video";
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
    meta.textContent = "no YouTube-Tabs found.";
    return;
  }
  const date = new Date(collection.collectedAt).toLocaleString("de-DE");
  meta.textContent = `${collection.items.length} Tabs found`;
  collection.items.forEach((item) => grid.appendChild(buildCard(item)));

});

function applySize(name) {
  grid.style.setProperty("--min", SIZES[name] + "px");
  sizeButtons.forEach((b) => b.classList.toggle("active", b.dataset.size === name));
}

chrome.storage.local.get("thumbSize", ({ thumbSize }) => {
  applySize(thumbSize in SIZES ? thumbSize : "small");
});

sizeButtons.forEach((b) => {
  b.addEventListener("click", () => {
    applySize(b.dataset.size);
    chrome.storage.local.set({ thumbSize: b.dataset.size });
  });
});