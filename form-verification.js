const parentOrigins = new Set(["https://www.enla.mx", "https://enla.mx", "https://enlahome.vercel.app"]);
const parentOrigin = location.ancestorOrigins?.[0] || (document.referrer && new URL(document.referrer).origin);

if (window.parent !== window && parentOrigins.has(parentOrigin)) {
  let homeToken = "";
  let homeWidget;
  let homeSending = false;

  function signal(type, attributes = {}) {
    window.parent.postMessage({type: "enla-contact:" + type, ...attributes}, parentOrigin);
  }

  initEnlaVerification("#home-verification", {
    ready(token) {
      homeToken = token;
      signal("ready");
    },
    reset() {
      homeToken = "";
      signal("reset");
    },
    unavailable() {
      signal("unavailable");
    }
  }).then(widget => { homeWidget = widget; });

  window.addEventListener("message", async (event) => {
    if (event.source !== window.parent || event.origin !== parentOrigin || event.data?.type !== "enla-contact:submit" || !homeToken || homeSending) return;
    homeSending = true;
    try {
      const response = await fetch("/api/home-contact", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({...event.data.fields, turnstileToken: homeToken})
      });
      const result = await response.json();
      signal("result", {success: response.ok && result.success === true});
    } catch {
      signal("result", {success: false});
    } finally {
      homeToken = "";
      homeSending = false;
      if (homeWidget != null) window.turnstile.reset(homeWidget);
    }
  });
}
