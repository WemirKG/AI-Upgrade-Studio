/* AI Upgrade Studio — all demos are self-contained (no APIs) */
(() => {
  // ========= Configure your payment link here =========
  const PAYMENT_LINK = ""; // مثال: "https://buy.stripe.com/xxxx" or "https://paypal.me/yourname/200"

  // ========= Utilities =========
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const now = () => performance.now();

  // ========= Year =========
  $("#year").textContent = String(new Date().getFullYear());

  // ========= Wire payment link =========
  const payLink = $("#payLink");
  if (PAYMENT_LINK) payLink.href = PAYMENT_LINK;

  // ========= Typewriter =========
  const tw = $("#typewriter");
  const lines = [
    "Upgrade installed: your site now feels alive.",
    "AI-ready UI blocks: interactive, premium, fast.",
    "Black + gold futuristic design that converts.",
    "Drop-in modules: games, tools, flows, audio UX.",
    "Build for the minds of the future."
  ];
  let li = 0, ci = 0, dir = 1, hold = 0;

  function tickTypewriter() {
    const t = lines[li];
    if (hold > 0) { hold--; requestAnimationFrame(tickTypewriter); return; }
    ci += dir;
    if (ci >= t.length) { ci = t.length; dir = -1; hold = 50; }
    if (ci <= 0) { ci = 0; dir = 1; li = (li + 1) % lines.length; hold = 12; }
    tw.textContent = t.slice(0, ci);
    requestAnimationFrame(tickTypewriter);
  }
  tickTypewriter();

  // ========= Terminal typing demo =========
  const term = $("#terminal");
  const terminalScript = [
    "ai-upgrade-studio@console:~$ init upgrade --module \"Customer Journey Flow\"",
    "✔ Scanning site structure...",
    "✔ Injecting interactive canvas layer...",
    "✔ Applying black+gold theme tokens...",
    "✔ Wiring keyboard + touch controls...",
    "✔ Performance pass: 60fps target",
    "",
    "Result: Your site just leveled up.",
    "Next: complete intake form → deliver integration snippet."
  ];
  let termLine = 0, termChar = 0;

  function tickTerminal() {
    const current = terminalScript[termLine] ?? "";
    if (termLine >= terminalScript.length) return;
    term.textContent = terminalScript.slice(0, termLine).join("\n") + "\n" + current.slice(0, termChar) + (termChar % 12 < 6 ? "▌" : "");
    termChar++;
    if (termChar > current.length) { termLine++; termChar = 0; }
    setTimeout(tickTerminal, 18);
  }
  tickTerminal();

  // ========= Stars background =========
  const stars = $("#stars");
  const sctx = stars.getContext("2d");
  let SW = 0, SH = 0, starField = [];

  function resizeStars() {
    SW = stars.width = Math.floor(window.innerWidth * devicePixelRatio);
    SH = stars.height = Math.floor(window.innerHeight * devicePixelRatio);
    stars.style.width = "100%";
    stars.style.height = "100%";
    const count = Math.floor((SW * SH) / (220000));
    starField = new Array(count).fill(0).map(() => ({
      x: Math.random() * SW,
      y: Math.random() * SH,
      z: Math.random() * 1,
      r: (Math.random() * 1.6 + 0.2) * devicePixelRatio
    }));
  }
  window.addEventListener("resize", resizeStars);
  resizeStars();

  function drawStars() {
    sctx.clearRect(0,0,SW,SH);
    for (const st of starField) {
      st.y += (0.12 + st.z * 0.45) * devicePixelRatio;
      if (st.y > SH + 10) { st.y = -10; st.x = Math.random() * SW; }
      sctx.globalAlpha = 0.55 + st.z * 0.35;
      sctx.beginPath();
      sctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
      sctx.fillStyle = "white";
      sctx.fill();
    }
    requestAnimationFrame(drawStars);
  }
  drawStars();

  // ========= Modal system =========
  const modal = $("#demoModal");
  const demoMount = $("#demoMount");
  const demoTitle = $("#demoTitle");
  const demoSub = $("#demoSub");
  const demoHints = $("#demoHints");

  let currentDemo = null;

  function openModal() {
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (currentDemo && currentDemo.destroy) currentDemo.destroy();
    currentDemo = null;
    demoMount.innerHTML = "";
    demoHints.textContent = "";
  }
  $$("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") closeModal();
  });

  // ========= Intake form summary =========
  const intakeForm = $("#intakeForm");
  const summaryText = $("#summaryText");
  const copyBtn = $("#copySummaryBtn");

  intakeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(intakeForm);
    const payload = Object.fromEntries(data.entries());
    const out =
`AI UPGRADE INTAKE
----------------
Website:   ${payload.url}
Email:     ${payload.email}
Module:    ${payload.module}
Placement: ${payload.placement}

Goal:
${payload.goal}

Brand notes:
${payload.brand || "(none)"}

Payment:
${PAYMENT_LINK ? "Paid via link: " + PAYMENT_LINK : "Add your payment link in app.js (PAYMENT_LINK)"}`
    summaryText.textContent = out;
    summaryText.scrollIntoView({behavior:"smooth", block:"center"});
  });

  copyBtn.addEventListener("click", async () => {
    const text = summaryText.textContent.trim();
    if (!text || text.includes("(Your summary will appear here)")) return;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Copied!";
      setTimeout(() => copyBtn.textContent = "Copy Summary", 900);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      copyBtn.textContent = "Copied!";
      setTimeout(() => copyBtn.textContent = "Copy Summary", 900);
    }
  });

  // ========= Footer buttons =========
  $("#openDemosBtn").addEventListener("click", () => launchDemo("space"));
  $("#openDemosBtn2").addEventListener("click", () => launchDemo("space"));
  $("#openIntakeBtn").addEventListener("click", () => location.hash = "#intake");
  $("#openIntakeBtn2").addEventListener("click", () => location.hash = "#intake");

  // ========= Demo launcher wiring =========
  $$("[data-open-demo]").forEach(btn => {
    btn.addEventListener("click", () => launchDemo(btn.dataset.openDemo));
  });

  function mountCanvas(wrap, height=520) {
    const c = document.createElement("canvas");
    c.style.width = "100%";
    c.style.height = height + "px";
    c.width = Math.floor(wrap.clientWidth * devicePixelRatio);
    c.height = Math.floor(height * devicePixelRatio);
    wrap.appendChild(c);
    const ctx = c.getContext("2d");
    return { canvas: c, ctx };
  }

  function launchDemo(which) {
    // destroy old demo
    if (currentDemo && currentDemo.destroy) currentDemo.destroy();
    demoMount.innerHTML = "";
    demoHints.textContent = "";

    const demos = {
      space: createSpaceDogfight,
      matrix: createSkillsMatrix,
      cloud: createCloudPainter,
      journey: createJourneyFlow,
      theatre: createWeatherTheatre,
      brutal: createBrutalistLanding,
      drums: createDrumKit
    };

    const fn = demos[which];
    if (!fn) return;

    const meta = {
      space: ["Space Dogfight", "Fly, dodge, and fight AI ships (Canvas)", "WASD/Arrows move • Space shoots • P pauses"],
      matrix: ["Employee Skills Matrix", "Editable skills grid with proficiency levels", "Click cells to change level • Add rows/cols"],
      cloud: ["Cloud Painter", "Paint clouds, drift, planes, save image", "Draw with mouse/touch • Change brush • Arrow keys fly • Save PNG"],
      journey: ["Customer Journey Flow", "Drag stages and connect them", "Drag nodes • Click node then another to link • Double-click to rename"],
      theatre: ["Weather Theatre", "Stage-set remix of the same forecast", "Use sliders • Toggle Matinée/Night • Curtain reveal button"],
      brutal: ["Brutalist Dev Landing", "Monochrome grid, code tabs, pricing modal", "Toggle invert • Copy code • Open pricing modal"],
      drums: ["Virtual Drum Kit", "Tap pads or use keys, record and playback", "Keys: A S D F J K L ; • Record → Play"]
    };

    demoTitle.textContent = meta[which][0];
    demoSub.textContent = meta[which][1];
    demoHints.textContent = "Controls: " + meta[which][2];

    openModal();
    currentDemo = fn(demoMount);
  }

  // ==========================================================
  // DEMO 1: SPACE DOGFIGHT (Canvas)
  // ==========================================================
  function createSpaceDogfight(mount) {
    const wrap = document.createElement("div");
    wrap.style.padding = "10px";
    mount.appendChild(wrap);

    const hud = document.createElement("div");
    hud.style.display = "flex";
    hud.style.gap = "10px";
    hud.style.alignItems = "center";
    hud.style.justifyContent = "space-between";
    hud.style.padding = "8px 8px 10px";
    hud.style.color = "rgba(255,255,255,.80)";
    hud.style.fontWeight = "800";
    hud.innerHTML = `
      <div>Score: <span id="sdScore">0</span> • HP: <span id="sdHp">100</span></div>
      <div style="display:flex;gap:8px">
        <button class="btn small ghost" id="sdReset" type="button">Reset</button>
        <button class="btn small primary" id="sdBoost" type="button">Boost</button>
      </div>
    `;
    wrap.appendChild(hud);

    const { canvas, ctx } = mountCanvas(wrap, 520);
    const scoreEl = $("#sdScore", wrap);
    const hpEl = $("#sdHp", wrap);
    const resetBtn = $("#sdReset", wrap);
    const boostBtn = $("#sdBoost", wrap);

    let W = canvas.width, H = canvas.height;
    const keys = new Set();
    let paused = false;

    const player = {
      x: W*0.25, y: H*0.5, vx:0, vy:0,
      a:0, hp:100, cd:0, boost:0
    };

    const bullets = [];
    const enemies = [];
    const asteroids = [];
    let score = 0;

    function rand(a,b){ return a + Math.random()*(b-a); }

    function spawnEnemy() {
      const side = Math.random() < 0.5 ? 1 : 0;
      enemies.push({
        x: side ? W*0.9 : W*0.65,
        y: rand(H*0.1, H*0.9),
        vx: rand(-0.8,-0.2)*devicePixelRatio,
        vy: rand(-0.3,0.3)*devicePixelRatio,
        hp: 18,
        fire: rand(20,80)
      });
    }
    function spawnAsteroid() {
      const r = rand(14, 34)*devicePixelRatio;
      asteroids.push({
        x: W + r,
        y: rand(r, H-r),
        vx: rand(-1.4,-0.6)*devicePixelRatio,
        vy: rand(-0.4,0.4)*devicePixelRatio,
        r
      });
    }

    for (let i=0;i<3;i++) spawnEnemy();
    for (let i=0;i<6;i++) spawnAsteroid();

    function shoot(from, dirX, dirY, speed, friendly=true) {
      bullets.push({
        x: from.x, y: from.y,
        vx: dirX*speed, vy: dirY*speed,
        r: 3*devicePixelRatio,
        friendly,
        life: 160
      });
    }

    function drawShip(x,y,angle,scale=1, accent="gold") {
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(angle);
      ctx.scale(scale, scale);

      // hull
      ctx.beginPath();
      ctx.moveTo(18,0);
      ctx.lineTo(-12,-10);
      ctx.lineTo(-8,0);
      ctx.lineTo(-12,10);
      ctx.closePath();
      ctx.fillStyle = "rgba(10,8,18,.85)";
      ctx.fill();

      // outline
      ctx.strokeStyle = "rgba(255,255,255,.22)";
      ctx.lineWidth = 2*devicePixelRatio/scale;
      ctx.stroke();

      // accent
      ctx.beginPath();
      ctx.moveTo(12,0);
      ctx.lineTo(-6,-6);
      ctx.lineTo(-4,0);
      ctx.lineTo(-6,6);
      ctx.closePath();
      ctx.fillStyle = accent === "gold" ? "rgba(247,215,116,.95)" : "rgba(139,243,255,.95)";
      ctx.globalAlpha = 0.9;
      ctx.fill();

      // engine glow
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(-12,0, 7, 0, Math.PI*2);
      ctx.fillStyle = "rgba(255,61,242,.55)";
      ctx.fill();

      ctx.restore();
    }

    function collideCircle(a,b,ra,rb){
      const dx=a.x-b.x, dy=a.y-b.y;
      return dx*dx+dy*dy <= (ra+rb)*(ra+rb);
    }

    function update() {
      if (paused) { requestAnimationFrame(update); return; }

      // input
      const accel = (player.boost>0 ? 0.20 : 0.12) * devicePixelRatio;
      const maxV = (player.boost>0 ? 5.2 : 3.6) * devicePixelRatio;

      let ax=0, ay=0;
      if (keys.has("ArrowUp") || keys.has("w")) ay -= accel;
      if (keys.has("ArrowDown") || keys.has("s")) ay += accel;
      if (keys.has("ArrowLeft") || keys.has("a")) ax -= accel;
      if (keys.has("ArrowRight") || keys.has("d")) ax += accel;

      player.vx = clamp(player.vx + ax, -maxV, maxV);
      player.vy = clamp(player.vy + ay, -maxV, maxV);

      player.x = clamp(player.x + player.vx, 30*devicePixelRatio, W-30*devicePixelRatio);
      player.y = clamp(player.y + player.vy, 30*devicePixelRatio, H-30*devicePixelRatio);

      // aim direction based on velocity or forward
      const aimX = (Math.abs(player.vx)+Math.abs(player.vy) > 0.2) ? player.vx : 1;
      const aimY = (Math.abs(player.vx)+Math.abs(player.vy) > 0.2) ? player.vy : 0;
      const aimLen = Math.hypot(aimX, aimY) || 1;
      player.a = Math.atan2(aimY, aimX);

      if (player.cd > 0) player.cd--;
      if (player.boost > 0) player.boost--;

      // shooting
      if (keys.has(" ") && player.cd <= 0) {
        shoot(
          {x: player.x + Math.cos(player.a)*18*devicePixelRatio, y: player.y + Math.sin(player.a)*18*devicePixelRatio},
          Math.cos(player.a), Math.sin(player.a), 7.2*devicePixelRatio, true
        );
        player.cd = 10;
      }

      // enemies AI
      for (const e of enemies) {
        // drift
        e.x += e.vx;
        e.y += e.vy;

        if (e.y < 30*devicePixelRatio || e.y > H-30*devicePixelRatio) e.vy *= -1;

        // chase lightly
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const d = Math.hypot(dx,dy) || 1;
        e.vx += (dx/d) * 0.02*devicePixelRatio;
        e.vy += (dy/d) * 0.02*devicePixelRatio;
        e.vx = clamp(e.vx, -2.8*devicePixelRatio, 0.8*devicePixelRatio);
        e.vy = clamp(e.vy, -2.2*devicePixelRatio, 2.2*devicePixelRatio);

        e.fire -= 1;
        if (e.fire <= 0 && d < 520*devicePixelRatio) {
          const ang = Math.atan2(dy,dx);
          shoot({x:e.x, y:e.y}, Math.cos(ang), Math.sin(ang), 5.2*devicePixelRatio, false);
          e.fire = rand(40, 100);
        }

        if (e.x < -80*devicePixelRatio) {
          e.x = W + 60*devicePixelRatio;
          e.y = rand(H*0.1, H*0.9);
        }
      }

      // asteroids
      for (const a of asteroids) {
        a.x += a.vx; a.y += a.vy;
        if (a.y < a.r || a.y > H-a.r) a.vy *= -1;
        if (a.x < -a.r) {
          a.x = W + a.r + rand(0, 220)*devicePixelRatio;
          a.y = rand(a.r, H-a.r);
        }
        // collision with player
        if (collideCircle({x:player.x,y:player.y}, a, 14*devicePixelRatio, a.r)) {
          player.hp = Math.max(0, player.hp - 0.8);
        }
      }

      // bullets
      for (const b of bullets) {
        b.x += b.vx; b.y += b.vy;
        b.life -= 1;
      }
      // cleanup
      for (let i=bullets.length-1;i>=0;i--){
        const b=bullets[i];
        if (b.life<=0 || b.x<-50 || b.x>W+50 || b.y<-50 || b.y>H+50) bullets.splice(i,1);
      }

      // bullet hits
      for (let i=bullets.length-1;i>=0;i--){
        const b = bullets[i];

        if (!b.friendly) {
          if (collideCircle(b, {x:player.x,y:player.y}, b.r, 14*devicePixelRatio)) {
            player.hp = Math.max(0, player.hp - 6);
            bullets.splice(i,1);
            continue;
          }
        } else {
          for (const e of enemies) {
            if (collideCircle(b, e, b.r, 14*devicePixelRatio)) {
              e.hp -= 8;
              bullets.splice(i,1);
              if (e.hp <= 0) {
                score += 50;
                e.hp = 18;
                e.x = W + 60*devicePixelRatio;
                e.y = rand(H*0.1, H*0.9);
                e.vx = rand(-0.8,-0.2)*devicePixelRatio;
                e.vy = rand(-0.3,0.3)*devicePixelRatio;
                e.fire = rand(30, 90);
              }
              break;
            }
          }
        }
      }

      // spawn pacing
      if (Math.random() < 0.012 && enemies.length < 6) spawnEnemy();
      if (Math.random() < 0.020 && asteroids.length < 10) spawnAsteroid();

      // HUD
      scoreEl.textContent = String(score);
      hpEl.textContent = String(Math.round(player.hp));

      // draw
      ctx.clearRect(0,0,W,H);
      // background haze
      ctx.fillStyle = "rgba(0,0,0,.25)";
      ctx.fillRect(0,0,W,H);

      // star streaks
      ctx.globalAlpha = 0.7;
      for (let i=0;i<36;i++){
        const x = (i*97 + (now()/20)) % W;
        const y = (i*43 + (now()/30)) % H;
        ctx.fillStyle = "rgba(255,255,255,.12)";
        ctx.fillRect(x, y, 2*devicePixelRatio, 10*devicePixelRatio);
      }
      ctx.globalAlpha = 1;

      // asteroids
      for (const a of asteroids) {
        ctx.beginPath();
        ctx.arc(a.x,a.y,a.r,0,Math.PI*2);
        ctx.fillStyle = "rgba(255,255,255,.08)";
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,.16)";
        ctx.lineWidth = 2*devicePixelRatio;
        ctx.stroke();
      }

      // bullets
      for (const b of bullets) {
        ctx.beginPath();
        ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
        ctx.fillStyle = b.friendly ? "rgba(247,215,116,.95)" : "rgba(139,243,255,.95)";
        ctx.shadowBlur = 18*devicePixelRatio;
        ctx.shadowColor = b.friendly ? "rgba(247,215,116,.55)" : "rgba(139,243,255,.55)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // enemies
      for (const e of enemies) {
        const ang = Math.atan2(player.y - e.y, player.x - e.x);
        drawShip(e.x,e.y, ang, 1.0, "cyan");
      }

      // player
      drawShip(player.x, player.y, player.a, 1.1, "gold");

      // danger overlay
      const danger = clamp(1 - player.hp/100, 0, 1);
      if (danger > 0) {
        ctx.fillStyle = `rgba(255,61,242,${danger*0.10})`;
        ctx.fillRect(0,0,W,H);
      }

      if (player.hp <= 0) {
        paused = true;
        ctx.fillStyle = "rgba(0,0,0,.55)";
        ctx.fillRect(0,0,W,H);
        ctx.fillStyle = "rgba(255,255,255,.92)";
        ctx.font = `${22*devicePixelRatio}px ui-sans-serif, system-ui`;
        ctx.fillText("Ship Down — Press Reset", 24*devicePixelRatio, 70*devicePixelRatio);
      }

      requestAnimationFrame(update);
    }

    function onKey(e) {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === "p") paused = !paused;
      keys.add(k);
    }
    function onKeyUp(e) {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keys.delete(k);
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);

    boostBtn.addEventListener("click", () => player.boost = 160);
    resetBtn.addEventListener("click", () => {
      player.hp = 100; score = 0; paused = false;
      player.x = W*0.25; player.y=H*0.5; player.vx=0; player.vy=0;
      bullets.length=0;
    });

    // handle resize
    const ro = new ResizeObserver(() => {
      const height = 520;
      canvas.width = Math.floor(wrap.clientWidth * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
      W = canvas.width; H = canvas.height;
      player.x = clamp(player.x, 30*devicePixelRatio, W-30*devicePixelRatio);
      player.y = clamp(player.y, 30*devicePixelRatio, H-30*devicePixelRatio);
    });
    ro.observe(wrap);

    update();

    return {
      destroy() {
        ro.disconnect();
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("keyup", onKeyUp);
      }
    };
  }

  // ==========================================================
  // DEMO 2: EMPLOYEE SKILLS MATRIX (Editable grid)
  // ==========================================================
  function createSkillsMatrix(mount) {
    const wrap = document.createElement("div");
    wrap.style.padding = "10px";
    mount.appendChild(wrap);

    const top = document.createElement("div");
    top.style.display="flex";
    top.style.gap="10px";
    top.style.flexWrap="wrap";
    top.style.alignItems="center";
    top.innerHTML = `
      <button class="btn small ghost" id="addEmp" type="button">+ Employee</button>
      <button class="btn small ghost" id="addSkill" type="button">+ Skill</button>
      <span style="color:rgba(255,255,255,.70);font-weight:800">Click cells to cycle: 0→1→2→3</span>
    `;
    wrap.appendChild(top);

    const tableWrap = document.createElement("div");
    tableWrap.style.marginTop = "10px";
    tableWrap.style.border = "1px solid rgba(255,255,255,.12)";
    tableWrap.style.borderRadius = "16px";
    tableWrap.style.overflow = "hidden";
    wrap.appendChild(tableWrap);

    let employees = ["Amina", "Malik", "Nia", "Jalen"];
    let skills = ["Prompting", "Automation", "UX Design", "Copywriting", "Analytics"];
    let grid = skills.map(() => employees.map(() => 0));

    function levelColor(v){
      if (v===0) return "rgba(255,255,255,.10)";
      if (v===1) return "rgba(139,243,255,.20)";
      if (v===2) return "rgba(247,215,116,.22)";
      return "rgba(255,61,242,.18)";
    }

    function render() {
      tableWrap.innerHTML = "";
      const table = document.createElement("table");
      table.style.width="100%";
      table.style.borderCollapse="separate";
      table.style.borderSpacing="0";
      table.style.fontWeight="800";
      table.style.color="rgba(255,255,255,.84)";

      const thead = document.createElement("thead");
      const hr = document.createElement("tr");

      const th0 = document.createElement("th");
      th0.textContent = "Skill \\ Employee";
      th0.style.textAlign="left";
      th0.style.padding="10px 10px";
      th0.style.background="rgba(0,0,0,.18)";
      th0.style.borderBottom="1px solid rgba(255,255,255,.10)";
      hr.appendChild(th0);

      employees.forEach((e, idx) => {
        const th = document.createElement("th");
        th.style.padding="10px 10px";
        th.style.background="rgba(0,0,0,.18)";
        th.style.borderBottom="1px solid rgba(255,255,255,.10)";
        th.style.whiteSpace="nowrap";
        th.innerHTML = `${e} <button data-del-emp="${idx}" class="miniX" title="Remove">×</button>`;
        hr.appendChild(th);
      });

      thead.appendChild(hr);
      table.appendChild(thead);

      const tbody = document.createElement("tbody");
      skills.forEach((s, r) => {
        const tr = document.createElement("tr");

        const tdS = document.createElement("td");
        tdS.style.padding="10px 10px";
        tdS.style.borderBottom="1px solid rgba(255,255,255,.08)";
        tdS.style.background="rgba(255,255,255,.03)";
        tdS.innerHTML = `${s} <button data-del-skill="${r}" class="miniX" title="Remove">×</button>`;
        tr.appendChild(tdS);

        employees.forEach((_, c) => {
          const td = document.createElement("td");
          const v = grid[r][c];
          td.style.padding="10px 10px";
          td.style.textAlign="center";
          td.style.borderBottom="1px solid rgba(255,255,255,.08)";
          td.style.cursor="pointer";
          td.style.background = levelColor(v);
          td.style.userSelect="none";
          td.dataset.r = r;
          td.dataset.c = c;
          td.textContent = String(v);
          tr.appendChild(td);
        });

        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      tableWrap.appendChild(table);

      // styles for miniX
      const style = document.createElement("style");
      style.textContent = `
        .miniX{
          margin-left:8px;
          width:22px;height:22px;
          border-radius:10px;
          border:1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.05);
          color: rgba(255,255,255,.75);
          cursor:pointer;
          font-weight:900;
        }
        .miniX:hover{border-color: rgba(255,255,255,.22); color: rgba(255,255,255,.92)}
        table th, table td{font-size: 13px}
      `;
      tableWrap.appendChild(style);

      // interactions
      $$("td[data-r]", tableWrap).forEach(cell => {
        cell.addEventListener("click", () => {
          const r = +cell.dataset.r, c = +cell.dataset.c;
          grid[r][c] = (grid[r][c] + 1) % 4;
          render();
        });
      });

      $$("button[data-del-emp]", tableWrap).forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const idx = +btn.dataset.delEmp;
          employees.splice(idx, 1);
          grid = grid.map(row => row.filter((_, i) => i !== idx));
          render();
        });
      });

      $$("button[data-del-skill]", tableWrap).forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const idx = +btn.dataset.delSkill;
          skills.splice(idx, 1);
          grid.splice(idx, 1);
          render();
        });
      });
    }

    $("#addEmp", wrap).addEventListener("click", () => {
      const name = prompt("Employee name?");
      if (!name) return;
      employees.push(name.trim());
      grid.forEach(row => row.push(0));
      render();
    });
    $("#addSkill", wrap).addEventListener("click", () => {
      const name = prompt("Skill name?");
      if (!name) return;
      skills.push(name.trim());
      grid.push(new Array(employees.length).fill(0));
      render();
    });

    render();

    return { destroy(){} };
  }

  // ==========================================================
  // DEMO 3: CLOUD PAINTER (Canvas)
  // ==========================================================
  function createCloudPainter(mount) {
    const wrap = document.createElement("div");
    wrap.style.padding = "10px";
    mount.appendChild(wrap);

    const controls = document.createElement("div");
    controls.style.display="flex";
    controls.style.gap="10px";
    controls.style.flexWrap="wrap";
    controls.style.alignItems="center";
    controls.innerHTML = `
      <label style="display:flex;gap:8px;align-items:center;color:rgba(255,255,255,.80);font-weight:900">
        Brush
        <select id="brushSel" style="padding:8px 10px;border-radius:12px">
          <option value="puff">Puff</option>
          <option value="stripe">Stripe</option>
          <option value="star">Star</option>
        </select>
      </label>
      <label style="display:flex;gap:8px;align-items:center;color:rgba(255,255,255,.80);font-weight:900">
        Size
        <input id="size" type="range" min="6" max="54" value="26" />
      </label>
      <button class="btn small ghost" id="clear" type="button">Clear</button>
      <button class="btn small primary" id="save" type="button">Save PNG</button>
      <span style="color:rgba(255,255,255,.70);font-weight:800">Arrow keys fly plane • Draw with mouse/touch</span>
    `;
    wrap.appendChild(controls);

    const { canvas, ctx } = mountCanvas(wrap, 520);
    let W = canvas.width, H = canvas.height;

    const brushSel = $("#brushSel", wrap);
    const sizeEl = $("#size", wrap);
    const clearBtn = $("#clear", wrap);
    const saveBtn = $("#save", wrap);

    const clouds = []; // strokes as points
    let drawing = false;

    const plane = { x: W*0.25, y: H*0.35, vx:0, vy:0 };
    const keys = new Set();

    function bg() {
      // sky
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0, "rgba(139,243,255,.16)");
      g.addColorStop(0.45, "rgba(199,125,255,.08)");
      g.addColorStop(1, "rgba(0,0,0,.26)");
      ctx.fillStyle = g;
      ctx.fillRect(0,0,W,H);

      // sun glow
      ctx.beginPath();
      ctx.arc(W*0.78, H*0.22, 80*devicePixelRatio, 0, Math.PI*2);
      ctx.fillStyle = "rgba(247,215,116,.14)";
      ctx.fill();
    }

    function drawCloudPoint(p) {
      const r = p.size;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = 0.45;

      if (p.brush === "puff") {
        ctx.fillStyle = "rgba(255,255,255,.85)";
        for (let i=0;i<6;i++){
          ctx.beginPath();
          ctx.arc((Math.random()*2-1)*r*0.6, (Math.random()*2-1)*r*0.4, r*(0.6+Math.random()*0.4), 0, Math.PI*2);
          ctx.fill();
        }
      } else if (p.brush === "stripe") {
        ctx.fillStyle = "rgba(255,255,255,.75)";
        for (let i=0;i<4;i++){
          ctx.fillRect(-r, (-r/2) + i*(r/3), r*2, r/6);
        }
      } else {
        // star
        ctx.fillStyle = "rgba(255,255,255,.75)";
        ctx.beginPath();
        const spikes=5, outer=r, inner=r*0.45;
        let rot = Math.PI/2*3, x=0, y=0;
        ctx.moveTo(0, -outer);
        for (let i=0;i<spikes;i++){
          x = Math.cos(rot)*outer; y = Math.sin(rot)*outer; ctx.lineTo(x,y); rot += Math.PI/spikes;
          x = Math.cos(rot)*inner; y = Math.sin(rot)*inner; ctx.lineTo(x,y); rot += Math.PI/spikes;
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    function drawPlane() {
      ctx.save();
      ctx.translate(plane.x, plane.y);
      // body
      ctx.fillStyle = "rgba(10,8,18,.85)";
      ctx.strokeStyle = "rgba(255,255,255,.20)";
      ctx.lineWidth = 2*devicePixelRatio;

      ctx.beginPath();
      ctx.moveTo(18,0);
      ctx.lineTo(-12,-7);
      ctx.lineTo(-6,0);
      ctx.lineTo(-12,7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // gold stripe
      ctx.beginPath();
      ctx.moveTo(12,0);
      ctx.lineTo(-6,-4);
      ctx.lineTo(-4,0);
      ctx.lineTo(-6,4);
      ctx.closePath();
      ctx.fillStyle = "rgba(247,215,116,.95)";
      ctx.fill();

      // trail
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.arc(-16,0,8,0,Math.PI*2);
      ctx.fillStyle = "rgba(139,243,255,.55)";
      ctx.fill();

      ctx.restore();
    }

    function update() {
      // input plane
      const a = 0.10*devicePixelRatio;
      if (keys.has("ArrowUp")) plane.vy -= a;
      if (keys.has("ArrowDown")) plane.vy += a;
      if (keys.has("ArrowLeft")) plane.vx -= a;
      if (keys.has("ArrowRight")) plane.vx += a;

      plane.vx *= 0.92;
      plane.vy *= 0.92;
      plane.x = clamp(plane.x + plane.vx, 20*devicePixelRatio, W-20*devicePixelRatio);
      plane.y = clamp(plane.y + plane.vy, 20*devicePixelRatio, H-20*devicePixelRatio);

      // drift existing clouds slowly
      for (const p of clouds) {
        p.x += p.dx;
        if (p.x > W + 60*devicePixelRatio) p.x = -60*devicePixelRatio;
      }

      // render
      ctx.clearRect(0,0,W,H);
      bg();

      // draw clouds
      for (const p of clouds) drawCloudPoint(p);

      // subtle horizon
      ctx.fillStyle = "rgba(0,0,0,.22)";
      ctx.fillRect(0, H*0.88, W, H*0.12);

      drawPlane();
      requestAnimationFrame(update);
    }

    function addPoint(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) * devicePixelRatio;
      const y = (clientY - rect.top) * devicePixelRatio;
      clouds.push({
        x, y,
        dx: 0.10*devicePixelRatio + Math.random()*0.10*devicePixelRatio,
        size: (+sizeEl.value)*devicePixelRatio,
        brush: brushSel.value
      });
      if (clouds.length > 1300) clouds.splice(0, 100);
    }

    function onDown(e) { drawing = true; const p = getPoint(e); addPoint(p.x,p.y); }
    function onMove(e) { if (!drawing) return; const p = getPoint(e); addPoint(p.x,p.y); }
    function onUp(){ drawing = false; }

    function getPoint(e) {
      if (e.touches && e.touches[0]) return { x:e.touches[0].clientX, y:e.touches[0].clientY };
      return { x:e.clientX, y:e.clientY };
    }

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", (e)=>{ e.preventDefault(); onDown(e); }, {passive:false});
    canvas.addEventListener("touchmove", (e)=>{ e.preventDefault(); onMove(e); }, {passive:false});
    window.addEventListener("touchend", onUp);

    function onKey(e){ keys.add(e.key); }
    function onKeyUp(e){ keys.delete(e.key); }
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);

    clearBtn.addEventListener("click", () => clouds.length = 0);
    saveBtn.addEventListener("click", () => {
      const a = document.createElement("a");
      a.download = "cloud-painting.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    });

    const ro = new ResizeObserver(() => {
      const height = 520;
      canvas.width = Math.floor(wrap.clientWidth * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
      W = canvas.width; H = canvas.height;
      plane.x = clamp(plane.x, 20*devicePixelRatio, W-20*devicePixelRatio);
      plane.y = clamp(plane.y, 20*devicePixelRatio, H-20*devicePixelRatio);
    });
    ro.observe(wrap);

    update();

    return {
      destroy() {
        ro.disconnect();
        canvas.removeEventListener("mousedown", onDown);
        canvas.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("keyup", onKeyUp);
      }
    };
  }

  // ==========================================================
  // DEMO 4: CUSTOMER JOURNEY FLOW (Nodes + links)
  // ==========================================================
  function createJourneyFlow(mount) {
    const wrap = document.createElement("div");
    wrap.style.padding = "10px";
    mount.appendChild(wrap);

    const info = document.createElement("div");
    info.style.display="flex";
    info.style.gap="10px";
    info.style.flexWrap="wrap";
    info.style.alignItems="center";
    info.innerHTML = `
      <button class="btn small ghost" id="addNode" type="button">+ Stage</button>
      <button class="btn small ghost" id="clearLinks" type="button">Clear Links</button>
      <span style="color:rgba(255,255,255,.70);font-weight:800">Click a node then another to connect • Double-click to rename</span>
    `;
    wrap.appendChild(info);

    const board = document.createElement("div");
    board.style.position="relative";
    board.style.height="520px";
    board.style.border="1px solid rgba(255,255,255,.12)";
    board.style.borderRadius="18px";
    board.style.overflow="hidden";
    board.style.background="rgba(0,0,0,.16)";
    board.style.marginTop="10px";
    wrap.appendChild(board);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width","100%");
    svg.setAttribute("height","100%");
    svg.style.position="absolute";
    svg.style.inset="0";
    board.appendChild(svg);

    const nodesLayer = document.createElement("div");
    nodesLayer.style.position="absolute";
    nodesLayer.style.inset="0";
    board.appendChild(nodesLayer);

    let nodes = [
      { id:1, x:120, y:110, t:"Awareness" },
      { id:2, x:320, y:110, t:"Interest" },
      { id:3, x:520, y:180, t:"Consideration" },
      { id:4, x:520, y:320, t:"Purchase" }
    ];
    let links = [
      { a:1, b:2 },
      { a:2, b:3 },
      { a:3, b:4 }
    ];
    let selected = null;

    function nodeById(id){ return nodes.find(n=>n.id===id); }

    function render() {
      // svg links
      svg.innerHTML = "";
      const defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
      defs.innerHTML = `
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(247,215,116,.75)"></path>
        </marker>
      `;
      svg.appendChild(defs);

      links.forEach(l => {
        const A = nodeById(l.a), B = nodeById(l.b);
        if (!A || !B) return;
        const line = document.createElementNS("http://www.w3.org/2000/svg","path");
        const dx = (B.x - A.x), dy = (B.y - A.y);
        const mx = A.x + dx*0.5, my = A.y + dy*0.5;
        const c1x = A.x + dx*0.25, c1y = A.y + dy*0.05;
        const c2x = mx + dx*0.10, c2y = my + dy*0.25;
        line.setAttribute("d", `M ${A.x} ${A.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${B.x} ${B.y}`);
        line.setAttribute("fill","none");
        line.setAttribute("stroke","rgba(247,215,116,.65)");
        line.setAttribute("stroke-width","3");
        line.setAttribute("marker-end","url(#arrow)");
        svg.appendChild(line);
      });

      // nodes
      nodesLayer.innerHTML = "";
      nodes.forEach(n => {
        const el = document.createElement("div");
        el.className = "jfNode";
        el.style.left = (n.x - 60) + "px";
        el.style.top  = (n.y - 26) + "px";
        el.innerHTML = `<div class="jfTitle">${n.t}</div><div class="jfSub">Stage</div>`;
        if (selected === n.id) el.classList.add("sel");
        nodesLayer.appendChild(el);

        let dragging = false;
        let ox=0, oy=0;

        el.addEventListener("mousedown", (e) => {
          dragging = true;
          ox = e.clientX - n.x;
          oy = e.clientY - n.y;
        });
        window.addEventListener("mousemove", (e) => {
          if (!dragging) return;
          const rect = board.getBoundingClientRect();
          n.x = clamp((e.clientX - rect.left) - ox, 90, rect.width - 90);
          n.y = clamp((e.clientY - rect.top) - oy, 60, rect.height - 60);
          render();
        });
        window.addEventListener("mouseup", () => dragging = false);

        el.addEventListener("click", () => {
          if (selected === null) {
            selected = n.id;
          } else if (selected === n.id) {
            selected = null;
          } else {
            links.push({ a:selected, b:n.id });
            selected = null;
          }
          render();
        });

        el.addEventListener("dblclick", () => {
          const name = prompt("Rename stage:", n.t);
          if (!name) return;
          n.t = name.trim();
          render();
        });
      });

      // inject styles once
      if (!$("#jfStyle", wrap)) {
        const style = document.createElement("style");
        style.id = "jfStyle";
        style.textContent = `
          .jfNode{
            position:absolute;
            width: 120px;
            padding: 10px 10px 9px;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,.14);
            background: rgba(255,255,255,.06);
            box-shadow: 0 18px 55px rgba(0,0,0,.35);
            cursor: grab;
            user-select:none;
          }
          .jfNode:active{cursor:grabbing}
          .jfTitle{font-weight:950;color:rgba(255,255,255,.90)}
          .jfSub{margin-top:4px;color:rgba(255,255,255,.65);font-weight:800;font-size:12px}
          .jfNode.sel{
            border-color: rgba(139,243,255,.35);
            box-shadow: 0 0 0 3px rgba(139,243,255,.10), 0 18px 55px rgba(0,0,0,.35);
          }
        `;
        wrap.appendChild(style);
      }
    }

    $("#addNode", wrap).addEventListener("click", () => {
      const t = prompt("Stage name?");
      if (!t) return;
      const id = Math.max(0, ...nodes.map(n=>n.id)) + 1;
      nodes.push({ id, x: 140 + Math.random()*420, y: 110 + Math.random()*300, t: t.trim() });
      render();
    });
    $("#clearLinks", wrap).addEventListener("click", () => { links = []; render(); });

    render();

    return { destroy(){} };
  }

  // ==========================================================
  // DEMO 5: WEATHER THEATRE (Parallax + sliders + curtain)
  // ==========================================================
  function createWeatherTheatre(mount) {
    const wrap = document.createElement("div");
    wrap.style.padding="10px";
    mount.appendChild(wrap);

    const bar = document.createElement("div");
    bar.style.display="grid";
    bar.style.gridTemplateColumns="1fr 1fr 1fr auto auto";
    bar.style.gap="10px";
    bar.style.alignItems="center";
    bar.innerHTML = `
      <label style="color:rgba(255,255,255,.80);font-weight:900">Cosy <input id="cosy" type="range" min="0" max="100" value="55"></label>
      <label style="color:rgba(255,255,255,.80);font-weight:900">Eerie <input id="eerie" type="range" min="0" max="100" value="15"></label>
      <label style="color:rgba(255,255,255,.80);font-weight:900">Heroic <input id="heroic" type="range" min="0" max="100" value="35"></label>
      <button class="btn small ghost" id="toggle" type="button">Matinée</button>
      <button class="btn small primary" id="curtain" type="button">Curtain Reveal</button>
    `;
    wrap.appendChild(bar);

    const { canvas, ctx } = mountCanvas(wrap, 520);
    let W = canvas.width, H = canvas.height;

    const cosy = $("#cosy", wrap);
    const eerie = $("#eerie", wrap);
    const heroic = $("#heroic", wrap);
    const toggle = $("#toggle", wrap);
    const curtainBtn = $("#curtain", wrap);

    const subtitle = document.createElement("div");
    subtitle.style.marginTop="10px";
    subtitle.style.color="rgba(255,255,255,.80)";
    subtitle.style.fontWeight="900";
    subtitle.innerHTML = `Scene: <span id="sceneLine" style="color:rgba(247,215,116,.95)"></span>`;
    wrap.appendChild(subtitle);
    const sceneLine = $("#sceneLine", wrap);

    let mode = "day";
    let curtain = 1; // 1 closed → 0 open
    let curtainVel = 0;
    let sceneText = "";
    let scIdx = 0;

    const forecast = {
      city: "Neo-Philly",
      temp: 72,
      condition: "Partly Cloudy",
      wind: "8 mph",
      note: "Clear outlook with creative energy."
    };

    function buildSceneString() {
      const c = +cosy.value, e = +eerie.value, h = +heroic.value;
      let mood = "balanced";
      if (c > e && c > h) mood = "cosy";
      else if (e > c && e > h) mood = "eerie";
      else if (h > c && h > e) mood = "heroic";
      const timeWord = mode === "day" ? "Matinée" : "Night";
      return `${timeWord} in ${forecast.city}: ${forecast.temp}° — ${forecast.condition}. Mood: ${mood}.`;
    }

    function resetType() {
      sceneText = buildSceneString();
      scIdx = 0;
      sceneLine.textContent = "";
    }
    resetType();

    toggle.addEventListener("click", () => {
      mode = (mode === "day") ? "night" : "day";
      toggle.textContent = mode === "day" ? "Matinée" : "Night";
      resetType();
    });

    [cosy,eerie,heroic].forEach(el => el.addEventListener("input", resetType));

    curtainBtn.addEventListener("click", () => {
      // if closed → open; if open → close
      curtainVel = (curtain > 0.5) ? -0.06 : 0.06;
    });

    function draw() {
      const t = now()/1000;
      const c = +cosy.value/100;
      const e = +eerie.value/100;
      const h = +heroic.value/100;

      // stage palette
      const day = mode === "day" ? 1 : 0;
      const baseTop = `rgba(${Math.floor(20+80*day)},${Math.floor(10+30*day)},${Math.floor(35+60*day)},1)`;

      ctx.clearRect(0,0,W,H);

      // backdrops: parallax layers
      // far layer
      ctx.fillStyle = baseTop;
      ctx.fillRect(0,0,W,H);

      // spotlight sweeps
      ctx.save();
      ctx.globalAlpha = 0.10 + c*0.12 + h*0.10;
      for (let i=0;i<3;i++){
        ctx.beginPath();
        const x = (W*(0.2 + i*0.3) + Math.sin(t*0.7 + i)*W*0.18);
        const y = H*(0.18 + i*0.1);
        ctx.ellipse(x,y, W*0.18, H*0.55, 0.2, 0, Math.PI*2);
        ctx.fillStyle = `rgba(247,215,116,${0.12 + c*0.10})`;
        ctx.fill();
      }
      ctx.restore();

      // horizon
      ctx.fillStyle = `rgba(0,0,0,${0.25 + e*0.20})`;
      ctx.fillRect(0, H*0.72, W, H*0.28);

      // clouds / fog
      ctx.save();
      ctx.globalAlpha = 0.25 + c*0.20 - e*0.10;
      for (let i=0;i<9;i++){
        const x = (i*140*devicePixelRatio + (t*40*devicePixelRatio)) % (W+200*devicePixelRatio) - 100*devicePixelRatio;
        const y = H*(0.22 + (i%3)*0.08) + Math.sin(t*0.6+i)*10*devicePixelRatio;
        ctx.beginPath();
        ctx.arc(x,y, 32*devicePixelRatio, 0, Math.PI*2);
        ctx.arc(x+40*devicePixelRatio,y+10*devicePixelRatio, 26*devicePixelRatio, 0, Math.PI*2);
        ctx.arc(x+80*devicePixelRatio,y, 30*devicePixelRatio, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${0.22 + c*0.18})`;
        ctx.fill();
      }
      ctx.restore();

      // dramatic beams
      ctx.save();
      ctx.globalAlpha = 0.10 + h*0.20;
      for (let i=0;i<5;i++){
        ctx.beginPath();
        const x = W*(0.1 + i*0.2) + Math.sin(t*0.9+i)*W*0.04;
        ctx.moveTo(x, 0);
        ctx.lineTo(x + W*0.08, 0);
        ctx.lineTo(x + W*0.18, H);
        ctx.lineTo(x + W*0.10, H);
        ctx.closePath();
        ctx.fillStyle = `rgba(139,243,255,${0.10 + h*0.12})`;
        ctx.fill();
      }
      ctx.restore();

      // forecast card
      ctx.save();
      ctx.globalAlpha = 0.95;
      const cx = 18*devicePixelRatio, cy = 18*devicePixelRatio;
      const cw = 360*devicePixelRatio, ch = 128*devicePixelRatio;
      roundRect(ctx, cx, cy, cw, ch, 16*devicePixelRatio);
      ctx.fillStyle = "rgba(0,0,0,.30)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.16)";
      ctx.lineWidth = 2*devicePixelRatio;
      ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,.90)";
      ctx.font = `${14*devicePixelRatio}px ui-sans-serif, system-ui`;
      ctx.fillText(`${forecast.city} • ${mode === "day" ? "Matinée" : "Night"}`, cx+14*devicePixelRatio, cy+26*devicePixelRatio);
      ctx.font = `${28*devicePixelRatio}px ui-sans-serif, system-ui`;
      ctx.fillStyle = "rgba(247,215,116,.95)";
      ctx.fillText(`${forecast.temp}°`, cx+14*devicePixelRatio, cy+62*devicePixelRatio);

      ctx.font = `${13*devicePixelRatio}px ui-sans-serif, system-ui`;
      ctx.fillStyle = "rgba(255,255,255,.82)";
      ctx.fillText(`${forecast.condition} • Wind ${forecast.wind}`, cx+110*devicePixelRatio, cy+56*devicePixelRatio);
      ctx.fillStyle = "rgba(255,255,255,.70)";
      ctx.fillText(forecast.note, cx+14*devicePixelRatio, cy+98*devicePixelRatio);
      ctx.restore();

      // curtain (two halves)
      if (curtainVel !== 0) {
        curtain = clamp(curtain + curtainVel, 0, 1);
        if (curtain === 0 || curtain === 1) curtainVel = 0;
      }
      const half = W/2;
      const offset = curtain * half;
      ctx.save();
      ctx.fillStyle = "rgba(10,8,18,.92)";
      ctx.fillRect(-half + offset, 0, half, H);
      ctx.fillRect(W - offset, 0, half, H);

      // gold trim
      ctx.fillStyle = "rgba(247,215,116,.30)";
      ctx.fillRect(-half + offset + half-6*devicePixelRatio, 0, 6*devicePixelRatio, H);
      ctx.fillRect(W - offset, 0, 6*devicePixelRatio, H);
      ctx.restore();

      // scene typewriter
      if (scIdx < sceneText.length && (Math.floor(t*16) % 2 === 0)) {
        scIdx += 1;
        sceneLine.textContent = sceneText.slice(0, scIdx);
      }

      requestAnimationFrame(draw);
    }

    function roundRect(ctx,x,y,w,h,r){
      ctx.beginPath();
      ctx.moveTo(x+r,y);
      ctx.arcTo(x+w,y,x+w,y+h,r);
      ctx.arcTo(x+w,y+h,x,y+h,r);
      ctx.arcTo(x,y+h,x,y,r);
      ctx.arcTo(x,y,x+w,y,r);
      ctx.closePath();
    }

    const ro = new ResizeObserver(() => {
      const height = 520;
      canvas.width = Math.floor(wrap.clientWidth * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
      W = canvas.width; H = canvas.height;
    });
    ro.observe(wrap);

    draw();

    return { destroy(){ ro.disconnect(); } };
  }

  // ==========================================================
  // DEMO 6: BRUTALIST DEV LANDING (inside modal)
  // ==========================================================
  function createBrutalistLanding(mount) {
    const wrap = document.createElement("div");
    wrap.style.padding = "0";
    mount.appendChild(wrap);

    // Brutalist UI container
    const root = document.createElement("div");
    root.style.padding = "14px";
    root.style.background = "rgba(255,255,255,.04)";
    wrap.appendChild(root);

    root.innerHTML = `
      <div id="bTop" style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
        <div style="font-weight:950;letter-spacing:-.3px">BRUTAL PLATFORM</div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn small ghost" id="invert" type="button">Invert</button>
          <button class="btn small primary" id="openPricing" type="button">Pricing</button>
        </div>
      </div>

      <div id="coords" style="margin-top:10px;border:1px solid rgba(255,255,255,.16);padding:10px;background:rgba(0,0,0,.22);font:12px ui-monospace;color:rgba(255,255,255,.82)">
        Cursor: (—, —) • 12-col grid active
      </div>

      <div style="margin-top:10px;border:1px solid rgba(255,255,255,.16);padding:12px;background:rgba(0,0,0,.18)">
        <div style="font-size:26px;font-weight:950;line-height:1.03">Ship faster. Break nothing.</div>
        <div style="margin-top:8px;color:rgba(255,255,255,.74);font-weight:800">One API. Clean primitives. Zero fluff.</div>
        <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap">
          <button class="btn small primary" id="startFree" type="button">Start free</button>
          <button class="btn small ghost" id="docsBtn" type="button">Docs</button>
        </div>
        <pre id="bTerm" style="margin-top:12px;padding:12px;border:1px solid rgba(255,255,255,.16);background:rgba(0,0,0,.32);font:12px/1.45 ui-monospace;color:rgba(255,255,255,.88);min-height:120px"></pre>
      </div>

      <div style="margin-top:10px;display:grid;grid-template-columns:repeat(12,1fr);gap:10px">
        <div style="grid-column: span 12; border:1px solid rgba(255,255,255,.16);padding:10px;background:rgba(0,0,0,.14)">
          <div style="display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap">
            <div style="font-weight:950">Code Snippets</div>
            <div style="display:flex;gap:8px">
              <button class="btn small ghost" data-tab="js" type="button">JS</button>
              <button class="btn small ghost" data-tab="py" type="button">Python</button>
              <button class="btn small ghost" data-tab="curl" type="button">cURL</button>
              <button class="btn small primary" id="copyCode" type="button">Copy</button>
            </div>
          </div>
          <pre id="codeBox" style="margin-top:10px;padding:12px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.02);font:12px/1.45 ui-monospace;color:rgba(255,255,255,.88);white-space:pre;overflow:auto"></pre>
          <div id="copied" style="margin-top:8px;color:rgba(255,255,255,.70);font-weight:800;display:none">Copied.</div>
        </div>
      </div>

      <div id="pricingModal" style="display:none;position:fixed;inset:0;z-index:9999">
        <div id="pOverlay" style="position:absolute;inset:0;background:rgba(0,0,0,.65)"></div>
        <div style="position:relative;width:min(820px,92vw);margin:8vh auto;border:1px solid rgba(255,255,255,.20);background:rgba(10,8,18,.96);padding:14px;border-radius:18px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="font-weight:950">Pricing (Sticky header vibe)</div>
            <button class="btn small ghost" id="closePricing" type="button">Close</button>
          </div>
          <div style="margin-top:10px;overflow:auto;max-height:56vh;border:1px solid rgba(255,255,255,.12)">
            <table style="width:100%;border-collapse:collapse">
              <thead style="position:sticky;top:0;background:rgba(0,0,0,.35)">
                <tr>
                  <th style="text-align:left;padding:10px;border-bottom:1px solid rgba(255,255,255,.12)">Tier</th>
                  <th style="text-align:left;padding:10px;border-bottom:1px solid rgba(255,255,255,.12)">Best for</th>
                  <th style="text-align:left;padding:10px;border-bottom:1px solid rgba(255,255,255,.12)">Includes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid rgba(255,255,255,.08);font-weight:900">Starter</td>
                  <td style="padding:10px;border-bottom:1px solid rgba(255,255,255,.08)">Prototypes</td>
                  <td style="padding:10px;border-bottom:1px solid rgba(255,255,255,.08)">Rate limits + basic auth</td>
                </tr>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid rgba(255,255,255,.08);font-weight:900">Growth</td>
                  <td style="padding:10px;border-bottom:1px solid rgba(255,255,255,.08)">Teams</td>
                  <td style="padding:10px;border-bottom:1px solid rgba(255,255,255,.08)">Keys + audit logs + webhooks</td>
                </tr>
                <tr>
                  <td style="padding:10px;border-bottom:1px solid rgba(255,255,255,.08);font-weight:900">Enterprise</td>
                  <td style="padding:10px;border-bottom:1px solid rgba(255,255,255,.08)">Scale</td>
                  <td style="padding:10px;border-bottom:1px solid rgba(255,255,255,.08)">SLA + dedicated support</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px">
            <button class="btn small ghost" id="signup" type="button">Signup modal</button>
            <button class="btn small primary" id="checkout" type="button">Choose Growth</button>
          </div>
        </div>
      </div>
    `;

    const bTerm = $("#bTerm", root);
    const coords = $("#coords", root);
    const invertBtn = $("#invert", root);
    const pricingModal = $("#pricingModal", root);
    const openPricing = $("#openPricing", root);
    const closePricing = $("#closePricing", root);
    const pOverlay = $("#pOverlay", root);

    // terminal typing
    const script = [
      "curl -X POST https://api.brutal.dev/v1/upgrade \\",
      "  -H \"Authorization: Bearer $KEY\" \\",
      "  -d '{\"module\":\"flow\",\"site\":\"example.com\"}'",
      "",
      "→ 200 OK",
      "{ \"status\": \"installed\", \"latency_ms\": 42 }"
    ];
    let l=0,c=0;
    (function tick(){
      const line = script[l] ?? "";
      bTerm.textContent = script.slice(0,l).join("\n") + "\n" + line.slice(0,c) + (c%10<5?"▌":"");
      c++;
      if (c>line.length){ l++; c=0; }
      if (l<script.length) setTimeout(tick, 16);
    })();

    // coords tracker
    function onMove(e){
      const rect = root.getBoundingClientRect();
      const x = Math.floor(((e.clientX - rect.left)/rect.width)*12*10)/10;
      const y = Math.floor(((e.clientY - rect.top)/rect.height)*12*10)/10;
      coords.textContent = `Cursor: (${x}, ${y}) • 12-col grid active`;
    }
    root.addEventListener("mousemove", onMove);

    // code tabs
    const snippets = {
      js: `fetch("/v1/upgrade",{
  method:"POST",
  headers:{ "Authorization":"Bearer $KEY" },
  body: JSON.stringify({ module:"flow", site
