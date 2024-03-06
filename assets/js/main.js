// Main

// Tab clicks
document.addEventListener('DOMContentLoaded', async () => {
  const tabs = document.querySelectorAll('.nav-link');
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const tabId = this.getAttribute('id');
      updatePageTitle(tabId);
    });
  });

  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const headerNav = document.querySelector('.header-nav');

  function toggleSidebar() {
    headerNav.classList.toggle('active');
  }

  mobileNavToggle.addEventListener('click', toggleSidebar);

  const tabLinks = document.querySelectorAll('.nav-link');

  tabLinks.forEach(link => {
    link.addEventListener('click', toggleSidebar);
  });
});

// Update Tab Titles
function updatePageTitle(tabId) {
  const pageTitle = document.getElementById('pageTitle');

  // Remove 'active' class from all tabs
  const tabs = document.querySelectorAll('.nav-link');
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });

  // Add 'active' class to the clicked tab
  const activeTab = document.getElementById(tabId);
  activeTab.classList.add('active');

  // Set page title based on the clicked tab
  switch (tabId) {
    case 'home-tab':
      pageTitle.textContent = 'Showtime Junction';
      break;
    case 'top-100-series-tab':
      pageTitle.textContent = 'Top 100 Series';
      break;
    case 'top-100-movies-tab':
      pageTitle.textContent = 'Top 100 Movies';
      break;
    default:
      pageTitle.textContent = 'Showtime Junction';
      break;
  }
}

// Title doesn't exceed 17 digits
function titleLength(title) {
  const maxLength = 17;
  if (title.length > maxLength) {
    return title.substring(0, maxLength) + '...';
  }
  return title;
}

// Home Tab scroll to sections (Movies or Series)
function scrollToSection(sectionId) {
  const sectionElement = document.getElementById(sectionId);
  sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToTab(tabId) {
  window.scrollTo({ top: 0, behavior: 'auto' });

  // Activate the target tab
  const targetTab = document.getElementById(tabId);
  targetTab.click();
}

// Home Tab 
const homeContainer = document.getElementById('home');

// Function to shuffle Home Tab display
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Fetch API data
async function displayHome() {
  const top100SeriesData = await fetchTop100Series();
  const top100MoviesData = await fetchTop100Movies();

  const shuffledTop10Series = shuffleArray(top100SeriesData).slice(0, 10);
  const shuffledTop10Movies = shuffleArray(top100MoviesData).slice(0, 10);

  displaySection(shuffledTop10Series, "Series", "top-100-series-tab");
  displaySection(shuffledTop10Movies, "Movies", "top-100-movies-tab");
}

function displaySection(data, sectionTitle, tabId) {
  const sectionHeader = document.createElement('h2');
  sectionHeader.textContent = sectionTitle;
  sectionHeader.style.color = 'white';
  sectionHeader.id = `${sectionTitle.toLowerCase()}-section`;
  homeContainer.appendChild(sectionHeader);

  for (let i = 0; i < data.length; i += 2) {
    const row = document.createElement('div');
    row.classList.add('row', 'custom-margin');

    for (let j = 0; j < 2 && i + j < data.length; j++) {
      const series = data[i + j];
      const title = titleLength(series.title);
      const seriesCard = document.createElement('div');
      seriesCard.classList.add('col-md-6', 'col-lg-6');
      seriesCard.innerHTML = `
            <div class="home-page-card">
                <div class="row g-0 align-items-center home-tab-cards">
                    <div class="col-md-4 mb-3 mt-3 card-img-homepage">
                        <img src="${series.image}" class="card-img-top clickable-image home-page-card-image" alt="${title}"">
                    </div>
                    <div class="col-md-4 d-flex align-items-center year-rating text-center">
                    <div class="card-body">
                        <h5 class="card-title test"><b>${title}</b></h5>
                        <p class="me-3">${series.year ? series.year : 'N/A'}</p>
                        <p class="me-3">⭐ ${series.rating ? series.rating : 'N/A'}</p>
                        <p class="me-3"><a href="${series.imdb_link}" target="_blank"><b>IMDb Link</b></a></p>
                    </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card-body text-center description-link">
                            <div class="col">
                                <p class="me-3">${series.description ? series.description : 'N/A'}</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
      const modal = createSeriesModal(series, i + j);
      document.body.appendChild(modal);

      row.appendChild(seriesCard);
    }
    homeContainer.appendChild(row);
  }

  const viewMoreButton = document.createElement('button');
  viewMoreButton.textContent = 'View More';
  viewMoreButton.classList.add('btn', 'btn-color', 'mb-3');
  viewMoreButton.addEventListener('click', () => {
    homeContainer.classList.add('fade-out');
    setTimeout(() => {
      document.getElementById(tabId).click();
      window.scrollTo({ top: 0, behavior: 'auto' });
      homeContainer.classList.remove('fade-out');
    }, 500);
  });

  homeContainer.appendChild(viewMoreButton);
}

// Series Tab 
const top100SeriesContainer = document.getElementById('top100Series');

// Function to display top 100 series
async function displaySeries() {
  const top100SeriesData = await fetchTop100Series();

  const itemsPerRow = calculateItemsPerRow();

  for (let i = 0; i < top100SeriesData.length; i += itemsPerRow) {
    const row = document.createElement('div');
    row.classList.add('row', 'custom-margin');

    for (let j = 0; j < itemsPerRow && i + j < top100SeriesData.length; j++) {
      const series = top100SeriesData[i + j];

      const title = titleLength(series.title);

      const seriesCard = document.createElement('div');
      seriesCard.classList.add('col');
      seriesCard.innerHTML = `
        <div class="series-card mb-3">
          <img src="${series.image}" class="series-card-img" alt="${title}">
          <div class="card-body">
            <h5 class="series-card-title text-center mb-3"><b>${title}</b></h5>
            <div class="justify-content-center">
              <p>⭐ ${series.rating ? series.rating : 'N/A'}</p>
              <button class="btn btn-color text-white border-white" data-bs-toggle="modal" data-bs-target="#seriesModal${i + j}" style="white-space: nowrap;">
                View Details
              </button>
            </div>
          </div>
        </div>`;
      const modal = createSeriesModal(series, i + j);
      document.body.appendChild(modal);

      row.appendChild(seriesCard);
    }
    top100SeriesContainer.appendChild(row);
  }
}

// Function to calculate the number of items per row based on card size and screen width
function calculateItemsPerRow() {
  const screenWidth = window.innerWidth;
  const cardWidth = 250;

  const itemsPerRow = Math.floor(screenWidth / cardWidth);
  return Math.max(itemsPerRow, 1);
}

// Recalculate items per row on window resize
window.addEventListener('resize', function () {
  top100SeriesContainer.innerHTML = '';
  displaySeries();
});

// Movies Tab
const top100MoviesContainer = document.getElementById('top100Movies');

// Function to display top 100 movies
async function displayMovies() {
  const top100MoviesData = await fetchTop100Movies();

  const itemsPerRow = calculateItemsPerRow();

  for (let i = 0; i < top100MoviesData.length; i += itemsPerRow) {
    const row = document.createElement('div');
    row.classList.add('row', 'custom-margin');

    for (let j = 0; j < itemsPerRow && i + j < top100MoviesData.length; j++) {
      const movie = top100MoviesData[i + j];

      const title = titleLength(movie.title);

      const movieCard = document.createElement('div');
      movieCard.classList.add('col');
      movieCard.innerHTML = `
        <div class="series-card mb-3">
          <img src="${movie.image}" class="series-card-img" alt="${title}">
          <div class="card-body">
            <h5 class="series-card-title text-center mb-3"><b>${title}</b></h5>
            <div class="justify-content-center">
              <p>⭐ ${movie.rating ? movie.rating : 'N/A'}</p>
              <button class="btn btn-color text-white border-white" data-bs-toggle="modal" data-bs-target="#moviesModal${i + j}" style="white-space: nowrap;">
                View Details
              </button>
            </div>
          </div>
        </div>`;

      const modal = createMoviesModal(movie, i + j);
      document.body.appendChild(modal);

      row.appendChild(movieCard);
    }
    top100MoviesContainer.appendChild(row);
  }
}

// Recalculate items per row on window resize
window.addEventListener('resize', function () {
  top100MoviesContainer.innerHTML = '';
  displayMovies();
});

// Call the function to display top100 series when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  await displaySeries();
  await displayMovies();
  await displayHome();
});

// Modals
function createModal(data, index, type) {
  const modal = document.createElement('div');
  modal.classList.add('modal', 'fade');
  modal.id = `${type}Modal${index}`;
  modal.tabIndex = -1;
  modal.setAttribute('aria-labelledby', `${type}ModalLabel${index}`);
  modal.setAttribute('aria-hidden', 'true');

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
  modal.appendChild(modalDialog);

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalDialog.appendChild(modalContent);

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header', 'modal-header');
  modalContent.appendChild(modalHeader);

  const modalTitle = document.createElement('h5');
  modalTitle.classList.add('modal-title');
  modalTitle.id = `${type}ModalLabel${index}`;
  modalTitle.textContent = data.title;
  modalHeader.appendChild(modalTitle);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body', 'custom-modal-body');
  modalBody.innerHTML = `
    <p><b>Release Date:</b> ${data.year ? data.year : 'N/A'}</p>
    <p><b>Genre:</b> ${data.genre ? data.genre : 'N/A'}</p>
    <p><b>Description:</b> ${data.description ? data.description : 'N/A'}</p>
    <p><b>IMDb Link:</b> <a href="${data.imdb_link}" target="_blank">${data.imdb_link ? data.imdb_link : 'N/A'}</a></p>
  `;
  modalContent.appendChild(modalBody);

  const modalFooter = document.createElement('div');
  modalFooter.classList.add('modal-footer', 'modal-footer');
  modalContent.appendChild(modalFooter);

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('btn', 'btn-secondary');
  closeButton.setAttribute('data-bs-dismiss', 'modal');
  closeButton.textContent = 'Close';
  modalFooter.appendChild(closeButton);

  return modal;
}

function createSeriesModal(series, index) {
  return createModal(series, index, 'series');
}

function createMoviesModal(movie, index) {
  return createModal(movie, index, 'movies');
}





