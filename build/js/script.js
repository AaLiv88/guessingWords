const themeObj = {
  cities: {

    words: [
      {
        word: "Москва",
        hint: "В этом городе есть кремль"
      },
      {
        word: "Париж",
        hint: "В этом городе есть эльфивая башня",
      },
      {
        word: "поп",
        hint: "Это животное любит кости"
      },
    ],

    title: "Города",
  },

  animals: {
    words: [
      {
        word: "рыба",
        hint: "Это животное обитает в воде"
      },
      {
        word: "собака",
        hint: "Это животное любит кости"
      },
    ],

    title: "Животные",
  }

}


let wordElem = document.querySelector(".word__wrapper");
let lettersBtnsElem = document.querySelector(".letters-buttons");

let modalChoosingTheme = document.querySelector(".modal-theme");
let modalThemeButtons = document.querySelector(".modal-theme__buttons");

const guessedCountElem = document.querySelector(".user-guesses__count");

const alphabetArr = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'э', 'ю', 'я'];

let wins = 0;
let losses = 0;


function game(theme) {
  modalChoosingTheme.style.display = "none";

  const { word, hint } = getRandomArrElem(theme);
  const wordSplit = word.toLowerCase().split("");
  const guessedLetters = [];
  guessedLetters.length = wordSplit.length;

  const maxUserGuesses = 10;
  let userGuess = 0;

  guessedCountElem.textContent = `${maxUserGuesses - userGuess}`;

  createLettersButtonsElem(wordSplit, wins + 7);

  wordSplit.forEach(() => wordElem.insertAdjacentHTML(
    "beforeend",
    `<div class="word__letter word__item" data-hidden="true"></div>`
  ));

  let wordLettersElems = document.querySelectorAll(".word__item");

  lettersBtnsElem.onclick = function(event) {
    const target = event.target;
    const index = wordSplit.indexOf(target.textContent);

    if (!target.classList.contains("letters-buttons__item")) return;

    if (index !== -1) {
      wordLettersElems[index].dataset.hidden = "false";
      wordLettersElems[index].textContent = wordSplit[index];
      guessedLetters[index] = wordSplit[index];
      wordSplit.slice(index, index);
    } else {
      userGuess++;
    }

    guessedCountElem.textContent = `${maxUserGuesses - userGuess}`;

    target.dataset.activated = "true";
    target.disabled = true;

    console.log(wordSplit, guessedLetters)
    console.log(equals(wordSplit, guessedLetters))

    if (equals(wordSplit, guessedLetters)) {
      win();
    } else if (userGuess === 10) {
      loss()
    } else if (userGuess === 5){
      console.log(hint)
    }

  }
}


function start() {
  modalChoosingTheme.style.display = "flex";

  modalThemeButtons.onclick = function(event) {
    const target = event.target;
    if (target.className !== "modal-theme__btn") return;
    game(themeObj[target.dataset.theme].words);
  }
}

function restart() {
  wordElem.textContent = "";
  lettersBtnsElem.textContent = "";
}


function win() {
  console.log(123)
  start();
  wins++;
  restart();
}


function loss() {
  console.log("поражение");
}


function createChoosingThemeElem(themeObj) {
  for (let [key, value] of Object.entries(themeObj)) {
    modalThemeButtons.insertAdjacentHTML("afterbegin", `
      <button class="modal-theme__btn" data-theme="${key}">${value.title}</button>
    `);
  }
}


function createLettersButtonsElem(wordSplit, lettersCount) {
  let lettersArr = wordSplit.slice();

  for (let i = lettersCount; i > 0; i--) {
    lettersArr.push(getRandomArrElem(alphabetArr));
  }

  lettersArr = shuffle(lettersArr);
  lettersArr.forEach(letter => lettersBtnsElem.insertAdjacentHTML("beforeend", `
    <button class="word__letter letters-buttons__item" data-activated="false">${letter}</button>
  `));
}


function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}


function equals(array1, array2) {
  return array1.length === array2.length && array1.every((value, index) => value === array2[index]);
}


function getRandomArrElem(wordsArr) {
  return wordsArr[Math.floor(Math.random() * wordsArr.length)];
}


createChoosingThemeElem(themeObj)
start()