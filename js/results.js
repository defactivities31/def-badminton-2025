console.log("✅ results.js is loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// Firebase config
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
const container = document.getElementById("results-matches");

if (!container) {
  console.error("❌ Element #results-matches not found in the DOM.");
}

let currentRound = "all";
let currentType = "all";
let fullMatchData = {};

function getMatchTypeClass(type) {
  switch ((type || '').toLowerCase()) {
    case 'men singles': return 'match-type-men-singles';
    case 'women singles': return 'match-type-women-singles';
    case 'men doubles': return 'match-type-men-doubles';
    case 'women doubles': return 'match-type-women-doubles';
    default: return 'match-type-unknown';
  }
}

function renderMatches(matches) {
  container.innerHTML = "";

  const sortedKeys = Object.keys(matches).sort((a, b) => {
    const timeA = matches[a].timestamp || 0;
    const timeB = matches[b].timestamp || 0;
    return timeA - timeB;
  });

  for (const key of sortedKeys) {
    const match = matches[key];

    if (match.status !== "completed") continue;
    if (currentRound !== "all" && match.round !== currentRound) continue;
    if (currentType !== "all" && match.matchType !== currentType) continue;

    const safeRoundClass = match.round.replace(/\s+/g, '-').toLowerCase(); // e.g., "Round of 64" -> "round-of-64"

   if (!document.querySelector(`[data-round='${match.round}']`)) {
  const sectionHeader = document.createElement('div');
  sectionHeader.className = `round-header`;
  sectionHeader.setAttribute('data-round', match.round);
  sectionHeader.textContent = match.round;
  container.appendChild(sectionHeader);
}

    const matchTypeClass = getMatchTypeClass(match.matchType);

    const setsA = [match.Set1A, match.Set2A, match.Set3A];
    const setsB = [match.Set1B, match.Set2B, match.Set3B];
    const setsWonA = setsA.filter((a, i) => (a ?? -1) > (setsB[i] ?? -1)).length;
    const setsWonB = setsB.filter((b, i) => (b ?? -1) > (setsA[i] ?? -1)).length;
    const winnerClassA = setsWonA > setsWonB ? 'winner' : '';
    const winnerClassB = setsWonB > setsWonA ? 'winner' : '';

    const card = document.createElement("div");
    card.className = "match-card responsive-wrapper";
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

        <div class="score-row ${winnerClassA}">
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

        <div class="score-row ${winnerClassB}">
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
}

onValue(matchRef, (snapshot) => {
  const data = snapshot.val();
  if (!data || !container) return;
  fullMatchData = data;
  renderMatches(fullMatchData);
});

document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.round) {
      currentRound = button.dataset.round;
    }
    if (button.dataset.type) {
      currentType = button.dataset.type;
    }

    // 🔥 Add visual active effect to clicked button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    renderMatches(fullMatchData);
  });
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