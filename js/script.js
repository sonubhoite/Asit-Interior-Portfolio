const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menu?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach(a => {
  a.addEventListener("click", () => nav.classList.remove("open"));
});

const buttons = document.querySelectorAll(".filter button");
const cards = document.querySelectorAll(".project-card");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;

    cards.forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.style.display = show ? "" : "none";
    });
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".section-heading, .intro-grid, .service-grid, .project-grid, .feature-copy, .process-grid, .contact-grid").forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});

document.getElementById("year").textContent = new Date().getFullYear();
