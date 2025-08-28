const scrollContainer = document.querySelector(".scrollHorizontal");
const scrollSpeed = 2;
const accordions = document.querySelectorAll(".titreSousComp");

// Scroll horizontal avec molette
window.addEventListener(
    "wheel",
    (e) => {
        // Si une box est ouverte → pas de scroll
        if (window.location.hash.startsWith("#box")) return;

        const rect = scrollContainer.getBoundingClientRect();
        const tolerance = 25; // marge en pixel
        const inZone = rect.top <= tolerance && rect.bottom > window.innerHeight - tolerance;
        if (!inZone) return;

        const down = e.deltaY > 0;
        const up = e.deltaY < 0;
        const atStart = scrollContainer.scrollLeft <= 0;
        const atEnd = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1;

        if ((up && !atStart) || (down && !atEnd)) {
            e.preventDefault();
            scrollContainer.scrollLeft += e.deltaY * scrollSpeed;
        }
    },
    { passive: false }
);

// ----- Porsche -----
const carWrapper = document.querySelector(".car-wrapper");
const carImg = document.querySelector(".car");

function getCarWidth() {
    const w = carImg.getBoundingClientRect().width;
    return w > 0 ? w : carImg.naturalWidth || 0;
}

function updateCar() {
    const rect = scrollContainer.getBoundingClientRect();
    const tolerance = 25;
    const inZone = rect.top <= tolerance && rect.bottom > window.innerHeight - tolerance;

    // Si une box est ouverte, on cache la voiture
    if (window.location.hash.startsWith("#box")) {
        carWrapper.classList.add("hidden");
        return;
    }

    if (!inZone) {
        carWrapper.classList.add("hidden");
        return;
    }
    carWrapper.classList.remove("hidden");

    const sl = scrollContainer.scrollLeft;
    const sw = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const pct = sw > 0 ? sl / sw : 0;

    const carW = getCarWidth();
    const maxX = Math.max(0, window.innerWidth - carW);
    const x = pct * maxX;

    carWrapper.style.transform = `translateX(${x}px)`;
}

scrollContainer.addEventListener("scroll", updateCar);
window.addEventListener("scroll", updateCar);
window.addEventListener("resize", updateCar);
if (carImg.complete) updateCar();
else carImg.addEventListener("load", updateCar);

accordions.forEach((accordion) => {
    accordion.addEventListener("click", () => {
        const panel = accordion.nextElementSibling;
        const arrow = accordion.querySelector(".arrow");

        accordion.classList.toggle("active");

        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
            panel.classList.remove("open");
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
            panel.classList.add("open");
        }
    });
});

// ----- Gestion des box -----
const boxes = document.querySelectorAll(".couvrancebox");

// Sur changement de hash (ou fermeture avec bouton ×)
window.addEventListener("hashchange", () => {
    const isBox = window.location.hash.startsWith("#box");
    document.body.style.overflow = isBox ? "hidden" : "";
    carWrapper.classList.toggle("hidden", isBox);
    if (!isBox) updateCar(); // recalcul dès qu'on quitte une box
});

// Chargement initial 
document.addEventListener("DOMContentLoaded", () => {
    const isBox = window.location.hash.startsWith("#box");
    document.body.style.overflow = isBox ? "hidden" : "";
    carWrapper.classList.toggle("hidden", isBox);
    updateCar();
});

