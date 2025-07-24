console.log("✅ live.js is loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD7RnJh8zqJsvB-YvdTxioFTopsm9KrwM8",
  authDomain: "def-badminton-2025.firebaseapp.com",
  databaseURL: "https://def-badminton-2025-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "def-badminton-2025",
  storageBucket: "def-badminton-2025.appspot.com",
  messagingSenderId: "393429664005",
  appId: "1:393429664005:web:269b798baea5aca634776c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const matchRef = ref(db, '/');
const container = document.getElementById("live-matches");

if (!container) {
  console.error("Element #live-matches not found in the DOM.");
}

function getMatchTypeClass(type) {
  switch ((type || '').toLowerCase()) {
    case 'men singles': return 'match-type-men-singles';
    case 'women singles': return 'match-type-women-singles';
    case 'men doubles': return 'match-type-men-doubles';
    case 'women doubles': return 'match-type-women-doubles';
    default: return 'match-type-unknown';
  }
}

onValue(matchRef, (snapshot) => {
  const data = snapshot.val();
  if (!data || !container) return;

  container.innerHTML = "";
  console.log("🔥 Live data received:", data);

  for (const key in data) {
    const match = data[key];
    if (match.status !== "live") continue;

    const matchTypeClass = getMatchTypeClass(match.matchType);

    const card = document.createElement("div");
    card.className = "match-card";
    card.innerHTML = `
      <div class="match-card-inner">
        <div class="match-header">
          <span class="round-pill">🏸 ${match.round || 'Unknown Round'}</span>
          <span class="match-type-tag ${matchTypeClass}">${match.matchType || 'Unknown Type'}</span>
        </div>

        <div class="match-set-header">
          <div class="player-name set-title-label">Players</div>
          <div class="sets">
            <div class="set-title">Set 1</div>
            <div class="set-title">Set 2</div>
            <div class="set-title">Set 3</div>
          </div>
        </div>

        <div class="score-row">
          <div class="player-name">
            <img class="player-photo" src="${match.photoA || '#'}" alt="${match.PlayerA || '-'}" />
            ${match.PlayerA || '-'}
          </div>
          <div class="sets">
            <div class="set-score">${match.Set1A ?? '-'}</div>
            <div class="set-score">${match.Set2A ?? '-'}</div>
            <div class="set-score">${match.Set3A ?? '-'}</div>
          </div>
        </div>

        <div class="score-row">
          <div class="player-name">
            <img class="player-photo" src="${match.photoB || '#'}" alt="${match.PlayerB || '-'}" />
            ${match.PlayerB || '-'}
          </div>
          <div class="sets">
            <div class="set-score">${match.Set1B ?? '-'}</div>
            <div class="set-score">${match.Set2B ?? '-'}</div>
            <div class="set-score">${match.Set3B ?? '-'}</div>
          </div>
        </div>
      </div>
    `;

    container.appendChild(card);
  }
});

// ✅ Mobile toggle for navigation
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// Enhance ARIA support for accessibility
menuToggle.setAttribute("aria-label", "Toggle navigation menu");
menuToggle.setAttribute("aria-controls", "nav-links");
menuToggle.setAttribute("aria-expanded", "false");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  const isExpanded = navLinks.classList.contains("show");
  menuToggle.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isExpanded);
});

// ✅ Highlight current page in the navigation menu
document.querySelectorAll("nav a").forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

// ✅ Sticky Header with Shadow on Scroll
window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 0);
  }
});