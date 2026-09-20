const WHATSAPP_NUMBER = "79629442051";
const WHATSAPP_MESSAGE =
  "Здравствуйте! Хочу записаться на занятие в Smile Music.";

const header = document.getElementById("header");
const nav = document.getElementById("nav");
const menuButton = document.getElementById("menuButton");
const navLinks = document.querySelectorAll(".nav a");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 25);
}

window.addEventListener("scroll", updateHeader);
updateHeader();


menuButton.addEventListener("click", () => {
  const opened = nav.classList.toggle("active");

  menuButton.setAttribute("aria-expanded", String(opened));
  header.classList.toggle("menu-open", opened);
  document.body.classList.toggle("menu-open", opened);
  document.body.classList.toggle("lock", opened);
});


navLinks.forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    header.classList.remove("menu-open");
    document.body.classList.remove("menu-open");
    document.body.classList.remove("lock");
  });
});


const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12
  }
);

revealElements.forEach(element => {
  revealObserver.observe(element);
});


document.getElementById("year").textContent = new Date().getFullYear();


/* =========================================================
   ЗАПИСЬ ЧЕРЕЗ WHATSAPP
   Все кнопки data-booking открывают чат WhatsApp
   с номером +7 (962) 944-20-51.
========================================================= */

const bookingButtons = document.querySelectorAll("[data-booking]");

function getWhatsAppUrl() {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
}

bookingButtons.forEach(button => {
  button.setAttribute(
    "aria-label",
    "Написать в WhatsApp Smile Music для записи"
  );

  button.addEventListener("click", () => {
    window.location.href = getWhatsAppUrl();
  });
});


/* FAQ */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const button = item.querySelector(".faq-item__button");
  const content = item.querySelector(".faq-item__content");

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");

    faqItems.forEach(otherItem => {
      otherItem.classList.remove("active");

      const otherButton = otherItem.querySelector(".faq-item__button");
      const otherContent = otherItem.querySelector(".faq-item__content");

      otherButton.setAttribute("aria-expanded", "false");
      otherContent.style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add("active");
      button.setAttribute("aria-expanded", "true");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});


/* GALLERY */

const galleryItems = document.querySelectorAll("[data-gallery]");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

galleryItems.forEach(item => {
  item.addEventListener("click", () => {
    lightboxImage.src = item.dataset.gallery;

    lightbox.classList.add("active");
    document.body.classList.add("lock");
  });
});


function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.classList.remove("lock");
}


lightboxClose.addEventListener("click", closeLightbox);


lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});


document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;

  closeLightbox();

  nav.classList.remove("active");
  menuButton.setAttribute("aria-expanded", "false");
  header.classList.remove("menu-open");
  document.body.classList.remove("menu-open");

  document.body.classList.remove("lock");
});


/* SMOOTH ANCHORS */

document
  .querySelectorAll('a[href^="#"]')
  .forEach(anchor => {
    anchor.addEventListener("click", event => {
      const href = anchor.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
