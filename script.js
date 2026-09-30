// Replace this number if the service centre WhatsApp number changes.
const serviceWhatsAppNumber = "917764018221";

const form = document.querySelector("#booking-form");
const serviceSelect = document.querySelector("#service");
const errorMessage = document.querySelector("#error");
const toast = document.querySelector("#toast");
const menuButton = document.querySelector("#menu");
const navigation = document.querySelector("#main-nav");
const backToTopButton = document.querySelector("#up");

// Choose a service card and move the customer to the booking form.
document.querySelectorAll(".service").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".service").forEach((item) => {
      item.classList.remove("selected");
    });

    card.classList.add("selected");
    serviceSelect.value = card.dataset.service;

    document.querySelector("#booking").scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Validate and send the request to WhatsApp.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const phone = document.querySelector("#phone").value.trim();
  const address = document.querySelector("#address").value.trim();
  const issue = document.querySelector("#issue").value.trim();

  if (!name || !address || !/^\d{10}$/.test(phone)) {
    errorMessage.textContent = "Please enter your name, address, and a valid 10-digit phone number.";
    return;
  }

  errorMessage.textContent = "";

  const request = {
    name,
    phone,
    service: serviceSelect.value,
    address,
    issue,
    createdAt: new Date().toISOString()
  };

  const savedRequests = JSON.parse(
    localStorage.getItem("purecareRequests") || "[]"
  );

  savedRequests.push(request);
  localStorage.setItem("purecareRequests", JSON.stringify(savedRequests));

  const message = [
    "*New PureCare RO Service Request*",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Service: ${serviceSelect.value}`,
    `Address: ${address}`,
    `Problem: ${issue || "Not specified"}`
  ].join("\n");

  window.open(
    `https://wa.me/${serviceWhatsAppNumber}?text=${encodeURIComponent(message)}`,
    "_blank"
  );

  form.reset();
  toast.classList.add("visible");

  window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 4500);
});

// Open and close the mobile navigation.
menuButton.addEventListener("click", () => {
  navigation.classList.toggle("open");
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
  });
});

// Animate counters when they enter the viewport.
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const counter = entry.target;
    const target = Number(counter.dataset.counter);
    const startTime = performance.now();
    const animationDuration = 900;

    const updateCounter = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / animationDuration,
        1
      );

      counter.textContent = Math.floor(target * progress).toLocaleString("en-IN");

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.5 });

document.querySelectorAll("[data-counter]").forEach((counter) => {
  counterObserver.observe(counter);
});

// Fade elements in as the visitor scrolls.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

// Display and run the back-to-top button.
window.addEventListener("scroll", () => {
  backToTopButton.classList.toggle("visible", window.scrollY > 500);
}, { passive: true });

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector("#year").textContent = new Date().getFullYear();
