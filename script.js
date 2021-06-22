const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const statsElement = document.getElementById('stats')
const nextIn = document.getElementsByClassName('next-quote')[0]
const nextInSeconds = document.getElementById('next-quote-secs')

const quoteURL = 'https://api.quotable.io/random';

let wordCount, starTime, letterCount;
let key = [];

function getRandomQuote() {
  return fetch(quoteURL)
    .then(res => res.json())
    .then(data => data.content)
}
async function renderNextQuote() {
  nextIn.classList.add('hidden')
  let quote = await getRandomQuote();
  quoteDisplayElement.innerHTML = '';
  quote.split('').forEach(char => {
    const charSpan = document.createElement('span')
    charSpan.innerText = char;
    quoteDisplayElement.appendChild(charSpan)
  });
  const letters = quote.replaceAll(/ /g, '%').split('');
  quote = quote.replaceAll(/./g, '.');
  quote = quote.replaceAll(/;/g, ';');
  quote = quote.replaceAll(/:/g, ':');
  quote = quote.replaceAll(/'/g, '\'');
  for (a of letters) {
    key.push(document.getElementById(a.toUpperCase()))
  }
  quoteInputElement.value = null;
  wordCount = quote.split(' ').length;
  letterCount = quote.split('').length;
  startTime = new Date();
  key[0].classList.add('selected')
}

let i = 0
quoteInputElement.addEventListener('input', (e) => {
  if (e.inputType === 'deleteContentBackward') {
    const keyElement = document.getElementById('back');
    keyElement.classList.add("hit")
    keyElement.addEventListener('animationend', () => {
      keyElement.classList.remove("hit")
    })
  } else if (e.inputType === 'insertText') {
    const keyElement = document.getElementById('%');
    keyElement.classList.add("hit")
    keyElement.addEventListener('animationend', () => {
      keyElement.classList.remove("hit")
    })
  }
  else {
    const keyElement = document.getElementById(e.data.toUpperCase());
    keyElement.classList.add("hit")
    keyElement.addEventListener('animationend', () => {
      keyElement.classList.remove("hit")
    })
  }
  const arrayQuote = quoteDisplayElement.querySelectorAll('span')
  const arrayValue = quoteInputElement.value.split('')
  arrayQuote.forEach((charSpan, index) => {
    const character = arrayValue[index];
    if (character == null) {
      charSpan.classList.remove('correct')
      charSpan.classList.remove('incorrect')
    }
    else if (character === charSpan.innerText) {
      charSpan.classList.add('correct')
      charSpan.classList.remove('incorrect')
      key[i].classList.remove('selected')
      i = index + 1;
      key[i].classList.add('selected')
    } else {
      charSpan.classList.remove('correct')
      charSpan.classList.add('incorrect')
    }
  })
  console.log(i, letterCount)
  if (i + 1 == letterCount) {
    finishGame()
  }
}
)

function finishGame() {
  let nextInStartTimer = 10
  const finalTime = new Date
  const seconds = (finalTime.getTime() - startTime.getTime()) / 1000
  const wps = wordCount / seconds
  const wpm = wps * 60;
  statsElement.innerText = `Your WPM was ${Math.floor(wpm)}`
  nextIn.classList.remove('hidden')
  console.log(nextIn)
  console.log(nextIn.classList)
  setInterval(() => {
    nextInSeconds.innerText = nextInStartTimer
    nextInStartTimer -= 1
  }, 1000)
  setTimeout(() => {
    window.location.reload(true)
  }, 11000)
}

renderNextQuote()

