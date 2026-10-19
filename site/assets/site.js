// Code tabs, the live hero diagram, and the docs table of contents.

document.querySelectorAll("[data-tabs]").forEach((box) => {
  const tabs = [...box.querySelectorAll("[data-tab]")];
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
    box.querySelectorAll("[data-panel]").forEach((p) => { p.hidden = p.dataset.panel !== tab.dataset.tab; });
  }));
});

const live = document.querySelector("[data-live]");
if (live) {
  const NS = "http://www.w3.org/2000/svg";
  const layer = live.querySelector("[data-pulses]");
  const log = document.querySelector("[data-log]");
  const sources = ["POST /bastion/notification", "bastion-emit-notification", "SNS → /bastion/notification"];
  const channels = ["orders", "chat", "index"];
  const payloads = ['{ id: 42, status: "shipped" }', '{ from: "ana", text: "on my way" }', '{ build: 118, ok: true }', '{ price: 31.5 }', '{ typing: true }'];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const travel = (path, amber, ms) => new Promise((done) => {
    const dot = document.createElementNS(NS, "circle");
    dot.setAttribute("r", "5");
    dot.setAttribute("class", amber ? "pulse amber" : "pulse");
    layer.appendChild(dot);
    const len = path.getTotalLength();
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / ms, 1);
      const p = path.getPointAtLength(len * t);
      dot.setAttribute("cx", p.x);
      dot.setAttribute("cy", p.y);
      if (t < 1) requestAnimationFrame(step); else { dot.remove(); done(); }
    };
    requestAnimationFrame(step);
  });

  const write = (html) => {
    const line = document.createElement("div");
    line.innerHTML = html;
    log.appendChild(line);
    while (log.children.length > 5) log.firstChild.remove();
  };

  const fire = async () => {
    const s = Math.floor(Math.random() * 3);
    const targets = channels.map((_, i) => i).filter(() => Math.random() < 0.5);
    if (!targets.length) targets.push(Math.floor(Math.random() * 3));
    const amber = s === 0;
    const src = live.querySelector(`[data-src="${s}"]`);
    src.classList.add("hit");
    await travel(live.querySelector(`#in${s}`), amber, 650);
    src.classList.remove("hit");
    const payload = payloads[Math.floor(Math.random() * payloads.length)];
    write(`<i>${sources[s]}</i> → ${targets.map((c) => "#" + channels[c]).join(" ")}`);
    await Promise.all(targets.map((c) => travel(live.querySelector(`#out${c}`), amber, 650).then(() => {
      const node = live.querySelector(`[data-ch="${c}"]`);
      node.classList.add("hit");
      setTimeout(() => node.classList.remove("hit"), 500);
    })));
    write(`<b>bastion-notification</b> ${payload}`);
  };

  if (reduced) {
    write("<i>POST /bastion/notification</i> → #orders #index");
    write('<b>bastion-notification</b> { id: 42, status: "shipped" }');
  } else {
    fire();
    setInterval(() => { if (!document.hidden) fire(); }, 1900);
  }
}

const links = [...document.querySelectorAll(".toc a")];
if (links.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  links.forEach((a) => {
    const s = document.querySelector(a.getAttribute("href"));
    if (s) io.observe(s);
  });
}
