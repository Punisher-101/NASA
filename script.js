const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

const count = 10;
const apiKey = `DEMO_KEY`;
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;
let resultsArray = [];
let favourites = {};

// Show COntent
function showContent() {
  window.scrollTo({ top: 0, behavior: 'instant' });
  loader.classList.add('hidden');
}

// Create DOM Nodes
function createDOMNodes(page) {
  const currentArray =
    page === 'result' ? resultsArray : Object.values(favourites);
  currentArray.forEach((result) => {
    // Card Container
    const card = document.createElement('div');
    card.classList.add('card');
    const link = document.createElement('a');
    link.setAttribute('title', 'View Full Image');
    link.setAttribute('href', result.hdurl);
    link.target = '_blank';
    const image = document.createElement('img');
    image.src = result.url;
    image.alt = 'NASA Picture of the Day';
    image.loading = 'lazy';
    image.classList.add('card-img-top');
    // Card Body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.title;
    // Save Text
    const saveText = document.createElement('p');
    saveText.classList.add('clickable');
    if (page === 'result') {
      saveText.textContent = 'ADD To Favourites';
      saveText.setAttribute('onclick', `saveFavourite('${result.url}')`);
    } else {
      saveText.textContent = 'Remove Favourites';
      saveText.setAttribute('onclick', `removeFavourite('${result.url}')`);
    }
    // Card Text
    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = result.explanation;
    // Footer
    const footer = document.createElement('small');
    footer.classList.add('text-muted');
    // Date
    const date = document.createElement('strong');
    date.textContent = result.date;
    const copyright = document.createElement('span');
    copyright.textContent = ` ${
      result.copyright === undefined ? '' : result.copyright
    }`;
    // Append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    imagesContainer.appendChild(card);
  });
}

// UPdating DOM
function updateDOM(page) {
  // Get favourties from local storage
  localStorage.getItem('nasaFavourites')
    ? (favourites = JSON.parse(localStorage.getItem('nasaFavourites')))
    : false;
  imagesContainer.textContent = '';
  createDOMNodes(page);
  if (page === 'favourites' && page !== 'result') {
    favouritesNav.classList.remove('hidden');
    resultsNav.classList.add('hidden');
  } else {
    favouritesNav.classList.add('hidden');
    resultsNav.classList.remove('hidden');
  }
  showContent();
}

// Save Favourite
function saveFavourite(itemUrl) {
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
      favourites[itemUrl] = item;
      saveConfirmed.classList.remove('hidden');
      setTimeout(() => {
        saveConfirmed.classList.add('hidden');
      }, 2000);
      localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
    }
  });
}

// Remove Favroutir
function removeFavourite(itemUrl) {
  if (favourites[itemUrl]) {
    delete favourites[itemUrl];
    localStorage.setItem('nasaFavourites', JSON.stringify(favourites));
    updateDOM('favourites');
  }
}

// Get 10 Images From NASA API
async function getNasaPictures() {
  // Show the Loader
  loader.classList.remove('hidden');
  try {
    const response = await fetch(apiURL);
    resultsArray = await response.json();
    updateDOM('result');
  } catch (error) {
    // cathing error
    console.log(error);
  }
}

getNasaPictures();
