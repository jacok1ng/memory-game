import {
  API_URL,
  disableCards,
  getRandomImages,
  hideAllCards,
  updateRanking,
} from "./helpers.js"

//Element holders
const squareHorizontalInput = document.querySelector(
  "[name='square-horizontal']"
)
const squareVerticalInput = document.querySelector("[name='square-vertical']")
const startBtn = document.querySelector('button[name="start"]')
const rankingBtn = document.querySelector('button[name="ranking-btn"]')
const closeRankingBtn = document.querySelector('button[name="close-ranking"]')
const saveScoreBtn = document.querySelector('button[name="save-score"]')
const restartGameBtn = document.querySelector('button[name="restart-game"]')
const nickInput = document.querySelector('input[name="nickname"]')
const settingsForm = document.querySelector("#settings-form")
const summaryHolder = document.querySelector(".summary")
const boardHolder = document.querySelector("#board")
const showedCardsHolder = document.querySelector("#showed-cards")
const clickCounterHolder = document.querySelector("#clicks-counter")
const scoreboardHolder = document.querySelector(".scoreboard")
const rankingHolder = document.querySelector(".ranking")
const select = document.querySelector("select")

//Variables
let reversedCards = 0
let clickedCards = []
let clicks = 0
let showedCards = 0
let cardsOnStart = 0
let boardWidth = 0
let boardHeight = 0

//Static variavles

select.addEventListener("change", (e) => {
  console.log("change", e)
  console.log(select.value)
  updateRanking(select.value)
})

rankingBtn.addEventListener("click", async (e) => {
  e.preventDefault()
  const rankingList = document.querySelector("#ranking-list")
  rankingList.innerHTML = "Ładowanie..."
  settingsForm.style.display = "none"
  rankingHolder.style.display = "block"

  const response = await fetch(`${API_URL}/records/`)
  const data = await response.json()
  if (Array.isArray(data)) {
    const options = data.reduce(
      (acc, curr) =>
        `${acc} <option value="${curr.size}">${curr.size}</option>`,
      ""
    )
    select.innerHTML = options

    updateRanking(data[0].size)
    return
  } else {
    rankingList.innerHTML = "Brak wyników"
  }
})

closeRankingBtn.addEventListener("click", (e) => {
  e.preventDefault()
  settingsForm.style.display = "flex"
  rankingHolder.style.display = "none"
})

restartGameBtn.addEventListener("click", (e) => {
  e.preventDefault()
  restartGame()
})

saveScoreBtn.addEventListener("click", (e) => {
  e.preventDefault()
  const playerNick = nickInput.value.trim()

  if (playerNick.length < 3 && playerNick.length < 16)
    return alert("Twój nick musi zawierać od 3 do 15 znaków")

  const data = {
    boardWidth,
    boardHeight,
    nick: playerNick,
    score: clicks,
  }

  fetch(`${API_URL}/records/`, {
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  })

  restartGame()
})

startBtn.addEventListener("click", (e) => {
  e.preventDefault()

  const vertical = squareVerticalInput.value.trim()
  const horizontal = squareHorizontalInput.value.trim()
  boardHeight = Number(vertical)
  boardWidth = Number(horizontal)

  if (!vertical.length || !horizontal.length)
    return alert("Nie podałeś wartości")

  if ((boardHeight * boardWidth) % 2 !== 0)
    return alert("Ilość kart musi być parzysta")

  if (boardHeight * boardWidth > 36)
    return alert("Maksymalna liczba kart to 36")

  if (boardHeight * boardWidth < 4) return alert("Minimalna liczba kart to 4")

  const images = getRandomImages(boardHeight * boardWidth)
  cardsOnStart = boardHeight * boardWidth

  for (let i = 0; i < boardHeight; i++) {
    const row = `<div class="row row-${i}"></div>`
    boardHolder.insertAdjacentHTML("beforeend", row)
    for (let j = 0; j < boardWidth; j++) {
      const element = `
      <div class="card card-${i * boardWidth + j}">
        <div class="front">
          <img src="./assets/reversed.png" alt="reversed card" />
        </div>
        <div class="back">
          <img src="./assets/${images.pop()}.png" alt="" />
        </div>
      </div>
      `
      const currentRow = document.querySelector(`.row-${i}`)
      currentRow.insertAdjacentHTML("beforeend", element)
    }
  }

  settingsForm.style.display = "none"
  scoreboardHolder.style.display = "flex"
  updateScoreboard()
  startGame()
})

const startGame = () => {
  const cards = document.querySelectorAll(".card")
  boardHolder.style.display = "block"
  clicks = 0

  cards.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (clickedCards.includes(index)) return

      clickedCards.push(index)
      if (reversedCards < 2) {
        item.querySelector(".front").classList.add("reverse-front")
        item.querySelector(".back").classList.add("reverse-back")
        reversedCards++
        clicks++
        updateScoreboard()

        if (reversedCards == 2) {
          const firstCard = document.querySelector(
            `.card-${clickedCards[0]} > .back > img`
          )
          const secondCard = document.querySelector(
            `.card-${clickedCards[1]} > .back > img`
          )
          const firstPhotoIndex = firstCard.src.slice(
            firstCard.src.indexOf("assets/") + 7
          )
          const secondPhotoIndex = secondCard.src.slice(
            firstCard.src.indexOf("assets/") + 7
          )

          if (firstPhotoIndex === secondPhotoIndex) {
            disableCards(clickedCards)
            showedCards += 2
            updateScoreboard()
          }

          setTimeout(() => {
            hideAllCards()
            clickedCards = []
            reversedCards = 0
            if (showedCards === cardsOnStart) {
              endGame()
            }
          }, 1000)
        }
      }
    })
  })
}

const updateScoreboard = () => {
  clickCounterHolder.innerHTML = `Ilość kliknięć: ${clicks}`
  showedCardsHolder.innerHTML = `Odgadniętę karty: ${showedCards}/${cardsOnStart}`
}

const endGame = () => {
  const boardSize = document.querySelector("#board-size")
  const summaryClick = document.querySelector("#summary-click")

  reversedCards = 0
  boardHolder.style.display = "none"
  scoreboardHolder.style.display = "none"
  summaryHolder.style.display = "flex"
  boardSize.innerHTML = `Plansza: ${boardWidth}x${boardHeight}`
  summaryClick.innerHTML = `Liczba kliknięć: ${clicks}`
}

const restartGame = () => {
  summaryHolder.style.display = "none"
  settingsForm.style.display = "flex"
  boardHolder.innerHTML = ""
  squareVerticalInput.value = ""
  squareHorizontalInput.value = ""
  nickInput.value = ""
  showedCards = 0
  squareVerticalInput.focus()
}
