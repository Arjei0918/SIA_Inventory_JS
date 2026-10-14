document.addEventListener("DOMContentLoaded", () => {
  const icons = {
    dashboard: "▦",
    products: "▤",
    stock: "⇄",
    history: "◷"
  };

  document.querySelectorAll(".nav-item").forEach(item => {
    const page = item.dataset.page;
    const span = item.querySelector("span");

    if (span && icons[page]) {
      span.textContent = icons[page];
    }
  });

  const heading = document.querySelector("#dashboard .wave");
  if (heading) heading.textContent = "✦";

  const addButtons = document.querySelectorAll('[data-action="add"]');

  addButtons.forEach(button => {
    const span = button.querySelector("span");

    if (span) {
      span.textContent = "+";
    } else {
      button.textContent = "+ Add Product";
    }
  });

  const statIcons = document.querySelectorAll(".stat-icon");

  const symbols = ["▤", "▦", "!", "₱"];

  statIcons.forEach((element, index) => {
    if (symbols[index]) element.textContent = symbols[index];
  });

  const quickActions = {
    "stock-in": "↓",
    "stock-out": "↑",
    history: "◷"
  };

  document.querySelectorAll(".quick-grid button").forEach(button => {
    const span = button.querySelector("span");
    if (!span) return;

    const action = button.dataset.action;

    if (action === "add") span.textContent = "+";
    else if (quickActions[action]) span.textContent = quickActions[action];
  });
});
