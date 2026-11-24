const icons = {
  brand: '<path d="m2 14 6.5-8.5 5 6 3.5-4 5 6-6.5 8-5-6-3.5 4z" fill="currentColor" stroke="none"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  chat: '<path d="M20.5 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L4 20l1-4a8.5 8.5 0 1 1 15.5-4.5Z"/><path d="M8.5 11.5h7"/>',
  phone: '<path d="M20.7 16.2v2.4a2 2 0 0 1-2.2 2A17 17 0 0 1 3.4 5.5a2 2 0 0 1 2-2.2h2.4a2 2 0 0 1 2 1.7l.5 2.5a2 2 0 0 1-.5 2.1l-1.3 1.2a13 13 0 0 0 4.7 4.7l1.2-1.3a2 2 0 0 1 2.1-.5l2.5.5a2 2 0 0 1 1.7 2Z"/>',
  spark: '<path d="M12 2 14.5 8.5 21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5Z"/><path d="m20 15 1 2.5 2 1-2 1-1 2.5-1-2.5-2-1 2-1Z" stroke-width="1.3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  window: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
  mobile: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18h2"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8H8.5A2.5 2.5 0 1 1 11 5.5L12 8Zm0 0h3.5A2.5 2.5 0 1 0 13 5.5L12 8Z"/>',
  nfc: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M9.5 10.5a2 2 0 0 1 0 3m3-5a5 5 0 0 1 0 7m3-9a8 8 0 0 1 0 11"/>',
  qr: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><path d="M15 13v4h4m2-4v2m-6 6h2m4-2v2"/>'
};
for (const icon of document.querySelectorAll("[data-icon]")) {
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${icons[icon.dataset.icon]}</svg>`;
}

for (const wave of document.querySelectorAll("[data-wave]")) {
  const heights = [6, 11, 8, 16, 12, 19, 12, 8, 11, 6];
  heights.forEach((height, index) => {
    const bar = document.createElement("span");
    bar.style.setProperty("--height", `${height}px`);
    bar.style.setProperty("--delay", `${index * -0.16}s`);
    wave.append(bar);
  });
}

const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(selected) {
  for (const tab of tabs) {
    const active = tab === selected;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !active;
  }
}
for (const tab of tabs) {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    const index = tabs.indexOf(tab);
    const destinations = {
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1
    };
    if (!Object.hasOwn(destinations, event.key)) return;
    event.preventDefault();
    const selected = tabs[destinations[event.key]];
    activateTab(selected);
    selected.focus();
  });
}

const menu = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
function setMenuOpen(open) {
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  nav.classList.toggle("open", open);
}
menu.addEventListener("click", () => setMenuOpen(menu.getAttribute("aria-expanded") === "false"));
for (const link of nav.querySelectorAll("a")) {
  link.addEventListener("click", () => setMenuOpen(false));
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menu.focus();
  }
});

const contactToggle = document.getElementById("contact-form-toggle");
const contactForm = document.getElementById("contact-form");

contactToggle?.addEventListener("click", () => {
  const opening = contactForm.hidden;
  contactForm.hidden = !opening;
  contactToggle.setAttribute("aria-expanded", String(opening));
  if (opening) contactForm.elements.nombre.focus();
});

const appFilters = document.querySelectorAll("[data-app-filter]");
const appExamples = document.querySelectorAll("[data-app-category]");
for (const filter of appFilters) {
  filter.addEventListener("click", () => {
    const category = filter.dataset.appFilter;
    for (const option of appFilters) {
      option.setAttribute("aria-pressed", String(option === filter));
    }
    for (const example of appExamples) {
      example.hidden = category !== "todos" && example.dataset.appCategory !== category;
    }
  });
}

const quoteSubmit = contactForm.querySelector('button[type="submit"]');
const quoteFeedback = contactForm.querySelector(".contact-feedback");
let quoteToken = "";
let quoteWidget;
let quoteSending = false;

function quoteStatus(message, failed = false) {
  quoteFeedback.textContent = message;
  quoteFeedback.toggleAttribute("data-error", failed);
}

initEnlaVerification("#quote-verification", {
  ready(token) {
    quoteToken = token;
    quoteSubmit.disabled = quoteSending;
  },
  reset() {
    quoteToken = "";
    quoteSubmit.disabled = true;
  },
  unavailable() {
    quoteStatus("La verificación no está disponible. También puedes contactarnos por WhatsApp.", true);
  }
}).then(widget => { quoteWidget = widget; });

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!quoteToken || quoteSending) return;
  const {nombre, prefijo, telefono, correo, tipo, idea} = Object.fromEntries(new FormData(contactForm));
  const phone = telefono.trim();
  const email = correo.trim();
  if (!phone && !email) {
    quoteStatus("Escribe un número de teléfono o un correo electrónico.", true);
    contactForm.elements.telefono.focus();
    return;
  }

  const internationalPhone = phone && (phone.startsWith("+") ? phone : `${prefijo} ${phone}`);
  const digits = internationalPhone.replace(/[^0-9]/g, "");
  if (phone && (!/^\+?[0-9 ().-]+$/.test(internationalPhone) || phone.replace(/[^0-9]/g, "").length < 7 || digits.length > 15)) {
    quoteStatus("Escribe un número de teléfono válido.", true);
    contactForm.elements.telefono.focus();
    return;
  }

  const contacto = [internationalPhone, email].filter(Boolean).join(" · ");
  quoteSending = true;
  quoteSubmit.disabled = true;
  quoteStatus("Enviando solicitud…");

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({nombre, contacto, tipo, idea, turnstileToken: quoteToken})
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.error);
    contactForm.reset();
    quoteStatus("Tu solicitud se envió correctamente.");
  } catch {
    quoteStatus("No pudimos enviar tu solicitud. Inténtalo nuevamente o escríbenos por WhatsApp.", true);
  } finally {
    quoteSending = false;
    quoteToken = "";
    if (quoteWidget != null) window.turnstile.reset(quoteWidget);
  }
});
