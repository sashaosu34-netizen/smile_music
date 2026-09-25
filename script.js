const WHATSAPP_NUMBER = "79629442051";
const WHATSAPP_MESSAGE = "Здравствуйте! Хочу записаться на занятие в Smile Music.";

const header = document.getElementById("header");
const nav = document.getElementById("nav");
const menuButton = document.getElementById("menuButton");
const navLinks = document.querySelectorAll(".nav a");

function updateHeader() {
  if (header) header.classList.toggle("scrolled", window.scrollY > 25);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const opened = nav.classList.toggle("active");
    menuButton.setAttribute("aria-expanded", String(opened));
    header?.classList.toggle("menu-open", opened);
    document.body.classList.toggle("menu-open", opened);
    document.body.classList.toggle("lock", opened);
  });
}

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    nav?.classList.remove("active");
    menuButton?.setAttribute("aria-expanded", "false");
    header?.classList.remove("menu-open");
    document.body.classList.remove("menu-open", "lock");
  });
});

/* Reveal animation — content stays usable even if IntersectionObserver is unavailable. */
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  revealElements.forEach(element => revealObserver.observe(element));
} else {
  revealElements.forEach(element => element.classList.add("visible"));
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

/* Contact chooser */
const bookingButtons = document.querySelectorAll("[data-booking]");
const contactModal = document.getElementById("contactModal");
const contactCloseButtons = document.querySelectorAll("[data-contact-close]");
const whatsappContact = document.getElementById("whatsappContact");
const maxContact = document.getElementById("maxContact");

function openContactModal(service = "") {
  const message = service
    ? `Здравствуйте! Хочу записаться/узнать подробнее: ${service}.`
    : WHATSAPP_MESSAGE;
  if (whatsappContact) {
    whatsappContact.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }
  contactModal?.classList.add("active");
  contactModal?.setAttribute("aria-hidden", "false");
  document.body.classList.add("lock");
}

function closeContactModal() {
  contactModal?.classList.remove("active");
  contactModal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lock");
}

bookingButtons.forEach(button => {
  button.setAttribute("aria-label", "Выбрать способ связи со Smile Music");
  button.addEventListener("click", event => {
    event.preventDefault();
    openContactModal(button.dataset.service || "");
  });
});
contactCloseButtons.forEach(button => button.addEventListener("click", closeContactModal));

if (maxContact) {
  maxContact.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("+79629442051"); } catch (_) {}
  });
}

/* FAQ */
const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach(item => {
  const button = item.querySelector(".faq-item__button");
  const content = item.querySelector(".faq-item__content");
  if (!button || !content) return;
  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");
    faqItems.forEach(otherItem => {
      otherItem.classList.remove("active");
      const otherButton = otherItem.querySelector(".faq-item__button");
      const otherContent = otherItem.querySelector(".faq-item__content");
      otherButton?.setAttribute("aria-expanded", "false");
      if (otherContent) otherContent.style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add("active");
      button.setAttribute("aria-expanded", "true");
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

/* Gallery / document lightbox */
const galleryItems = document.querySelectorAll("[data-gallery]");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

galleryItems.forEach(item => {
  item.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = item.dataset.gallery || "";
    lightbox.classList.add("active");
    document.body.classList.add("lock");
  });
});

function closeLightbox() {
  lightbox?.classList.remove("active");
  document.body.classList.remove("lock");
}
lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  closeLightbox();
  closeContactModal();
  nav?.classList.remove("active");
  menuButton?.setAttribute("aria-expanded", "false");
  header?.classList.remove("menu-open");
  document.body.classList.remove("menu-open", "lock");
});

/* Smooth internal navigation */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", event => {
    const href = anchor.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* Reliable local hero montage. The poster remains if video playback fails. */
const heroVideo = document.getElementById("heroVideo");
if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.loop = true;
  const safePlay = () => {
    const result = heroVideo.play();
    if (result && typeof result.catch === "function") {
      result.catch(() => {});
    }
  };
  heroVideo.addEventListener("canplay", safePlay, { once: true });
  heroVideo.addEventListener("error", () => {
    heroVideo.closest(".hero-video")?.classList.add("video-failed");
  });
  safePlay();
}
