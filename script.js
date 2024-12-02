// ========================
// 0. GLOBAL VARIABLES
// ========================
let passage = "";
let words = [];
let round = 1;
let currentMissingWords = [];
let maxRoundsPerLevel = 5;
let level = 1;

// ========================
// 1. BEGINNING OF GAME: INPUT METHOD CHOICE
// ========================

const inputChoiceContainer = document.getElementById("chooseInputMethod");
const bibleSearchContainer = document.getElementById("bibleSearchContainer");
const inputContainer = document.getElementById("passageInput");

const openBibleSearchBtn = document.getElementById("openBibleSearchInterface");
const openManualInputBtn = document.getElementById("manualInput");

// ===== TOGGLE BIBLE SEARCH INTERFACE =====

const bibleSearchModal = document.getElementById("bibleSearchModal");
const closeBibleSearchModal = document.getElementById("closeBibleSearchModal");

// Open modal
openBibleSearchBtn.addEventListener("click", function () {
  bibleSearchModal.classList.add("show");
});

// Close modal
closeBibleSearchModal.addEventListener("click", function () {
  bibleSearchModal.classList.remove("show");
});

// Close modal when clicking outside the modal content
window.addEventListener("click", function (event) {
  if (event.target === bibleSearchModal) {
    bibleSearchModal.classList.remove("show");
  }
});

// ===== TOGGLE MANUAL INPUT TEXT FIELD =====
let toggleManualInputField = function () {
  inputContainer.style.display = "block";
  inputChoiceContainer.style.display = "none";
  startButton.style.display = "block";
};
openManualInputBtn.addEventListener("click", toggleManualInputField);

// ========================
// 5. BIBLE VERSE SEARCH
// ========================

// Functions to load books and fetch specific verse data
async function loadBooksList() {
  try {
    const response = await fetch(
      "https://nathan-boquiren.github.io/cuppa-memory.com//bibleData/Books.json"
    ); // Path to your books.json
    if (!response.ok) throw new Error("Failed to load books list.");
    const booksList = await response.json();
    populateBookDropdown(booksList);
  } catch (error) {
    console.error("Error loading books list:", error);
  }
}

function populateBookDropdown(booksList) {
  const dropdown = document.getElementById("bookSelect");
  booksList.forEach((book) => {
    const option = document.createElement("option");
    option.value = book; // Use the original case-sensitive book name
    option.textContent = book;
    dropdown.appendChild(option);
  });
}

// Load the books list on page load
document.addEventListener("DOMContentLoaded", loadBooksList);

console.log("Matching Verse:", verseData);

async function fetchChapterData(book, chapter, verse) {
  try {
    const response = await fetch(
      `https://nathan-boquiren.github.io/cuppa-memory.com//bibleData/${book}.json`
    );
    if (!response.ok) throw new Error(`Failed to load ${book} data.`);
    const bookData = await response.json();

    console.log("Chapter:", chapter, "Verse:", verse);
    // Find the selected chapter (string comparison since JSON stores chapters as strings)
    const chapterData = bookData.chapters.find(
      (chap) => chap.chapter === chapter.toString()
    );

    console.log("Matching Chapter:", chapterData);
    if (!chapterData) throw new Error("Chapter not found.");

    // Find the selected verse (string comparison for the same reason)
    const verseData = chapterData.verses.find(
      (vers) => vers.verse === verse.toString()
    );

    console.log("Matching Verse Data:", verseData); // Log the matching verse
    if (!verseData) throw new Error("Verse not found.");

    return verseData.text; // Return the verse text if found
  } catch (error) {
    console.error("Error fetching chapter/verse data:", error);
    return null;
  }
}

// Event listeners for verse search
document
  .getElementById("searchVerseBtn")
  .addEventListener("click", async function () {
    const book = document.getElementById("bookSelect").value; // Get the selected book name
    const chapter = document.getElementById("chapterInput").value;
    const verse = document.getElementById("verseInput").value;

    // Log inputs before fetching the verse
    console.log("Selected Book:", book);
    console.log("Selected Chapter:", chapter);
    console.log("Selected Verse:", verse);

    if (!book || !chapter || !verse) {
      alert("Please select a book, chapter, and verse.");
      return;
    }

    const verseText = await fetchChapterData(book, chapter, verse);
    if (verseText) {
      passageInput.style.display = "block";
      bibleSearchModal.style.display = "none";
      inputChoiceContainer.style.display = "none";
      startButton.style.display = "block";
      passageInput.value = verseText;
      startButton.classList.add("active");
      startButton.disabled = false; // Enable the "Start Memorizing" button
    } else {
      alert("Verse not found!");
    }
  });

//
//
//
//
// ======== GAME LOGIC =========
//
//
//
// ========================
// 2. BEGINNING OF GAME: PASSAGE INPUT
// ========================
const passageInput = document.getElementById("passageInput");
const startButton = document.getElementById("startBtn");

// Enable/disable start button based on input
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

document.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("passageInput");
  element.classList.add("visible");
});

document.addEventListener("DOMContentLoaded", () => {
  const element = document.getElementById("gameArea");
  element.classList.add("visible");
});

const startGame = function () {
  passage = document.getElementById("passageInput").value;
  localStorage.setItem("lastPassage", passage); // Save the passage
  initializeGame(passage);
};

const restartGame = function () {
  const savedPassage = localStorage.getItem("lastPassage");
  if (savedPassage) {
    initializeGame(savedPassage);
  } else {
    alert("No saved passage found! Start a new game first.");
  }
};

// Event listeners for start and restart buttons
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartGame").addEventListener("click", restartGame);

// ========================
// 3. GAME LOGIC
// ========================
const initializeGame = function (gamePassage) {
  passage = gamePassage;
  words = passage.split(" ");
  round = 1;
  level = 1;

  // Hide initial input, show game area
  document.getElementById("passageInput").style.display = "none";
  document.getElementById("startBtn").style.display = "none";
  document.getElementById("gameEndButtons").style.display = "none";
  document.getElementById("gameArea").style.display = "block";
  document.getElementById("userInput").style.display = "block";
  document.getElementById("inputOther").style.display = "flex";

  nextRound();
};

const nextRound = function () {
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

const getRandomWords = function (count) {
  const indices = [];
  while (indices.length < count) {
    const randIndex = Math.floor(Math.random() * words.length);
    if (!indices.includes(randIndex)) indices.push(randIndex);
  }
  return indices;
};

const displayPassage = function () {
  const displayText = words
    .map((word, index) =>
      currentMissingWords.includes(index)
        ? '<span class="blank">_____</span>'
        : word
    )
    .join(" ");
  document.getElementById("displayText").innerHTML = displayText;
};

const normalizeText = function (text) {
  return text.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, "").toLowerCase();
};

const checkAnswer = function () {
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
    ).innerHTML = `<div class="correctAnswer">CORRECT ANSWER: ${correctAnswers.join(
      " "
    )}</div>`;
    document.getElementById("correctAnswer").style.display = "inline-block";
  }
};

// Add keyboard listener for Enter key
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

// ========================
// 4. END OF GAME
// ========================
const endGame = function () {
  document.getElementById("displayText").textContent =
    "Great job! You've completed the passage!";
  document.getElementById("userInput").style.display = "none";
  document.getElementById("inputOther").style.display = "none";
  document.getElementById("gameEndButtons").style.display = "flex";
};
