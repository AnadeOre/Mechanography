const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')
const statsElement = document.getElementById('stats')
const nextIn = document.getElementsByClassName('next-quote')[0]
const nextInSeconds = document.getElementById('next-quote-secs')

const quoteURL = 'http://api.quotable.io/random';

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
}

let i = 0
quoteInputElement.addEventListener('input', (e) => {
  key[i].classList.add('selected')
  let correct = true;
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
      correct = false
    }
    else if (character === charSpan.innerText) {
      charSpan.classList.add('correct')
      charSpan.classList.remove('incorrect')
      key[i].classList.remove('selected')
      correct = true;
      i = index + 1;
      key[i].classList.add('selected')
    } else {
      charSpan.classList.remove('correct')
      charSpan.classList.add('incorrect')
      correct = false
    }
  })
  if (i === letterCount - 1) {
    finishGame()
  }
}
)

function finishGame() {
  let nextInStartTimer = 10
  const finalTime = new Date
  const seconds = Math.round((finalTime.getTime() - startTime.getTime()) / 1000)
  const wps = seconds / wordCount
  const wpm = wps * 60;
  statsElement.innerText = `Your WPM was ${Math.floor(wpm)}`
  nextIn.classList.remove('hidden')
  console.log(nextIn)
  console.log(nextIn.classList)
  setInterval(() => {
    nextInSeconds.value = nextInStartTimer
    nextInStartTimer -= 1
  }, 1000)
  setTimeout(() => {
    renderNextQuote()
  }, 11000)
}

renderNextQuote()

