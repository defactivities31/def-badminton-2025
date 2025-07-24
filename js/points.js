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

// ✅ Fetch match data and generate points leaderboard
async function fetchAndDisplayPoints() {
  try {
    const response = await fetch("/All Matches.json");
    const data = await response.json();
    const points = {};

    const allStates = [
      "Hyderabad", "Chennai", "Ahmedabad", "Trichy", "Thanjavur", "Indore",
      "Kolkata", "Puducherry", "Pune", "Mumbai", "Vijayawada", "Visakhapatnam"
    ];
    allStates.forEach(state => {
      points[state] = { wins: 0, losses: 0, points: 0, bnr: 0 };
    });

    for (const matchId in data.matches) {
      const match = data.matches[matchId];
      const { winner, stateA, stateB } = match;

      if (!stateA || !stateB || !winner) continue;

      if (winner === "A") {
        points[stateA].wins++;
        points[stateA].points += 2;
        points[stateB].losses++;
      } else if (winner === "B") {
        points[stateB].wins++;
        points[stateB].points += 2;
        points[stateA].losses++;
      }

      points[stateA].bnr = points[stateA].wins - points[stateA].losses;
      points[stateB].bnr = points[stateB].wins - points[stateB].losses;
    }

    const leaderboardBody = document.getElementById("leaderboard-body");
    if (!leaderboardBody) return;

    const sorted = Object.entries(points).sort((a, b) => {
      if (b[1].points !== a[1].points) return b[1].points - a[1].points;
      return b[1].bnr - a[1].bnr;
    });

    leaderboardBody.innerHTML = "";

    for (const [state, { wins, losses, points, bnr }] of sorted) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${state}</td>
        <td>${wins}</td>
        <td>${losses}</td>
        <td>${points}</td>
        <td>${bnr}</td>
      `;
      leaderboardBody.appendChild(row);
    }
  } catch (error) {
    console.error("Failed to load points:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchAndDisplayPoints);