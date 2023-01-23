const IMAGES_COUNT = 10

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
export const disableCards = (cards) => {
  const firstCard = document.querySelector(`.card-${cards[0]}`)
  const secondCard = document.querySelector(`.card-${cards[1]}`)
  firstCard.style.visibility = "hidden"
  secondCard.style.visibility = "hidden"
}
