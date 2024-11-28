let passage = "";
let words = [];
let round = 1;
let currentMissingWords = [];
let maxRoundsPerLevel = 5;
let level = 1;

const passageInput = document.getElementById("passageInput");
const startButton = document.getElementById("startBtn");

passageInput.addEventListener("input", function () {
  if (passageInput.value.trim() !== "") {
    startButton.classList.add("active");
    startButton.disabled = false;
  } else {
    startButton.classList.remove("active");
    startButton.disabled = true;
  }
});

startButton.disabled = true;

let startGame = function () {
  passage = document.getElementById("passageInput").value;

  localStorage.setItem("lastPassage", passage);

  initializeGame(passage);
};

let restartGame = function () {
  const savedPassage = localStorage.getItem("lastPassage");

  if (savedPassage) {
    initializeGame(savedPassage);
  } else {
    alert("No saved passage found! Start a new game first.");
  }
};

let initializeGame = function (gamePassage) {
  passage = gamePassage;
  words = passage.split(" ");
  round = 1;
  level = 1;

  document.getElementById("passageInput").style.display = "none";
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("gameEndButtons").style.display = "none";
  document.getElementById("gameArea").style.display = "block";
  document.getElementById("userInput").style.display = "block";
  document.getElementById("inputOther").style.display = "flex";
  nextRound();
};

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartGame").addEventListener("click", restartGame);

let nextRound = function () {
  document.getElementById("feedback").textContent = "";
  document.getElementById("userInput").value = "";
  document.getElementById("userInput").style.borderColor = "#775932";
  document.getElementById("correctAnswer").style.display = "none";

  document.getElementById("submitBtn").textContent = "Submit";
  document.getElementById("submitBtn").removeEventListener("click", nextRound);
  document.getElementById("submitBtn").addEventListener("click", checkAnswer);

  if (level === words.length) {
    currentMissingWords = [...Array(words.length).keys()];
    displayPassage();
    round = 1;
    level++;
    return;
  }

  if (round > maxRoundsPerLevel) {
    round = 1;
    level++;
  }

  if (level > words.length) {
    endGame();
    return;
  }

  currentMissingWords = getRandomWords(level);
  displayPassage();
  round++;
};

let getRandomWords = function (count) {
  const indices = [];
  while (indices.length < count) {
    const randIndex = Math.floor(Math.random() * words.length);
    if (!indices.includes(randIndex)) indices.push(randIndex);
  }
  return indices;
};

let displayPassage = function () {
  const displayText = words
    .map((word, index) =>
      currentMissingWords.includes(index)
        ? '<span class="blank">_____</span>'
        : word
    )
    .join(" ");

  document.getElementById("displayText").innerHTML = displayText;
};

let normalizeText = function (text) {
  return text.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, "").toLowerCase();
};

let checkAnswer = function () {
  const userAnswer = normalizeText(
    document.getElementById("userInput").value.trim()
  );

  const correctAnswers = currentMissingWords
    .sort((a, b) => a - b)
    .map((index) => normalizeText(words[index]));

  const correctAnswerString = correctAnswers.join(" ");

  if (userAnswer === correctAnswerString) {
    document.getElementById("feedback").textContent = "Correct!";
    document.getElementById("feedback").style.color = "green";
    document.getElementById("submitBtn").textContent = "Next";
    document.getElementById("userInput").style.borderColor = "green";

    document.getElementById("correctAnswer").textContent = "";
    document
      .getElementById("submitBtn")
      .removeEventListener("click", checkAnswer);
    document.getElementById("submitBtn").addEventListener("click", nextRound);
  } else {
    document.getElementById("userInput").style.borderColor = "red";
    document.getElementById("feedback").textContent = `Incorrect`;
    document.getElementById("feedback").style.color = "red";

    document.getElementById(
      "correctAnswer"
    ).innerHTML = `<div class = "correctAnswer">CORRECT ANSWER: ${correctAnswers.join(
      " "
    )}</div>`;
    document.getElementById("correctAnswer").style.display = "inline-block";
  }
};

document
  .getElementById("userInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();

      const buttonText = document.getElementById("submitBtn").textContent;

      if (buttonText === "Submit") {
        checkAnswer();
      } else if (buttonText === "Next") {
        nextRound();
      }
    }
  });

document.getElementById("submitBtn").addEventListener("click", checkAnswer);

let endGame = function () {
  document.getElementById("displayText").textContent =
    "Great job! You've completed the passage!";
  document.getElementById("userInput").style.display = "none";
  document.getElementById("inputOther").style.display = "none";
  document.getElementById("gameEndButtons").style.display = "flex";
};
