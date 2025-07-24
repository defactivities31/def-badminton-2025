import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

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
const matchList = document.getElementById("matchList");

const matchesRef = ref(db, "/");
get(matchesRef).then(snapshot => {
  if (snapshot.exists()) {
    const data = snapshot.val();
    console.log("✅ Snapshot received:", data);
    const matches = Object.entries(data)
      .map(([id, match]) => match)
      .filter(match => match.status === "upcoming");

    let selectedType = "Men Singles";
    let selectedRound = "Round of 64";

    function renderFilteredMatches() {
      matchList.innerHTML = "";

      const type = selectedType.trim().toLowerCase();
      const round = selectedRound.trim().toLowerCase();

      const filteredMatches = matches.filter(match =>
        match.matchType.trim().toLowerCase() === type &&
        match.round.trim().toLowerCase() === round
      );

      if (filteredMatches.length === 0) {
        matchList.textContent = "No upcoming matches for this filter.";
        return;
      }

      const roundHeader = document.createElement("h3");
      roundHeader.className = "round-heading";
      roundHeader.textContent = selectedRound;
      matchList.appendChild(roundHeader);

      const roundGroup = document.createElement("div");
      roundGroup.className = "match-grid";

      filteredMatches.forEach(match => {
        const div = document.createElement("div");
        div.className = "match-card";
        div.innerHTML = `
          <div class="match-header">
            <div class="match-meta">
              <span class="match-type-badge" aria-label="Match type">${match.matchType}</span>
              <span class="round-badge" aria-label="Round">${match.round}</span>
            </div>
          </div>
          <div class="players">
            <div class="player-side">
              <img src="${match.photoA || 'defaultA.jpg'}" alt="${match.PlayerA}" class="player-photo" />
              <span class="player-name" data-player="A">${match.PlayerA}</span>
            </div>
            <span class="vs-text" aria-hidden="true">vs</span>
            <div class="player-side">
              <span class="player-name" data-player="B">${match.PlayerB}</span>
              <img src="${match.photoB || 'defaultB.jpg'}" alt="${match.PlayerB}" class="player-photo" />
            </div>
          </div>
        `;
        roundGroup.appendChild(div);
      });

      matchList.appendChild(roundGroup);
    }

    renderFilteredMatches();

    document.querySelectorAll(".type-btn").forEach(btn => {
      btn.setAttribute('aria-label', `Filter match type: ${btn.dataset.type}`);
      btn.addEventListener("click", () => {
        document.querySelector(".type-btn.active")?.classList.remove("active");
        btn.classList.add("active");
        selectedType = btn.dataset.type;
        renderFilteredMatches();
      });
    });

    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.setAttribute('aria-label', `Filter round: ${btn.dataset.round}`);
      btn.addEventListener("click", () => {
        document.querySelector(".filter-btn.active")?.classList.remove("active");
        btn.classList.add("active");
        selectedRound = btn.dataset.round;
        renderFilteredMatches();
      });
    });

  } else {
    matchList.textContent = "No upcoming matches.";
  }
}).catch(error => {
  console.error("🔥 Firebase fetch failed:", error);
  matchList.textContent = "Error loading matches.";
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