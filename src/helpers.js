const IMAGES_COUNT = 10
export const API_URL = "http://localhost:3000"

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

export const getRandomImages = (MAX_IMAGES) => {
  const images = []
  const getNextImage = () => {
    const newPhotoIndex = Math.floor(Math.random() * IMAGES_COUNT) + 1
    if (images.includes(newPhotoIndex)) return getNextImage()
    else return newPhotoIndex
  }
  for (let i = 0; i < MAX_IMAGES / 2; i++) {
    const newImage = getNextImage()
    images.push(newImage)
    images.push(newImage)
  }

  return shuffle(images)
}

export const hideAllCards = () => {
  const cards = document.querySelectorAll(".card")
  cards.forEach((item) => {
    item.querySelector(".front").classList.remove("reverse-front")
    item.querySelector(".back").classList.remove("reverse-back")
  })
}

export const showAllCards = () => {
  const cards = document.querySelectorAll(".card")
  cards.forEach((item) => {
    item.querySelector(".front").classList.add("reverse-front")
    item.querySelector(".back").classList.add("reverse-back")
  })
}

export const disableCards = (cards) => {
  const firstCard = document.querySelector(`.card-${cards[0]}`)
  const secondCard = document.querySelector(`.card-${cards[1]}`)
  firstCard.style.visibility = "hidden"
  secondCard.style.visibility = "hidden"
}

export const updateRanking = async (sortType) => {
  const rankingList = document.querySelector("#ranking-list")
  const settingsForm = document.querySelector("#settings-form")
  const rankingHolder = document.querySelector(".ranking")
  let data

  rankingList.innerHTML = "Ładowanie..."
  settingsForm.style.display = "none"
  rankingHolder.style.display = "block"

  if (!sortType || !sortType.length) {
    const response = await fetch(`${API_URL}/records/`)
    data = await response.json()
  } else {
    const response = await fetch(`${API_URL}/records/${sortType}`)
    data = await response.json()
  }

  if (Array.isArray(data)) {
    const sortedPlayers = data.sort(
      ({ score }, { score: scoreB }) => score - scoreB
    )
    const players = sortedPlayers.reduce(
      (acc, curr, index) =>
        `${acc}<li> <strong>${index + 1}.</strong> ${curr.nick} (${
          curr.score
        } Kliknięć)</li>`,
      ""
    )
    rankingList.innerHTML = players
  } else rankingList.innerHTML = "Brak wyników"
}
