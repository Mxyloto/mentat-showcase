const navLinks = Array.from(document.querySelectorAll(".outline-nav a"));
const navTargets = navLinks
  .map((link) => {
    const selector = link.getAttribute("href");
    return { link, target: selector ? document.querySelector(selector) : null };
  })
  .filter((item) => item.target);

const updateActiveNav = () => {
  const marker = window.scrollY + window.innerHeight * 0.32;
  let active = navTargets[0];

  for (const item of navTargets) {
    const top = item.target.getBoundingClientRect().top + window.scrollY;
    if (top <= marker) active = item;
  }

  for (const { link } of navTargets) {
    link.classList.toggle("is-active", link === active?.link);
  }
};

let navTicking = false;

window.addEventListener(
  "scroll",
  () => {
    if (navTicking) return;
    navTicking = true;
    window.requestAnimationFrame(() => {
      updateActiveNav();
      navTicking = false;
    });
  },
  { passive: true }
);

window.addEventListener("resize", updateActiveNav);
window.addEventListener("hashchange", updateActiveNav);
updateActiveNav();

const imageLightbox = document.querySelector("#image-lightbox");

if (imageLightbox && typeof imageLightbox.showModal === "function") {
  const lightboxImage = imageLightbox.querySelector("img");
  const lightboxCaption = imageLightbox.querySelector("figcaption");
  const lightboxClose = imageLightbox.querySelector(".lightbox-close");
  const lightboxPrev = imageLightbox.querySelector(".lightbox-prev");
  const lightboxNext = imageLightbox.querySelector(".lightbox-next");
  const screenshotLinks = Array.from(document.querySelectorAll(".screenshot-link"));
  let currentImageIndex = -1;

  const showImage = (index) => {
    const count = screenshotLinks.length;
    if (!count) return;

    currentImageIndex = (index + count) % count;
    const link = screenshotLinks[currentImageIndex];
    const image = link.querySelector("img");
    if (!image) return;

    const caption = link.closest("figure")?.querySelector("figcaption")?.textContent.trim() || image.alt;
    lightboxImage.src = link.getAttribute("href");
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption;
  };

  screenshotLinks.forEach((link, index) => {
    link.addEventListener("click", (event) => {
      const image = link.querySelector("img");
      if (!image) return;

      event.preventDefault();

      showImage(index);
      imageLightbox.showModal();
    });
  });

  lightboxClose.addEventListener("click", () => imageLightbox.close());
  lightboxPrev.addEventListener("click", () => showImage(currentImageIndex - 1));
  lightboxNext.addEventListener("click", () => showImage(currentImageIndex + 1));

  imageLightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showImage(currentImageIndex - 1);
    if (event.key === "ArrowRight") showImage(currentImageIndex + 1);
  });

  imageLightbox.addEventListener("click", (event) => {
    if (event.target === imageLightbox) imageLightbox.close();
  });

  imageLightbox.addEventListener("close", () => {
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";
    lightboxCaption.textContent = "";
    currentImageIndex = -1;
  });
}
