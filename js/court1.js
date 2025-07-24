import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, set, update, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7RnJh8zqJsvB-YvdTxioFTopsm9KrwM8",
  authDomain: "def-badminton-2025.firebaseapp.com",
  databaseURL: "https://def-badminton-2025-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "def-badminton-2025",
  storageBucket: "def-badminton-2025.firebasestorage.app",
  messagingSenderId: "393429664005",
  appId: "1:393429664005:web:269b798baea5aca634776c",
  measurementId: "G-9K8PHS54QL"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const matchSelector = document.getElementById("matchSelector");
const matchForm = document.getElementById("scoreForm");
const player1Name = document.getElementById("playerAName");
const player2Name = document.getElementById("playerBName");
const player1ScoreInput = document.getElementById("player1Score");
const player2ScoreInput = document.getElementById("player2Score");
const completeMatchBtn = document.getElementById("completeMatchBtn");

const courtId = "court1"; // Can reuse for other courts

// Load matches for this court
const matchesRef = ref(db, `/`);
onValue(matchesRef, (snapshot) => {
  const data = snapshot.val();
  matchSelector.innerHTML = "<option value=''>Select a match</option>";
  for (const matchId in data) {
    const match = data[matchId];
    // Only add to dropdown if match is for this court and not completed
    if (match.court === courtId && match.status !== "completed") {
      const option = document.createElement("option");
      option.value = matchId;
      option.textContent = `${match.PlayerA} vs ${match.PlayerB}`;
      matchSelector.appendChild(option);
    }
  }
});

matchSelector.addEventListener("change", () => {
  const selectedMatchId = matchSelector.value;
  if (!selectedMatchId) {
    matchForm.style.display = "none";
    completeMatchBtn.style.display = "none";
    return;
  }

  const matchRef = ref(db, `/${selectedMatchId}`);
  onValue(matchRef, (snapshot) => {
    const match = snapshot.val();
    if (match) {
      player1Name.textContent = match.PlayerA;
      player2Name.textContent = match.PlayerB;
      player1ScoreInput.value = match.Set1A || "";
      player2ScoreInput.value = match.Set1B || "";
      matchForm.style.display = "block";
      completeMatchBtn.style.display = "inline-block";
    }
  });
});

matchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedMatchId = matchSelector.value;
  const p1Score = parseInt(player1ScoreInput.value);
  const p2Score = parseInt(player2ScoreInput.value);

  if (isNaN(p1Score) || isNaN(p2Score)) {
    alert("Please enter valid scores for both players.");
    return;
  }

  const resultRef = ref(db, `results/${courtId}/${selectedMatchId}`);
  set(resultRef, {
    player1: player1Name.textContent,
    player2: player2Name.textContent,
    score1: p1Score,
    score2: p2Score,
    submittedAt: new Date().toISOString()
  }).then(() => {
    alert("Score submitted!");
    matchForm.reset();
    alert("You can continue updating or mark the match as completed.");
  });

  const matchUpdateRef = ref(db, `/${selectedMatchId}`);
  get(matchUpdateRef).then((snapshot) => {
    const matchData = snapshot.val();
    if (matchData) {
      update(matchUpdateRef, {
        Set1A: p1Score,
        Set1B: p2Score,
        status: "live",
        photoA: matchData.photoA || "",
        photoB: matchData.photoB || "",
        matchType: matchData.matchType || "",
        round: matchData.round || ""
      });
    }
  });
});

completeMatchBtn.addEventListener("click", () => {
  const selectedMatchId = matchSelector.value;
  if (!selectedMatchId) return;

  const matchUpdateRef = ref(db, `/${selectedMatchId}`);
  update(matchUpdateRef, {
    status: "completed"
  }).then(() => {
    alert("Match marked as completed.");
    matchForm.reset();
    matchForm.style.display = "none";
    completeMatchBtn.style.display = "none";
    matchSelector.value = "";
  });
});