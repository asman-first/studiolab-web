/* Studiolab Technologies — site behaviour
   Vanilla JS, no dependencies. Everything degrades gracefully. */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lang = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
  // Number formatting: Russian groups thousands with a space (7 000), the others with a comma.
  const numLocale = lang === "ru" ? "ru-RU" : "en-US";
  const num = (v) => Math.round(v).toLocaleString(numLocale);

  /* ---------------------------------------------------------------------
     Strings used by scripts (calculators, forms). English, Arabic, Russian.
     The page language comes from <html lang="…">.
     --------------------------------------------------------------------- */

  const arCount = (n, one, two, few, many) => {
    if (n === 1) return one;
    if (n === 2) return two;
    if (n >= 3 && n <= 10) return `${n} ${few}`;
    return `${n} ${many}`;
  };

  // Russian plurals: 1 минута, 2 минуты, 5 минут, 21 минута
  const ruCount = (n, one, few, many) => {
    const m10 = n % 10;
    const m100 = n % 100;
    const word = m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
    return `${n} ${word}`;
  };

  const STRINGS = {
    en: {
      money: (v) => `AED ${num(v)}`,
      perMin: (v) => `AED ${num(v)} / min`,
      minutes: (n) => `${n} min`,
      languages: (n) => `${n} ${n === 1 ? "language" : "languages"}`,
      videos: (n) => `${n} ${n === 1 ? "video" : "videos"}`,
      each: (v) => `AED ${num(v)} each`,
      less: (p) => `${p}% less`,
      save: (p) => `You save ${p}% per video`,
      single: "Single-video price",
      dash: "—",
      sending: "Sending…",
      received: "Received. We'll reply directly from the Lab.",
      notConfigured: "The form is temporarily unavailable. Please call +971 4 572 8386.",
      failed: "Something went wrong. Please try again or call +971 4 572 8386.",
      network: "Network error. Please check your connection and try again.",
      order: "Order",
      waLabel: "WhatsApp",
      waAria: (pkg) => `Order on WhatsApp: ${pkg}`,
      waRow: (service, pkg, price) => `Hi Studiolab, I'm interested in ${service}: ${pkg} — ${price}.`,
      waVideo: (n, unit, total) => `Hi Studiolab, I'd like to order AI video: ${n} ${n === 1 ? "video" : "videos"} up to 30 s, AED ${num(unit)} each, AED ${num(total)} in total.`,
      waDubbing: (m, l, tier, rate, total) => `Hi Studiolab, I'd like a quote for video dubbing: ${m} min, ${l} ${l === 1 ? "language" : "languages"}, ${tier} tier (AED ${num(rate)}/min), approx. AED ${num(total)} excl. VAT.`,
    },
    ar: {
      money: (v) => `${num(v)} درهم`,
      perMin: (v) => `${num(v)} درهم / دقيقة`,
      minutes: (n) => arCount(n, "دقيقة واحدة", "دقيقتان", "دقائق", "دقيقة"),
      languages: (n) => arCount(n, "لغة واحدة", "لغتان", "لغات", "لغة"),
      videos: (n) => arCount(n, "فيديو واحد", "فيديوهان", "فيديوهات", "فيديو"),
      each: (v) => `${num(v)} درهم لكل فيديو`,
      less: (p) => `أقل بنسبة ${p}%`,
      save: (p) => `توفّر ${p}% لكل فيديو`,
      single: "سعر الفيديو الواحد",
      dash: "—",
      sending: "جارٍ الإرسال…",
      received: "وصلت رسالتك. سنرد عليك مباشرة من المختبر.",
      notConfigured: "النموذج غير متاح مؤقتًا. يرجى التواصل عبر واتساب أو الاتصال على +971 4 572 8386.",
      failed: "حدث خطأ ما. يرجى المحاولة مرة أخرى أو الاتصال على +971 4 572 8386.",
      network: "خطأ في الاتصال. يرجى التحقق من الإنترنت والمحاولة مجددًا.",
      order: "اطلب",
      waLabel: "واتساب",
      waAria: (pkg) => `اطلب عبر واتساب: ${pkg}`,
      waRow: (service, pkg, price) => `مرحبًا Studiolab، أهتم بـ${service}: ${pkg} — ${price}.`,
      waVideo: (n, unit, total) => `مرحبًا Studiolab، أود طلب فيديو بالذكاء الاصطناعي: ${arCount(n, "فيديو واحد", "فيديوهان", "فيديوهات", "فيديو")} حتى 30 ثانية، ${num(unit)} درهم لكل فيديو، الإجمالي ${num(total)} درهم.`,
      waDubbing: (m, l, tier, rate, total) => `مرحبًا Studiolab، أود عرض سعر لدبلجة فيديو: ${arCount(m, "دقيقة واحدة", "دقيقتان", "دقائق", "دقيقة")}، ${arCount(l, "لغة واحدة", "لغتان", "لغات", "لغة")}، باقة ${tier} (${num(rate)} درهم/دقيقة)، نحو ${num(total)} درهم غير شاملة الضريبة.`,
    },
    ru: {
      money: (v) => `${num(v)} AED`,
      perMin: (v) => `${num(v)} AED / мин`,
      minutes: (n) => ruCount(n, "минута", "минуты", "минут"),
      languages: (n) => ruCount(n, "язык", "языка", "языков"),
      videos: (n) => `${n} видео`,
      each: (v) => `${num(v)} AED за видео`,
      less: (p) => `на ${p}% дешевле`,
      save: (p) => `Экономия ${p}% на каждом видео`,
      single: "Цена одного видео",
      dash: "—",
      sending: "Отправляем…",
      received: "Получили. Ответим вам напрямую из студии.",
      notConfigured: "Форма временно недоступна. Напишите в WhatsApp или позвоните: +971 4 572 8386.",
      failed: "Что-то пошло не так. Попробуйте ещё раз или позвоните: +971 4 572 8386.",
      network: "Ошибка сети. Проверьте подключение и попробуйте снова.",
      order: "Заказать",
      waLabel: "WhatsApp",
      waAria: (pkg) => `Заказать в WhatsApp: ${pkg}`,
      waRow: (service, pkg, price) => `Здравствуйте, Studiolab! Интересует ${service}: ${pkg} — ${price}.`,
      waVideo: (n, unit, total) => `Здравствуйте, Studiolab! Хочу заказать ИИ-видео: ${n} видео до 30 с, ${num(unit)} AED за видео, итого ${num(total)} AED.`,
      waDubbing: (m, l, tier, rate, total) => `Здравствуйте, Studiolab! Хочу узнать цену дубляжа: ${ruCount(m, "минута", "минуты", "минут")}, ${ruCount(l, "язык", "языка", "языков")}, тариф ${tier} (${num(rate)} AED/мин), примерно ${num(total)} AED без НДС.`,
    },
  };
  const T = STRINGS[lang] || STRINGS.en;

  /* ---------------------------------------------------------------------
     WhatsApp
     Put the studio's WhatsApp Business number here, digits only, with
     country code (971...). Every element with data-wa gets a wa.me link;
     data-wa-text sets the prefilled message.
     --------------------------------------------------------------------- */

  const WHATSAPP_NUMBER = "971553321026";

  const WA_ICON =
    '<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.54-3.7 8.24-8.23 8.24m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28"/></svg>';

  // Builds the wa.me link from data-wa-text and gives every WhatsApp button its icon.
  // Called again whenever a calculator changes the message.
  const setWa = (el) => {
    const text = (el.dataset.waText || "Hi Studiolab, I'd like to talk about a project.").replace(/\u00a0/g, " ");
    el.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    if (el.classList.contains("btn") && !el.querySelector("svg")) el.insertAdjacentHTML("afterbegin", WA_ICON);
  };
  document.querySelectorAll("[data-wa]").forEach(setWa);

  // Price tables: <table data-wa-service="AI video"> gets a WhatsApp button per row,
  // with the package name and price already written into the message.
  document.querySelectorAll("table[data-wa-service]").forEach((table) => {
    const service = table.dataset.waService;
    const headRow = table.querySelector("thead tr");
    if (headRow) {
      const th = document.createElement("th");
      th.textContent = T.order;
      headRow.appendChild(th);
    }
    table.querySelectorAll("tbody tr").forEach((tr) => {
      const cells = tr.querySelectorAll("td");
      if (cells.length < 3) return;
      const pkg = cells[0].textContent.trim();
      const numEl = cells[2].querySelector(".num");
      const subEl = cells[2].querySelector(".sub");
      const price = (numEl ? numEl.textContent : cells[2].textContent).trim() + (subEl ? ` (${subEl.textContent.trim()})` : "");
      const a = document.createElement("a");
      a.className = "btn btn--sm btn--wa";
      a.target = "_blank";
      a.rel = "noopener";
      a.dataset.wa = "";
      a.dataset.waText = T.waRow(service, pkg, price);
      a.setAttribute("aria-label", T.waAria(pkg));
      a.textContent = T.waLabel;
      const td = document.createElement("td");
      td.appendChild(a);
      tr.appendChild(td);
      setWa(a);
    });
  });

  /* ---------------------------------------------------------------------
     Header: scrolled state, hide on scroll down, mobile nav
     --------------------------------------------------------------------- */

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav a");

  if (header) {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 24);
      if (y > 320 && y > lastY + 6) header.classList.add("is-hidden");
      else if (y < lastY - 6 || y < 320) header.classList.remove("is-hidden");
      lastY = y;
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(onScroll);
          ticking = true;
        }
      },
      { passive: true }
    );
    onScroll();
  }

  const closeNav = () => {
    if (!header) return;
    header.classList.remove("nav-open");
    document.body.classList.remove("no-scroll");
    toggle && toggle.setAttribute("aria-expanded", "false");
  };

  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("nav-open");
      document.body.classList.toggle("no-scroll", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.forEach((a) => a.addEventListener("click", closeNav));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
    window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => {
      if (e.matches) closeNav();
    });
  }

  /* ---------------------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------------------- */

  const revealEls = document.querySelectorAll(".reveal, .step");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealEls.forEach((el) => io.observe(el));
    }
  }

  /* ---------------------------------------------------------------------
     Counters  <span data-count="50" data-suffix="K+">50K+</span>
     --------------------------------------------------------------------- */

  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const fmt = (v, decimals, grouped) =>
      v.toLocaleString(numLocale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: grouped });

    const run = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const grouped = el.dataset.format === "group";
      const decimals = (el.dataset.count.split(".")[1] || "").length;
      const duration = 1400;
      const start = performance.now();
      const ease = (t) => 1 - Math.pow(1 - t, 4);
      const frame = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const v = target * ease(p);
        el.textContent = prefix + fmt(v, decimals, grouped) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    };

    if (reduceMotion || !("IntersectionObserver" in window)) {
      // leave the server-rendered text as is
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              run(entry.target);
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((el) => io.observe(el));
    }
  }

  /* ---------------------------------------------------------------------
     Pointer glow on cells
     --------------------------------------------------------------------- */

  document.querySelectorAll(".cells").forEach((group) => {
    group.addEventListener("pointermove", (e) => {
      const cell = e.target.closest(".cell");
      if (!cell) return;
      const r = cell.getBoundingClientRect();
      cell.style.setProperty("--mx", `${e.clientX - r.left}px`);
      cell.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  /* ---------------------------------------------------------------------
     Hero field: a grid of points drifting through a noise field
     --------------------------------------------------------------------- */

  const canvas = document.querySelector("[data-hero-field]");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let points = [];
    let t = Math.random() * 100;
    let raf = 0;
    let visible = true;
    const mouse = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };

    const A = [47, 123, 255]; // electric blue
    const B = [25, 200, 255]; // neon cyan

    const build = () => {
      points = [];
      const gap = w < 640 ? 24 : w < 1100 ? 30 : 34;
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          points.push({ x, y, s: 0.6 + Math.random() * 0.8 });
        }
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduceMotion) draw();
    };

    const noise = (x, y, time) =>
      Math.sin(x * 0.0042 + time) * Math.cos(y * 0.0051 - time * 0.72) +
      Math.sin((x + y) * 0.0028 + time * 0.46) * 0.55;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const n = noise(p.x, p.y, t); // -1.55 .. 1.55
        const ang = n * Math.PI;
        const amp = 7;
        let dx = Math.cos(ang) * amp;
        let dy = Math.sin(ang) * amp;

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md = Math.hypot(mdx, mdy) || 1;
        const inf = Math.max(0, 1 - md / 240);
        if (inf > 0) {
          const push = inf * inf * 26;
          dx += (mdx / md) * push;
          dy += (mdy / md) * push;
        }

        const k = (p.x / w) * 0.7 + (n + 1.55) / 3.1 * 0.3; // 0..1 blend
        const r = Math.round(A[0] + (B[0] - A[0]) * k);
        const g = Math.round(A[1] + (B[1] - A[1]) * k);
        const b = Math.round(A[2] + (B[2] - A[2]) * k);
        const alpha = 0.1 + ((n + 1.55) / 3.1) * 0.22 + inf * 0.55;
        const radius = p.s * (0.9 + ((n + 1.55) / 3.1) * 0.9) + inf * 2.4;

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x + dx, p.y + dy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      t += 0.0055;
      if (!reduceMotion && visible && !document.hidden) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    const hero = canvas.closest(".hero") || canvas.parentElement;
    hero.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
    });
    hero.addEventListener("pointerleave", () => {
      mouse.tx = -1e4;
      mouse.ty = -1e4;
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          visible = entries[0].isIntersecting;
          if (visible) start();
        },
        { threshold: 0.02 }
      ).observe(canvas);
    }
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && visible) start();
    });

    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    });

    resize();
    start();
  }

  /* ---------------------------------------------------------------------
     Forms → Formspree
     Paste your Formspree endpoint below (Formspree → your form →
     Integration → "https://formspree.io/f/xxxxxxxx"). Both the contact
     and the careers form use it; the hidden "form" and "subject" fields
     tell the two apart in your inbox. A data-endpoint attribute on a
     <form> overrides this default for that form only.
     --------------------------------------------------------------------- */

  const FORM_ENDPOINT = "";

  document.querySelectorAll("form[data-form]").forEach((form) => {
    const status = form.querySelector(".form-status");
    const submit = form.querySelector('button[type="submit"]');
    const say = (msg, kind) => {
      if (!status) return;
      status.textContent = msg;
      status.classList.remove("is-ok", "is-error");
      if (kind) status.classList.add(kind);
    };
    const done = () => {
      form.reset();
      say(form.dataset.success || T.received, "is-ok");
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      // Honeypot: real visitors never see this field. Formspree also checks it server-side.
      if (data.get("_gotcha")) {
        done();
        return;
      }
      data.set("page", location.href);

      const endpoint = form.dataset.endpoint || FORM_ENDPOINT;
      if (!endpoint) {
        console.warn("[studiolab] FORM_ENDPOINT is empty in assets/js/main.js, so the form cannot send.");
        say(T.notConfigured, "is-error");
        return;
      }

      submit && (submit.disabled = true);
      say(T.sending);

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (res.ok) {
          done();
          return;
        }
        let message = "";
        try {
          const json = await res.json();
          if (Array.isArray(json.errors)) message = json.errors.map((er) => er.message).filter(Boolean).join(" ");
        } catch (_) {
          /* non-JSON error body */
        }
        say(message || T.failed, "is-error");
      } catch (err) {
        say(T.network, "is-error");
      } finally {
        submit && (submit.disabled = false);
      }
    });
  });

  /* ---------------------------------------------------------------------
     Dubbing calculator  (services.html)
     Price per finished minute, per language. Pack discount by language
     count. Numbers live in data attributes so they can be changed in HTML.
     --------------------------------------------------------------------- */

  document.querySelectorAll("[data-calc='dubbing']").forEach((calc) => {
    const minutes = calc.querySelector("[data-minutes]");
    const languages = calc.querySelector("[data-languages]");
    const tiers = calc.querySelectorAll("[data-tier]");
    const outMinutes = calc.querySelector("[data-out='minutes']");
    const outLanguages = calc.querySelector("[data-out='languages']");
    const outTotal = calc.querySelector("[data-out='total']");
    const outRate = calc.querySelector("[data-out='rate']");
    const outList = calc.querySelector("[data-out='list']");
    const outDiscount = calc.querySelector("[data-out='discount']");
    const outStudio = calc.querySelector("[data-out='studio']");
    const outSaving = calc.querySelector("[data-out='saving']");
    const studioRate = parseFloat(calc.dataset.studioRate || "450"); // AED per minute, traditional studio midpoint
    const waBtn = calc.querySelector("[data-wa-calc]");

    const money = T.money;
    const paint = (input) => {
      const p = ((input.value - input.min) / (input.max - input.min)) * 100;
      input.style.setProperty("--p", p + "%");
    };

    let tier = calc.querySelector("[data-tier][aria-pressed='true']") || tiers[0];

    const update = () => {
      const m = parseInt(minutes.value, 10);
      const l = parseInt(languages.value, 10);
      const rate = parseFloat(tier.dataset.rate);
      const min = parseFloat(tier.dataset.min || "0");
      const perLanguage = Math.max(m * rate, min);
      const list = perLanguage * l;
      const discount = l >= 10 ? 0.3 : l >= 5 ? 0.2 : 0;
      const total = list * (1 - discount);
      const studio = m * studioRate * l;

      paint(minutes);
      paint(languages);
      outMinutes.textContent = T.minutes(m);
      outLanguages.textContent = T.languages(l);
      outRate.textContent = T.perMin(rate);
      outList.textContent = money(list);
      outDiscount.textContent = discount ? "−" + Math.round(discount * 100) + "%" : T.dash;
      outTotal.textContent = money(total);
      outStudio.textContent = money(studio);
      outSaving.textContent = studio > total ? T.less(Math.round((1 - total / studio) * 100)) : T.dash;
      if (waBtn) {
        const tierName = (tier.querySelector("strong") || tier).textContent.trim();
        waBtn.dataset.waText = T.waDubbing(m, l, tierName, rate, total);
        setWa(waBtn);
      }
    };

    tiers.forEach((btn) =>
      btn.addEventListener("click", () => {
        tiers.forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        tier = btn;
        update();
      })
    );
    minutes.addEventListener("input", update);
    languages.addEventListener("input", update);
    update();
  });

  /* ---------------------------------------------------------------------
     Video pack calculator  (services.html)
     --------------------------------------------------------------------- */

  document.querySelectorAll("[data-calc='video']").forEach((calc) => {
    const qty = calc.querySelector("[data-qty]");
    const outQty = calc.querySelector("[data-out='qty']");
    const outTotal = calc.querySelector("[data-out='total']");
    const outEach = calc.querySelector("[data-out='each']");
    const outSaving = calc.querySelector("[data-out='saving']");
    const outFill = calc.querySelector("[data-out='fill']");
    const single = parseFloat(calc.dataset.single || "2500");
    const money = T.money;
    const waBtn = calc.querySelector("[data-wa-calc]");

    // per-unit price ladder: 1 → 2500, 5 → 2000, 10 → 1750, 12/mo → 1500, 24/mo → 1250
    const unitFor = (n) => {
      if (n >= 24) return 1250;
      if (n >= 12) return 1500;
      if (n >= 10) return 1750;
      if (n >= 5) return 2000;
      return single;
    };

    const update = () => {
      const n = parseInt(qty.value, 10);
      const unit = unitFor(n);
      const total = unit * n;
      const p = ((qty.value - qty.min) / (qty.max - qty.min)) * 100;
      qty.style.setProperty("--p", p + "%");
      outQty.textContent = T.videos(n);
      outTotal.textContent = money(total);
      outEach.textContent = T.each(unit);
      const saving = Math.round((1 - unit / single) * 100);
      outSaving.textContent = saving > 0 ? T.save(saving) : T.single;
      if (outFill) outFill.style.setProperty("--w", (unit / single) * 100 + "%");
      if (waBtn) {
        waBtn.dataset.waText = T.waVideo(n, unit, total);
        setWa(waBtn);
      }
    };

    qty.addEventListener("input", update);
    update();
  });

  /* ---------------------------------------------------------------------
     Current year
     --------------------------------------------------------------------- */

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
