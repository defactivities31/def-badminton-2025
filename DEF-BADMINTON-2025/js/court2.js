import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getDatabase, ref, get, update } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

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

// 👇 CHANGE THIS MATCH ID
const matchId = "matchMS002";  
const matchRef = ref(db, "matches/" + matchId);

function renderScorer(match) {
  const container = document.getElementById("match-info");

  container.innerHTML = `
    <h2>${match.PlayerA} vs ${match.PlayerB}</h2>
    ${[1,2,3].map(set => `
      <div class="set-label">Set ${set}</div>
      <div class="set-line">
        <div>
          <button onclick="updateScore('Set${set}A', 1)">▲</button><br/>
          <span class="score" id="Set${set}A">${match[`Set${set}A`]}</span><br/>
          <button onclick="updateScore('Set${set}A', -1)">▼</button>
        </div>
        <span>vs</span>
        <div>
          <button onclick="updateScore('Set${set}B', 1)">▲</button><br/>
          <span class="score" id="Set${set}B">${match[`Set${set}B`]}</span><br/>
          <button onclick="updateScore('Set${set}B', -1)">▼</button>
        </div>
      </div>
    `).join("")}
  `;
}

get(matchRef).then(snapshot => {
  if (snapshot.exists()) {
    renderScorer(snapshot.val());
  } else {
    document.getElementById("match-info").innerHTML = "Match not found.";
  }
});

window.updateScore = function(setKey, change) {
  const el = document.getElementById(setKey);
  let current = parseInt(el.textContent);
  if (isNaN(current) || el.textContent === "-") current = 0;

  let newVal = current + change;
  if (newVal < 0) newVal = 0;

  el.textContent = newVal;

  const updateObj = {};
  updateObj[setKey] = newVal;

  update(matchRef, updateObj);
};