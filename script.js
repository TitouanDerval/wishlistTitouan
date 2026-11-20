"use strict";
const gifts = Array.isArray(window.CADEAUX) ? window.CADEAUX : [];
const gallery = document.getElementById("gallery");
const dialog = document.getElementById("gift-dialog");
const $ = id => document.getElementById(id);
const random = (min, max) => min + Math.random() * (max - min);

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function setText(id, value) {
  $(id).textContent = value || "";
  $(id).hidden = !value;
}
function setLink(id, url) {
  const link = $(id);
  const valid = typeof url === "string" && /^https?:\/\//i.test(url);
  link.hidden = !valid;
  if (valid) link.href = url;
  else link.removeAttribute("href");
}
function openGift(gift) {
  setText("gift-title", gift.nom);
  setText("gift-brand", gift.marque);
  setText("gift-description", gift.description);
  setText("gift-note", gift.note);
  $("gift-note-wrap").hidden = !gift.note;
  const warning = gift.attention || gift.important;
  setText("gift-important", warning);
  $("gift-important-wrap").hidden = !warning;
  setLink("gift-important-link", gift.attentionLien);
  setLink("gift-link", gift.lien);
  $("gift-image").src = gift.image;
  $("gift-image").alt = gift.nom;
  dialog.showModal();
}
function columns() {
  return innerWidth < 650 ? 2 : innerWidth < 950 ? 3 : 4;
}
function render() {
  gallery.replaceChildren();
  $("count").textContent = `${gifts.length} idée${gifts.length > 1 ? "s" : ""}`;
  $("empty").hidden = gifts.length > 0;
  const cols = columns();
  gallery.style.setProperty("--cols", cols);
  shuffle(gifts).forEach((gift, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "gift";
    button.setAttribute("aria-label", `Découvrir ${gift.nom}`);
    const row = Math.floor(index / cols);
    const column = index % cols;
    // Alterner les hauteurs et varier légèrement chaque placement.
    const stagger = (column % 2 === 0 ? -1 : 1) * (cols === 2 ? 15 : 11);
    button.style.setProperty("--dx", `${random(-8, 8).toFixed(1)}%`);
    button.style.setProperty("--dy", `${(stagger + random(-8, 8) + (row % 2 ? 4 : -4)).toFixed(1)}%`);
    button.style.setProperty("--tilt", `${random(-6, 6).toFixed(1)}deg`);
    button.style.setProperty("--scale", random(.85, 1.08).toFixed(2));
    button.style.setProperty("--delay", `${random(-7, 0).toFixed(2)}s`);
    button.style.setProperty("--duration", `${random(5.3, 8).toFixed(2)}s`);
    const float = document.createElement("span");
    float.className = "float";
    const img = document.createElement("img");
    img.src = gift.image;
    img.alt = "";
    img.loading = "lazy";
    img.addEventListener("error", () => { img.style.opacity = ".2"; });
    float.append(img);
    button.append(float);
    button.addEventListener("click", () => openGift(gift));
    gallery.append(button);
  });
}
$("close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
render();
let previousCols = columns();
addEventListener("resize", () => {
  const current = columns();
  if (current !== previousCols) { previousCols = current; render(); }
});
