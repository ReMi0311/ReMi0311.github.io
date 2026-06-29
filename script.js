const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const year = document.getElementById("year");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

year.textContent = new Date().getFullYear();

const projectTabs = document.querySelectorAll("[data-project-tabs]");

projectTabs.forEach((tabsWrapper) => {
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
