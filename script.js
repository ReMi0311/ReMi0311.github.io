const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}

/* Project tabs */
document.querySelectorAll("[data-project-tabs]").forEach((tabsWrapper) => {
  const tabs = tabsWrapper.querySelectorAll("[data-tab]");
  const panels = tabsWrapper.querySelectorAll("[data-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selectedTab = tab.getAttribute("data-tab");

      tabs.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-selected", "false");
      });

      panels.forEach((panel) => {
        panel.classList.remove("active");
      });

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const activePanel = tabsWrapper.querySelector(`[data-panel="${selectedTab}"]`);
      if (activePanel) {
        activePanel.classList.add("active");
      }
    });
  });
});

/* Screenshot galleries */
document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const slides = gallery.querySelectorAll(".gallery-slide");
  const dots = gallery.querySelectorAll(".gallery-dots button");
  const prevButton = gallery.querySelector(".gallery-prev");
  const nextButton = gallery.querySelector(".gallery-next");

  if (!slides.length || !prevButton || !nextButton) return;

  let currentIndex = 0;

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === currentIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === currentIndex);
    });
  };

  prevButton.addEventListener("click", () => {
    showSlide(currentIndex - 1);
  });

  nextButton.addEventListener("click", () => {
    showSlide(currentIndex + 1);
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      showSlide(dotIndex);
    });
  });
});
