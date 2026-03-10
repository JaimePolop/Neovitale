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

  function resolveSrc(base, src) {
    if (base && src && src.charAt(0) !== "#" && src.indexOf("http") !== 0 && src.charAt(0) !== "/") {
      return base + src;
    }
    return src;
  }

  function normalizeText(value) {
    if (!value) return "";
    var text = String(value).toLowerCase();
    if (text.normalize) {
      text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return text;
  }

  function getDetailItems(item) {
    if (Array.isArray(item.detalle) && item.detalle.length) return item.detalle;
    var byTitle = {
      movilidad: [
        { titulo: "Andadores", imagen: "assets/images/imagenes-seccion-ayudas/movilidad/andadores.png" },
        { titulo: "Sillas de ruedas", imagen: "assets/images/imagenes-seccion-ayudas/movilidad/sillas_de_ruedas.png" },
        { titulo: "Bastones y muletas", imagen: "assets/images/imagenes-seccion-ayudas/movilidad/bastones y muletas.png" },
        { titulo: "Gruas", imagen: "assets/images/imagenes-seccion-ayudas/movilidad/gruas.png" },
        { titulo: "Accesorios y repuestos", imagen: "assets/images/imagenes-seccion-ayudas/movilidad/accesorios_y_repuestos.png" }
      ],
      aseo: [
        { titulo: "Incontinencia y orinales", imagen: "assets/images/imagenes-seccion-ayudas/aseo/Incontinencia y orinales.png" },
        { titulo: "Pijamas antipañal", imagen: "assets/images/imagenes-seccion-ayudas/aseo/Pijamas antipañal.png" },
        { titulo: "Asideros y otros accesorios", imagen: "assets/images/imagenes-seccion-ayudas/aseo/asideros y otros accesorios.png" },
        { titulo: "Cuidado personal", imagen: "assets/images/imagenes-seccion-ayudas/aseo/cuidado personal.png" },
        { titulo: "Elevadores y reposabrazos", imagen: "assets/images/imagenes-seccion-ayudas/aseo/elevadores y reposabrazos.png" },
        { titulo: "Lavacabezas portatil", imagen: "assets/images/imagenes-seccion-ayudas/aseo/lavacabezas portatil.png" },
        { titulo: "Protecciones impermeable", imagen: "assets/images/imagenes-seccion-ayudas/aseo/protecciones impermeable.png" },
        { titulo: "Sillas con inodoro", imagen: "assets/images/imagenes-seccion-ayudas/aseo/sillas con inodoro.png" },
        { titulo: "Sillas de ducha y bañera", imagen: "assets/images/imagenes-seccion-ayudas/aseo/sillas de ducha y bañera.png" },
        { titulo: "Varios: cepillos, esponjas, antirresbalos", imagen: "assets/images/imagenes-seccion-ayudas/aseo/varios, depillos, esponjas, antiresbalos.png" }
      ],
      descanso: [
        { titulo: "Cojines antiescaras y respaldos lumbares", imagen: "assets/images/imagenes-seccion-ayudas/descanso/Cojines antiescaras y respaldos lumbares.png" },
        { titulo: "Colchones antiescaras", imagen: "assets/images/imagenes-seccion-ayudas/descanso/Colchones antiescaras.png" },
        { titulo: "Fundas y protectores", imagen: "assets/images/imagenes-seccion-ayudas/descanso/Fundas y Protectores.png" },
        { titulo: "Varios", imagen: "assets/images/imagenes-seccion-ayudas/descanso/Varios.png" },
        { titulo: "Accesorios antiescaras", imagen: "assets/images/imagenes-seccion-ayudas/descanso/accesorios antiescaras.png" },
        { titulo: "Almohadas cervicales y posicionadoras", imagen: "assets/images/imagenes-seccion-ayudas/descanso/almohadas cervicales y posicionardoras.png" },
        { titulo: "Barandillas, trapecios y quitamiedos", imagen: "assets/images/imagenes-seccion-ayudas/descanso/barandillas, trapecios y quitamiendos.png" },
        { titulo: "Camas electronicas", imagen: "assets/images/imagenes-seccion-ayudas/descanso/camas electronicas.png" },
        { titulo: "Mobiliario auxiliar", imagen: "assets/images/imagenes-seccion-ayudas/descanso/mobiliario auxiliar.png" },
        { titulo: "Sistemas de sujeccion y posicionamiento", imagen: "assets/images/imagenes-seccion-ayudas/descanso/sistemas de sujeccion y posicionamiento.png" }
      ],
      "vida diaria": [
        { titulo: "Baberos adulto", imagen: "assets/images/imagenes-seccion-ayudas/vida diaria/Baberos Adulto.png" },
        { titulo: "Ayudas para vestirse y alzar objetos", imagen: "assets/images/imagenes-seccion-ayudas/vida diaria/ayudas para vestirse y alzar objetos.png" },
        { titulo: "Cubiertos especiales", imagen: "assets/images/imagenes-seccion-ayudas/vida diaria/cubiertos especiales.png" },
        { titulo: "Pastilleros", imagen: "assets/images/imagenes-seccion-ayudas/vida diaria/pastilleros.png" },
        { titulo: "Sistemas antideslizantes", imagen: "assets/images/imagenes-seccion-ayudas/vida diaria/sistemas antideslizantes.png" },
        { titulo: "Utensilios de cocina", imagen: "assets/images/imagenes-seccion-ayudas/vida diaria/utensilios de cocina.png" },
        { titulo: "Vasos y tazas", imagen: "assets/images/imagenes-seccion-ayudas/vida diaria/vasos y tazas.png" },
        { titulo: "Varios", imagen: "assets/images/imagenes-seccion-ayudas/vida diaria/varios.png" }
      ]
    };
    return byTitle[normalizeText(item && item.titulo)] || [];
  }

  function countGridColumns(grid) {
    var template = window.getComputedStyle(grid).gridTemplateColumns || "";
    var columns = template.split(" ").filter(function (part) { return part && part !== "/"; }).length;
    return Math.max(1, columns);
  }

  function createInlinePanel() {
    var panel = createEl("div", "gallery__inline-panel", "");
    panel.setAttribute("aria-hidden", "true");
    panel.id = "gallery-inline-panel";

    var box = createEl("div", "mobility-panel", "");
    var title = createEl("h2", "section__title mobility-panel__title", "");
    box.appendChild(title);
    var mobilityGrid = createEl("div", "mobility-grid", "");
    box.appendChild(mobilityGrid);
    panel.appendChild(box);
    return { panel: panel, title: title, grid: mobilityGrid };
  }

  function renderInlinePanelContent(inline, base, item, detailItems) {
    inline.title.textContent = item.titulo;
    inline.grid.innerHTML = "";
    detailItems.forEach(function (detailItem) {
      var card = createEl("article", "mobility-card", "");
      var img = createEl("img", "", "");
      img.src = resolveSrc(base, detailItem.imagen);
      img.alt = detailItem.titulo;
      img.loading = "lazy";
      card.appendChild(img);
      card.appendChild(createEl("h3", "", detailItem.titulo));
      inline.grid.appendChild(card);
    });
  }

  function setupGalleryAccordion(grid, items, base) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".gallery__item"));
    var inline = createInlinePanel();
    var panel = inline.panel;
    var activeIndex = -1;

    function closeCurrent() {
      if (activeIndex < 0) return;
      cards[activeIndex].classList.remove("gallery__item--active");
      cards[activeIndex].setAttribute("aria-expanded", "false");
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
      activeIndex = -1;
    }

    function positionPanelFor(index) {
      var cols = countGridColumns(grid);
      var rowEnd = Math.min(cards.length - 1, Math.floor(index / cols) * cols + cols - 1);
      var anchor = cards[rowEnd];
      if (anchor.nextSibling) {
        grid.insertBefore(panel, anchor.nextSibling);
      } else {
        grid.appendChild(panel);
      }
    }

    cards.forEach(function (card, index) {
      var detailItems = getDetailItems(items[index]);
      if (!detailItems.length) return;

      card.classList.add("gallery__item--trigger");
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-controls", panel.id);
      card.setAttribute("aria-expanded", "false");

      function activate() {
        if (activeIndex === index) {
          closeCurrent();
          return;
        }

        if (activeIndex >= 0) {
          cards[activeIndex].classList.remove("gallery__item--active");
          cards[activeIndex].setAttribute("aria-expanded", "false");
        }

        renderInlinePanelContent(inline, base, items[index], detailItems);
        positionPanelFor(index);
        card.classList.add("gallery__item--active");
        card.setAttribute("aria-expanded", "true");
        panel.classList.remove("is-open");
        panel.setAttribute("aria-hidden", "true");
        void panel.offsetHeight;
        window.requestAnimationFrame(function () {
          panel.classList.add("is-open");
          panel.setAttribute("aria-hidden", "false");
        });
        activeIndex = index;
      }

      card.addEventListener("click", activate);
      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      });
    });

    window.addEventListener("resize", function () {
      if (activeIndex >= 0) {
        positionPanelFor(activeIndex);
      }
    });
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
        var imgSrc = resolveSrc(base, item.imagen);
        img.src = imgSrc;
        img.alt = item.titulo;
        img.loading = "lazy";
        if (normalizeText(item.titulo).indexOf("movilidad") >= 0) {
          img.onerror = function () {
            this.onerror = null;
            this.src = resolveSrc(base, "assets/images/imagenes-seccion-ayudas/movilidad.png");
          };
        }
        var label = createEl("div", "gallery__label", item.titulo);
        card.appendChild(img);
        card.appendChild(label);
        grid.appendChild(card);
      });

      setupGalleryAccordion(grid, data.items, base);
    }).catch(function (err) {
      console.warn(err.message);
    });
  });
})();
