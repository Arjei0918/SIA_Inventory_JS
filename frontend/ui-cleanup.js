document.addEventListener("DOMContentLoaded", () => {
  const tools = document.querySelectorAll(".side-bottom a");

  tools.forEach(link => {
    if (link.href.includes("/api-docs/")) {
      link.textContent = "↗ Swagger Documentation";
    }

    if (link.href.includes("/api/health")) {
      link.textContent = "● API Health";
    }
  });

  document.querySelectorAll('[data-action="history"]').forEach(button => {
    if (button.classList.contains("text-btn")) {
      button.textContent = "View all →";
    }
  });
});
