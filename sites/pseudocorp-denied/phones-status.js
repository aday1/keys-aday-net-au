(function () {
  function esc(s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function badge(conn, reg) {
    if (conn === "CONNECTED" || reg) {
      return '<span class="badge ok">registered</span>';
    }
    return '<span class="badge off">offline</span>';
  }

  function fmtSeen(iso) {
    if (!iso) return "no recent SIP contact";
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      return d.toLocaleString();
    } catch (e) {
      return iso;
    }
  }

  function renderHumans(humans, el) {
    if (!el) return;
    if (!humans || !humans.length) {
      el.innerHTML = "<p class=\"small\">No human phone status yet.</p>";
      return;
    }
    var rows = humans.map(function (h) {
      var last = h.last_seen
        ? "Last SIP: " + esc(fmtSeen(h.last_seen))
        : (h.registered ? "Registered (no timestamp)" : "Not registered");
      if (h.last_call) {
        last += " — last call " + esc(h.last_call);
      }
      return (
        "<tr><td><code>" + esc(h.ext) + "</code></td>" +
        "<td>" + esc(h.name) + "</td>" +
        "<td>" + badge(h.connection, h.registered) + "</td>" +
        "<td class=\"small\">" + last + "</td></tr>"
      );
    });
    el.innerHTML =
      "<table class=\"status\"><thead><tr><th>Ext</th><th>Name</th><th>SIP</th><th>Activity</th></tr></thead><tbody>" +
      rows.join("") +
      "</tbody></table>";
  }

  function renderExtensions(exts, el) {
    if (!el || !exts) return;
    var rows = exts.map(function (e) {
      var kind = e.kind === "phone" ? "human" : "agent";
      return (
        "<tr><td><code>" + esc(e.ext) + "</code></td>" +
        "<td>" + esc(e.name) + "</td>" +
        "<td>" + esc(kind) + "</td>" +
        "<td class=\"small\">" + esc(e.device) + "</td></tr>"
      );
    });
    el.innerHTML =
      "<table class=\"ext\"><thead><tr><th>Ext</th><th>Name</th><th>Type</th><th>Role</th></tr></thead><tbody>" +
      rows.join("") +
      "</tbody></table>";
  }

  function loadStatus(url, humansEl, extEl, metaEl) {
    fetch(url + "?_=" + Date.now())
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (data) {
        if (!data) {
          if (metaEl) metaEl.textContent = "Status unavailable.";
          return;
        }
        if (metaEl) {
          metaEl.textContent =
            "Directory updated " +
            (data.updated || "?") +
            (data.asterisk_up === false ? " — PBX offline" : "");
        }
        renderHumans(data.humans, humansEl);
        renderExtensions(data.extensions, extEl);
      })
      .catch(function () {
        if (metaEl) metaEl.textContent = "Could not load status.";
      });
  }

  window.PseudocorpPhonesStatus = {
    load: loadStatus,
    renderHumans: renderHumans,
    renderExtensions: renderExtensions,
  };
})();
