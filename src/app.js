import { disableCards, getRandomImages, hideAllCards } from "./helpers.js"

//Element holders
const squareHorizontalInput = document.querySelector(
  "[name='square-horizontal']"
)
const squareVerticalInput = document.querySelector("[name='square-vertical']")
const startBtn = document.querySelector('button[name="start"]')
const settingsForm = document.querySelector("form")
const boardHolder = document.querySelector("#board")

//Variables
let reversedCards = 0
let clickedCards = []
let points = 0

startBtn.addEventListener("click", (e) => {
  e.preventDefault()

  const vertical = squareVerticalInput.value.trim()
  const horizontal = squareHorizontalInput.value.trim()
  const MAX_HEIGHT = Number(vertical)
  const MAX_WIDTH = Number(horizontal)

  if (!vertical.length || !horizontal.length)
    return alert("Nie podałeś wartości")

  if ((MAX_HEIGHT * MAX_WIDTH) % 2 !== 0)
    return alert("Ilość kart musi być parzysta")

  const images = getRandomImages(MAX_HEIGHT * MAX_WIDTH)

  for (let i = 0; i < MAX_HEIGHT; i++) {
    const row = `<div class="row row-${i}"></div>`
    boardHolder.insertAdjacentHTML("beforeend", row)
    for (let j = 0; j < MAX_WIDTH; j++) {
      const element = `
      <div class="card card-${i * MAX_WIDTH + j}">
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
  startGame()
})

const startGame = () => {
  const cards = document.querySelectorAll(".card")

  cards.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (clickedCards.includes(index)) return

      clickedCards.push(index)
      if (reversedCards < 2) {
        item.querySelector(".front").classList.add("reverse-front")
        item.querySelector(".back").classList.add("reverse-back")
        reversedCards++

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
            points++
            disableCards(clickedCards)
          }

          setTimeout(() => {
            hideAllCards()
            clickedCards = []
            reversedCards = 0
          }, 1000)
        }
      }
    })
  })
}

const apiTest = async () => {
  const test = { boardWidth: 2, boardHeight: 3, nick: "arturek", score: 997 }
  // const data = await fetch("http://localhost:8080/records/", {
  //   method: "POST",
  //   body: JSON.stringify(test),
  //   headers: { "Content-Type": "application/json" },
  // })
  const data = await fetch("http://localhost:8080/records/")
  const data2 = await data.json()
  console.log(data2)
}

apiTest()
