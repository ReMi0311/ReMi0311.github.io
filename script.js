const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const themeColor = document.getElementById("themeColor");
const year = document.getElementById("year");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const closeMenu = () => {
  if (!menuToggle || !navLinks) return;
  navLinks.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
};

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuToggle.focus();
    }
  });

  window.matchMedia("(min-width: 981px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}

const updateThemeButton = () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  if (themeToggle) {
    themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }
  if (themeColor) themeColor.setAttribute("content", isDark ? "#111214" : "#f4f2ed");
};

if (themeToggle) {
  updateThemeButton();

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch (error) {
      // The theme still changes when browser storage is unavailable.
    }
    updateThemeButton();
  });
}

document.querySelectorAll("[data-project-tabs]").forEach((tabsWrapper) => {
  const tabs = Array.from(tabsWrapper.querySelectorAll("[role='tab']"));
  const panels = Array.from(tabsWrapper.querySelectorAll("[role='tabpanel']"));

  const activateTab = (tab, moveFocus = false) => {
    const selectedTab = tab.dataset.tab;

    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel) => {
      const active = panel.dataset.panel === selectedTab;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });

    if (moveFocus) tab.focus();
  };

  const requestedProject = new URLSearchParams(window.location.search).get("project");
  const initialTab = tabs.find((tab) => tab.dataset.tab === requestedProject);
  if (initialTab) activateTab(initialTab);

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateTab(tab);
      const url = new URL(window.location.href);
      url.searchParams.set("project", tab.dataset.tab);
      history.replaceState({}, "", `${url.pathname}${url.search}#projects`);
    });
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex !== index) {
        event.preventDefault();
        activateTab(tabs[nextIndex], true);
      }
    });
  });
});

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const slides = Array.from(gallery.querySelectorAll(".gallery-slide"));
  const prevButton = gallery.querySelector(".gallery-prev");
  const nextButton = gallery.querySelector(".gallery-next");
  let currentIndex = 0;

  if (slides.length < 2 || !prevButton || !nextButton) return;

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === currentIndex;
      slide.classList.toggle("active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
  };

  prevButton.addEventListener("click", () => showSlide(currentIndex - 1));
  nextButton.addEventListener("click", () => showSlide(currentIndex + 1));
  showSlide(0);
});

const revealItems = document.querySelectorAll("[data-reveal]");
document.documentElement.classList.add("reveal-ready");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("revealed"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const navItems = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
const sections = navItems
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navItems.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-35% 0px -55%", threshold: 0 });

  sections.forEach((section) => sectionObserver.observe(section));
}

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    image.classList.add("image-error");
    image.alt = `${image.alt || "Portfolio image"} could not be loaded`;
  }, { once: true });
});
