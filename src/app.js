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

  if (
    !squareVerticalInput.value.trim().length ||
    !squareHorizontalInput.value.trim().length
  )
    return alert("Nie podałeś wartości")

  const MAX_HEIGHT = Number(squareVerticalInput.value)
  const MAX_WIDTH = Number(squareHorizontalInput.value)
  const images = getRandomImages(MAX_HEIGHT * MAX_WIDTH)

  for (let i = 0; i < MAX_HEIGHT; i++) {
    const row = `<div class="row row-${i}"></div>`
    boardHolder.insertAdjacentHTML("beforeend", row)
    for (let j = 0; j < MAX_WIDTH; j++) {
      const element = `
      <div class="card card-${i * MAX_WIDTH + j}">
        <div class="front">
          <img src="./assets/reversed.png" alt="" />
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
