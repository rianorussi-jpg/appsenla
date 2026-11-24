async function initEnlaVerification(container, events) {
  try {
    const response = await fetch("/api/turnstile-config", {cache: "no-store"});
    const {siteKey} = await response.json();
    if (!response.ok || !siteKey || !window.turnstile) throw new Error("Turnstile no disponible");
    return window.turnstile.render(container, {
      sitekey: siteKey,
      theme: "light",
      size: "compact",
      action: "contact_form",
      callback: events.ready,
      "expired-callback": events.reset,
      "error-callback": () => {
        events.reset();
        events.unavailable();
      }
    });
  } catch {
    events.unavailable();
  }
}
