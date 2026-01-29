(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function fetchJson(path) {
    return fetch(path, { cache: "no-cache" }).then(function (res) {
      if (!res.ok) throw new Error("No se pudo cargar " + path);
      return res.json();
    });
  }

  function createEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  ready(function () {
    var container = document.querySelector("[data-galeria]");
    if (!container) return;

    var src = container.getAttribute("data-galeria");
    var base = container.getAttribute("data-base") || "";
    if (!src) return;

    fetchJson(src).then(function (data) {
      var title = document.querySelector("[data-galeria-titulo]");
      var desc = document.querySelector("[data-galeria-descripcion]");
      if (title) title.textContent = data.titulo || "";
      if (desc) desc.textContent = data.descripcion || "";

      var grid = container.querySelector(".gallery");
      if (!grid) return;
      grid.innerHTML = "";

      data.items.forEach(function (item) {
        var card = createEl("div", "gallery__item", "");
        var img = createEl("img", "", "");
        var imgSrc = item.imagen;
        if (base && imgSrc && imgSrc.charAt(0) !== "#" && imgSrc.indexOf("http") !== 0 && imgSrc.charAt(0) !== "/") {
          imgSrc = base + imgSrc;
        }
        img.src = imgSrc;
        img.alt = item.titulo;
        img.loading = "lazy";
        var label = createEl("div", "gallery__label", item.titulo);
        card.appendChild(img);
        card.appendChild(label);
        grid.appendChild(card);
      });
    }).catch(function (err) {
      console.warn(err.message);
    });
  });
})();
