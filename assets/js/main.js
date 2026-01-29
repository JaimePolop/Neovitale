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

  function categoryClass(title) {
    if (!title) return "";
    var t = title.toLowerCase();
    if (t.normalize) {
      t = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    if (t.indexOf("ortopedia") >= 0 || t.indexOf("ayudas") >= 0) return "card--blue";
    if (t.indexOf("herbolario") >= 0 || t.indexOf("parafarmacia") >= 0) return "card--green";
    if (t.indexOf("calzado") >= 0) return "card--orange";
    return "";
  }

  function renderProducts(container, items, variant) {
    var base = container.getAttribute("data-base") || "";
    container.innerHTML = "";
    items.forEach(function (item) {
      var card = createEl("a", "card", "");
      var colorClass = categoryClass(item.titulo);
      if (colorClass) {
        card.classList.add(colorClass);
      }
      var href = item.href || "#";
      if (base && href && href.charAt(0) !== "#" && href.indexOf("http") !== 0 && href.charAt(0) !== "/") {
        href = base + href;
      }
      card.href = href;
      card.setAttribute("aria-label", item.titulo);

      var imgWrap = createEl("div", "card__media", "");
      var img = createEl("img", "", "");
      var imgSrc = item.imagen;
      if (base && imgSrc && imgSrc.charAt(0) !== "#" && imgSrc.indexOf("http") !== 0 && imgSrc.charAt(0) !== "/") {
        imgSrc = base + imgSrc;
      }
      img.src = imgSrc;
      img.alt = item.titulo;
      img.loading = "lazy";
      imgWrap.appendChild(img);

      var body = createEl("div", "card__body", "");
      body.appendChild(createEl("h4", "card__title", item.titulo));
      body.appendChild(createEl("p", "card__text", item.descripcion));

      if (variant === "compact") {
        card.classList.add("card--compact");
        imgWrap.classList.add("card__media--compact");
        card.appendChild(imgWrap);
        card.appendChild(body);
      } else {
        card.appendChild(imgWrap);
        card.appendChild(body);
      }
      container.appendChild(card);
    });
  }

  function renderTestimonials(container, items) {
    var good = items.filter(function (item) {
      return !item.rating || item.rating >= 4;
    });

    if (!good.length) {
      container.innerHTML = "";
      return;
    }

    container.classList.add("testimonials-slider");
    var track = createEl("div", "testimonials__track", "");

    var index = 0;
    var visible = 3;
    var timerId;

    function initials(name) {
      return name.split(" ").slice(0, 2).map(function (n) { return n[0]; }).join("").toUpperCase();
    }

    function stars(count) {
      return "★★★★★".slice(0, count || 5);
    }

    function getVisible() {
      if (window.innerWidth < 720) return 1;
      if (window.innerWidth < 1100) return 2;
      return 3;
    }

    function renderSlice() {
      visible = getVisible();
      track.innerHTML = "";
      for (var i = 0; i < visible; i++) {
        var item = good[(index + i) % good.length];
        var card = createEl("div", "testimonial", "");

        var top = createEl("div", "testimonial__top", "");
        var avatar = createEl("div", "testimonial__avatar", "");
        if (item.avatar) {
          var avatarImg = createEl("img", "testimonial__avatar-img", "");
          avatarImg.src = item.avatar;
          avatarImg.alt = item.nombre;
          avatarImg.loading = "lazy";
          avatar.appendChild(avatarImg);
        } else {
          avatar.textContent = initials(item.nombre);
        }
        var meta = createEl("div", "testimonial__meta", "");
        meta.appendChild(createEl("strong", "testimonial__name", item.nombre));
        meta.appendChild(createEl("span", "testimonial__date", item.fecha));
        top.appendChild(avatar);
        top.appendChild(meta);
        var source = createEl("div", "testimonial__source", "");
        var logo = createEl("img", "testimonial__source-logo", "");
        logo.src = "assets/images/logos-varios/el-logo-g-de-google.png";
        logo.alt = "Google";
        logo.loading = "lazy";
        source.appendChild(logo);
        top.appendChild(source);

        var rating = createEl("div", "testimonial__stars", stars(item.rating));
        var text = createEl("p", "testimonial__text", item.texto);

        card.appendChild(top);
        card.appendChild(rating);
        card.appendChild(text);
        track.appendChild(card);
      }

    }

    renderSlice();
    container.innerHTML = "";
    container.appendChild(track);
    function goNext() {
      index = (index + 1) % good.length;
      track.classList.remove("fade-in");
      void track.offsetWidth;
      track.classList.add("fade-in");
      renderSlice();
    }

    function startAuto() {
      if (timerId) clearInterval(timerId);
      timerId = setInterval(goNext, 6000);
    }

    container.addEventListener("mouseenter", function () {
      if (timerId) clearInterval(timerId);
    });
    container.addEventListener("mouseleave", function () {
      startAuto();
    });

    window.addEventListener("resize", function () {
      renderSlice();
    });

    startAuto();
  }

  function renderBrands(container, items) {
    container.innerHTML = "";
    items.forEach(function (item) {
      var img = createEl("img", "brand", "");
      img.src = item.logo;
      img.alt = item.nombre;
      img.loading = "lazy";
      container.appendChild(img);
    });
  }

  ready(function () {
    var toggles = document.querySelectorAll(".nav__caret");
    toggles.forEach(function (toggle) {
      var item = toggle.closest(".nav__item");
      var closeTimer;

      if (item) {
        item.addEventListener("mouseenter", function () {
          clearTimeout(closeTimer);
          item.classList.add("nav__item--open");
          toggle.setAttribute("aria-expanded", "true");
        });

        item.addEventListener("mouseleave", function () {
          closeTimer = window.setTimeout(function () {
            item.classList.remove("nav__item--open");
            toggle.setAttribute("aria-expanded", "false");
          }, 200);
        });
      }

      toggle.addEventListener("click", function (event) {
        event.stopPropagation();
        var isOpen = item && item.classList.contains("nav__item--open");
        document.querySelectorAll(".nav__item--open").forEach(function (openItem) {
          openItem.classList.remove("nav__item--open");
          var btn = openItem.querySelector(".nav__toggle");
          if (btn) btn.setAttribute("aria-expanded", "false");
        });
        if (item && !isOpen) {
          item.classList.add("nav__item--open");
          toggle.setAttribute("aria-expanded", "true");
        }
      });
    });

    document.addEventListener("click", function (event) {
      if (event.target.closest(".nav__item")) return;
      document.querySelectorAll(".nav__item--open").forEach(function (openItem) {
        openItem.classList.remove("nav__item--open");
        var btn = openItem.querySelector(".nav__toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      document.querySelectorAll(".nav__item--open").forEach(function (openItem) {
        openItem.classList.remove("nav__item--open");
        var btn = openItem.querySelector(".nav__toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    });

    var animated = document.querySelectorAll("[data-animate]");
    if (animated.length && "IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });

      animated.forEach(function (el, index) {
        el.classList.add("reveal");
        el.style.transitionDelay = (index * 80) + "ms";
        observer.observe(el);
      });
    } else {
      animated.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }

    var productsContainers = document.querySelectorAll("[data-products]");
    if (productsContainers.length) {
      var productRequests = {};
      productsContainers.forEach(function (container) {
        var src = container.getAttribute("data-products-src") || "data/productos.json";
        if (!productRequests[src]) {
          productRequests[src] = fetchJson(src);
        }
        productRequests[src].then(function (data) {
          var variant = container.getAttribute("data-variant") || "grid";
          renderProducts(container, data.categorias, variant);
        }).catch(function (err) {
          console.warn(err.message);
        });
      });
    }

    var testimoniosContainer = document.querySelector("[data-testimonios]");
    if (testimoniosContainer) {
      fetchJson("data/testimonios.json").then(function (data) {
        renderTestimonials(testimoniosContainer, data.testimonios);
      }).catch(function (err) {
        console.warn(err.message);
      });
    }

    var marcasContainer = document.querySelector("[data-marcas]");
    if (marcasContainer) {
      fetchJson("data/marcas.json").then(function (data) {
        renderBrands(marcasContainer, data.marcas);
      }).catch(function (err) {
        console.warn(err.message);
      });
    }
  });
})();
