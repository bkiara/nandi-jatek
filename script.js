const words = [
    { word: "Meggyes utca", category: "Főhadiszállások" },
    { word: "Budafoki út", category: "Főhadiszállások" },
    { word: "Schönherz", category: "Főhadiszállások" },
    { word: "Attila út", category: "Főhadiszállások" },

    { word: "John Reed", category: "Edzőtermek" },
    { word: "Millenium", category: "Edzőtermek" },
    { word: "Schönherz koli", category: "Edzőtermek" },
    { word: "4%", category: "Edzőtermek" },

    { word: "rántott csirkemell pürével", category: "Nándi rendelései" },
    { word: "lazacos maki", category: "Nándi rendelései" },
    { word: "dupla sajtburger", category: "Nándi rendelései" },
    { word: "tépett husis quesadilla", category: "Nándi rendelései" },

    { word: "Maki", category: "Fiú nevek" },
    { word: "Völgy", category: "Fiú nevek" },
    { word: "Áron", category: "Fiú nevek" },
    { word: "Ádám", category: "Fiú nevek" }
];

let selectedWords = [];
let errorCount = 0;
const maxErrors = 4;
const categoriesFound = [];

const wordContainer = document.getElementById("word-container");
const resultDiv = document.getElementById("result");
const errorDiv = document.getElementById("error-message");
const resetButton = document.getElementById("reset-btn");

const categoryColors = {
    "Főhadiszállások": "#66BB6A",
    "Edzőtermek": "#FFEB3B",
    "Nándi rendelései": "#4CAF50",
    "Fiú nevek": "#FF5722"
};
const checkButton = document.getElementById("check-button");

checkButton.addEventListener("click", () => {
    checkSelection();  // Az Enter funkciót váltja ki
});

function shuffleWords() {
    return words.sort(() => Math.random() - 0.5);
}

function displayWords() {
    wordContainer.innerHTML = "";
    shuffleWords().forEach(wordObj => {
        const wordCard = document.createElement("div");
        wordCard.classList.add("word-card");
        wordCard.textContent = wordObj.word;
        wordCard.addEventListener("click", () => selectWord(wordObj, wordCard));
        wordContainer.appendChild(wordCard);
    });
}

function selectWord(wordObj, wordCard) {
    if (selectedWords.includes(wordObj)) {
        selectedWords = selectedWords.filter(word => word !== wordObj);
        wordCard.classList.remove("selected");
    } else if (selectedWords.length < 4) {
        selectedWords.push(wordObj);
        wordCard.classList.add("selected");
    }
}

function checkSelection() {
    if (selectedWords.length !== 4) {
        alert("Válassz ki pontosan 4 szót!");
        return;
    }

    const categories = selectedWords.map(word => word.category);
    const uniqueCategories = [...new Set(categories)];

    if (uniqueCategories.length === 1) {
        correctSelection(uniqueCategories[0]);
    } else {
        incorrectSelection();
    }
}

function correctSelection(category) {
    selectedWords.forEach(word => {
        const wordCards = document.querySelectorAll(".word-card");
        wordCards.forEach(card => {
            if (card.textContent === word.word) {
                card.classList.add("correct");
                card.style.backgroundColor = categoryColors[category];
            }
        });
    });
    categoriesFound.push(category);
    resultDiv.textContent = `Helyes! A kategória: ${category}`;
    selectedWords = [];
    sortCategories();
    checkGameOver();
}

function incorrectSelection() {
    errorCount++;
    selectedWords.forEach(word => {
        const wordCards = document.querySelectorAll(".word-card");
        wordCards.forEach(card => {
            if (card.textContent === word.word) {
                card.classList.add("incorrect");
            }
        });
    });
    errorDiv.textContent = `Hibás választás! Hibák száma: ${errorCount}`;
    // Töröljük a kijelöléseket
    setTimeout(() => {
        document.querySelectorAll(".word-card").forEach(card => {
            card.classList.remove("selected", "incorrect");
        });
    }, 1000); // Várunk 1 másodpercet, hogy a felhasználó láthassa a hibát, majd töröljük
    selectedWords = [];
    checkGameOver();
}

function checkGameOver() {
    if (categoriesFound.length === 4) {
        resultDiv.textContent = "Gratulálok! Minden kategóriát kitaláltál!";
    } else if (errorCount >= maxErrors) {
        resultDiv.textContent = "Vége a játéknak! Túllépted a hibák számát.";
    }
}

function sortCategories() {
    categoriesFound.forEach(category => {
        const wordCards = document.querySelectorAll(".word-card");
        const categoryWords = words.filter(word => word.category === category);

        categoryWords.forEach(word => {
            const wordCard = Array.from(wordCards).find(card => card.textContent === word.word);
            wordCard.style.order = "1";
        });
    });
}

function resetGame() {
    selectedWords = [];
    errorCount = 0;
    categoriesFound.length = 0;
    errorDiv.textContent = "";
    resultDiv.textContent = "";
    displayWords();
}

resetButton.addEventListener("click", resetGame);

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        checkSelection();
    }
});

displayWords();

