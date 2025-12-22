// ===== =====
const CONFIG = {
  name: "✨ YARA ✨",
  // Cuenta atrás
  targetDate: "2025-12-24T23:59:00",
  // WhatsApp
  whatsappNumber: "34690904462",
  whatsappMessage: "He visto tu web de Navidad 🎄 y... sí 😊"
};
// ============================

const FORCE_REVEAL = true; 

const $ = (id) => document.getElementById(id);

$("herName").textContent = CONFIG.name;

function pad(n){ return String(n).padStart(2, "0"); }

function updateCountdown(){
  const t = new Date(CONFIG.targetDate).getTime();
  const now = Date.now();
  let diff = Math.max(0, t - now);

  const d = Math.floor(diff / (1000*60*60*24)); diff -= d*(1000*60*60*24);
  const h = Math.floor(diff / (1000*60*60)); diff -= h*(1000*60*60);
  const m = Math.floor(diff / (1000*60)); diff -= m*(1000*60);
  const s = Math.floor(diff / 1000);

  $("d").textContent = pad(d);
  $("h").textContent = pad(h);
  $("m").textContent = pad(m);
  $("s").textContent = pad(s);
}
setInterval(updateCountdown, 250);
updateCountdown();

// Carta
$("openLetter").addEventListener("click", () => {
  $("letter").hidden = false;
  $("letter").scrollIntoView({ behavior: "smooth", block: "start" });
});

// WhatsApp link
const wa = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
$("whatsBtn").setAttribute("href", wa);

// Botón NO que se escapa (divertido, no agresivo)
const noBtn = $("noBtn");
const hint = $("hint");
let dodges = 0;

function dodge(){
  dodges++;
  hint.textContent = dodges < 3
    ? "Ese botón está bugueado 😅"
    : "Vale… te dejo pensarlo, pero yo ya estoy dentro del sprint contigo 🧠💚";

  const rect = noBtn.getBoundingClientRect();
  const maxX = Math.min(window.innerWidth - rect.width - 14, window.innerWidth - 14);
  const maxY = Math.min(window.innerHeight - rect.height - 14, window.innerHeight - 14);
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);

  noBtn.style.position = "fixed";
  noBtn.style.left = `${Math.max(14, x)}px`;
  noBtn.style.top  = `${Math.max(14, y)}px`;
  noBtn.style.zIndex = 9999;
}
noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("click", dodge);

$("yesBtn").addEventListener("click", () => {
  $("final").hidden = false;
  $("final").scrollIntoView({ behavior: "smooth", block: "start" });
  confettiBurst();
});

// Confeti simple
$("confettiBtn").addEventListener("click", confettiBurst);

function confettiBurst(){
  const n = 120;
  for(let i=0;i<n;i++){
    const p = document.createElement("div");
    p.className = "confetti";
    p.style.left = Math.random()*100 + "vw";
    p.style.top = "-10px";
    p.style.transform = `rotate(${Math.random()*360}deg)`;
    p.style.opacity = String(0.6 + Math.random()*0.4);
    p.style.width = (6 + Math.random()*6) + "px";
    p.style.height = (10 + Math.random()*14) + "px";
    p.style.animationDuration = (1.8 + Math.random()*1.6) + "s";
    document.body.appendChild(p);
    setTimeout(()=>p.remove(), 4000);
  }
}

// Estilos del confeti inyectados
const confettiCSS = document.createElement("style");
confettiCSS.textContent = `
.confetti{
  position:fixed;
  border:1px solid rgba(255,255,255,.18);
  background: rgba(255,255,255,.12);
  box-shadow: 0 12px 30px rgba(0,0,0,.25);
  border-radius: 4px;
  z-index: 9998;
  animation: fall linear forwards;
}
@keyframes fall{
  to{
    transform: translateY(110vh) rotate(720deg);
  }
}`;
document.head.appendChild(confettiCSS);

// Nieve (canvas)
const canvas = $("snow");
const ctx = canvas.getContext("2d");
let W, H;
function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const flakes = Array.from({length: 140}, () => ({
  x: Math.random()*W,
  y: Math.random()*H,
  r: 0.6 + Math.random()*2.2,
  v: 0.4 + Math.random()*1.4,
  a: Math.random()*Math.PI*2
}));

function drawSnow(){
  ctx.clearRect(0,0,W,H);
  for(const f of flakes){
    f.y += f.v;
    f.a += 0.01;
    f.x += Math.sin(f.a) * 0.3;

    if(f.y > H + 10){
      f.y = -10;
      f.x = Math.random()*W;
    }
    if(f.x < -10) f.x = W + 10;
    if(f.x > W + 10) f.x = -10;

    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI*2);
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.fill();
  }
  requestAnimationFrame(drawSnow);
}
drawSnow();

// ===== Foto en carta: toque para enfocar =====
const paper = document.querySelector(".paper");
let paperRevealed = false;

paper.addEventListener("click", () => {
  paperRevealed = !paperRevealed;
  paper.classList.toggle("reveal", paperRevealed);
});

// ===== Revelación a las 23:59 =====
let revealedOnce = false;

function checkReveal(){
  if (FORCE_REVEAL && !revealedOnce){
    revealedOnce = true;
    showReveal();
    return;
  }

  const target = new Date(CONFIG.targetDate).getTime();
  const now = Date.now();

  if(now >= target && !revealedOnce){
    revealedOnce = true;
    showReveal();
  }
}

function showReveal(){
  const r = $("reveal");
  r.classList.remove("reveal-hidden");
  document.body.style.overflow = "hidden";

  if(navigator.vibrate){
    navigator.vibrate([200, 100, 200]);
  }
}

$("revealClose").addEventListener("click", () => {
  $("reveal").classList.add("reveal-hidden");
  document.body.style.overflow = "";
});

setInterval(checkReveal, 500);
checkReveal();