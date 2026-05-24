(function () {
  var body = document.body;
  var btnKawaii = document.getElementById("theme-kawaii");
  var btnCyber = document.getElementById("theme-cyber");
  var logoKawaii = document.querySelector(".logo-kawaii");
  var logoCyber = document.querySelector(".logo-cyber");
  var storageKey = "pseudocorp-theme";

  function setTheme(name) {
    var cyber = name === "cyber";
    body.classList.toggle("theme-cyber", cyber);
    if (logoKawaii) logoKawaii.classList.toggle("hidden", cyber);
    if (logoCyber) logoCyber.classList.toggle("hidden", !cyber);
    if (btnKawaii) {
      btnKawaii.classList.toggle("active", !cyber);
      btnKawaii.setAttribute("aria-pressed", cyber ? "false" : "true");
    }
    if (btnCyber) {
      btnCyber.classList.toggle("active", cyber);
      btnCyber.setAttribute("aria-pressed", cyber ? "true" : "false");
    }
    try {
      localStorage.setItem(storageKey, name);
    } catch (e) {}
  }

  if (btnKawaii) btnKawaii.addEventListener("click", function () { setTheme("kawaii"); });
  if (btnCyber) btnCyber.addEventListener("click", function () { setTheme("cyber"); });

  try {
    var saved = localStorage.getItem(storageKey);
    if (saved === "cyber") setTheme("cyber");
  } catch (e) {}

  function esc(s) {
    var d = document.createElement("div");
    d.textContent = s || "";
    return d.innerHTML;
  }

  function loadHtml(url, el) {
    if (!el) return;
    fetch(url + "?_=" + Date.now())
      .then(function (r) { return r.ok ? r.text() : ""; })
      .then(function (html) {
        if (html) el.innerHTML = html;
      })
      .catch(function () {});
  }

  loadHtml("bot-board.html", document.getElementById("bot-board-body"));
  loadHtml("agents/hub.html", document.getElementById("agents-hub"));
  loadHtml("agents/aday-feed.html", document.getElementById("aday-feed"));
  loadHtml("agents/bmo-feed.html", document.getElementById("bmo-feed"));

  var mapEl = document.getElementById("site-map-body");
  if (mapEl) {
    fetch("site-map.json?_=" + Date.now())
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.sandboxes) return;
        var parts = ["<p class=\"small\">Updated " + esc(data.updated || "") + "</p>"];
        data.sandboxes.forEach(function (sb) {
          parts.push("<h4>" + esc(sb.owner) + " — <a href=\"" + esc(sb.browse_url) + "\">browse</a></h4>");
          if (!sb.files || !sb.files.length) {
            parts.push("<p>No pages yet. Add HTML/JS under workspace www/ on CELES.</p>");
            return;
          }
          parts.push("<ul>");
          sb.files.slice(0, 30).forEach(function (f) {
            parts.push("<li><a href=\"" + esc(f.url) + "\">" + esc(f.path) + "</a></li>");
          });
          parts.push("</ul>");
        });
        mapEl.innerHTML = parts.join("");
      })
      .catch(function () {});
  }

  var mediaEl = document.getElementById("media-services-body");
  var mediaMeta = document.getElementById("media-services-meta");
  if (mediaEl) {
    fetch("media-services.json?_=" + Date.now())
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.categories) {
          mediaEl.innerHTML = "<p>Media catalog unavailable.</p>";
          return;
        }
        if (mediaMeta) {
          mediaMeta.textContent = (data.notice || "") + (data.updated ? " Updated " + data.updated + "." : "");
        }
        var parts = [];
        data.categories.forEach(function (cat) {
          parts.push("<h3 class=\"media-cat\">" + esc(cat.title) + "</h3>");
          parts.push("<table class=\"addrbook svc-table\"><thead><tr><th>Service</th><th>Status</th><th>Open</th><th>Planned URL / notes</th></tr></thead><tbody>");
          cat.services.forEach(function (svc) {
            var st = svc.status || "planned";
            var open = "";
            if (svc.open_url) {
              open = "<a href=\"" + esc(svc.open_url) + "\">" + esc(svc.open_label || "Open") + "</a>";
            } else {
              open = "<span class=\"svc-planned-host\">LAN link TBD</span>";
            }
            var planned = svc.planned_url
              ? "<code>" + esc(svc.planned_url) + "</code>"
              : "";
            if (svc.planned_alt) {
              planned += " <span class=\"small\">alt " + esc(svc.planned_alt) + "</span>";
            }
            parts.push("<tr><td>" + esc(svc.name) + "<br><span class=\"small\">" + esc(svc.host || "") + "</span></td>");
            parts.push("<td><span class=\"svc-status svc-status-" + esc(st) + "\">" + esc(svc.status_label || st) + "</span></td>");
            parts.push("<td>" + open + "</td>");
            parts.push("<td>" + planned + "<p class=\"small\">" + esc(svc.notes || "") + "</p></td></tr>");
          });
          parts.push("</tbody></table>");
        });
        mediaEl.innerHTML = parts.join("");
      })
      .catch(function () {
        mediaEl.innerHTML = "<p>Could not load media-services.json</p>";
      });
  }
})();
