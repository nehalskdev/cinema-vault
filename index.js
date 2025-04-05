const addMovieBtn = document.getElementById("add-movie-btn");
const movieModal = document.getElementById("add-modal");
const backdrop = document.getElementById("backdrop");
const cancelBtn = movieModal.querySelector(".btn--passive");
const addBtn = cancelBtn.nextElementSibling;
const userInputs = movieModal.querySelectorAll("input");
const entryText = document.getElementById("entry-text");
const deleteModal = document.getElementById("delete-modal");
const dangerBtn = document.getElementById("btn-danger");
let successBtn = document.getElementById("btn-success");

const movies = [];
let currentMovieId = null;

const toggleBackdrop = () => {
  backdrop.classList.toggle("visible");
};

const clearUserInputs = () => {
  userInputs.forEach((input) => (input.value = ""));
};

const closeMovieModal = () => {
  movieModal.classList.remove("visible");
};

const cancelAddMovie = () => {
  toggleBackdrop();
  closeMovieModal();
  clearUserInputs();
  currentMovieId = null;
  addBtn.textContent = "Add";
};

const updateUI = () => {
  entryText.style.display = movies.length ? "none" : "block";
};

const cancelMovieDeletion = () => {
  toggleBackdrop();
  deleteModal.classList.remove("visible");
};

const deleteMovieElement = (movieId) => {
  deleteModal.classList.add("visible");
  toggleBackdrop();
  successBtn.replaceWith(successBtn.cloneNode(true));
  successBtn = document.getElementById("btn-success");
  dangerBtn.addEventListener("click", cancelMovieDeletion);
  successBtn.addEventListener(
    "click",
    deleteMovieConfirmation.bind(null, movieId)
  );
};

const deleteMovieConfirmation = (movieId) => {
  const movieIndex = movies.findIndex((movie) => movie.id === movieId);
  if (movieIndex === -1) return;

  movies.splice(movieIndex, 1);
  const movieElement = document.querySelector(`[data-id="${movieId}"]`);
  if (movieElement) movieElement.remove();

  cancelMovieDeletion();
  updateUI();
};

const renderMovieElement = (movie) => {
  const existingElement = document.querySelector(`[data-id="${movie.id}"]`);
  if (existingElement) existingElement.remove();

  const newMovieElement = document.createElement("li");
  newMovieElement.className = "movie-element";
  newMovieElement.dataset.id = movie.id;
  newMovieElement.innerHTML = `
    <div class="movie-element__image">
      <img src="${movie.image}" alt="${movie.title}">
    </div>
    <div class="movie-element__info">
      <h2>${movie.title}</h2>
      <p>${movie.rating}/5 stars ⭐</p>
      <div class="movie-actions">
        <button class="btn edit-btn">Edit</button>
        <button class="btn delete-btn">Delete</button>
      </div>
    </div>
  `;

  newMovieElement
    .querySelector(".delete-btn")
    .addEventListener("click", () => deleteMovieElement(movie.id));

  newMovieElement
    .querySelector(".edit-btn")
    .addEventListener("click", () => openEditModal(movie.id));

  document.getElementById("movie-list").append(newMovieElement);
};

const openEditModal = (movieId) => {
  const movie = movies.find((m) => m.id === movieId);
  if (!movie) return;

  userInputs[0].value = movie.title;
  userInputs[1].value = movie.image;
  userInputs[2].value = movie.rating;
  currentMovieId = movieId;
  addBtn.textContent = "Update";
  movieModal.classList.add("visible");
  toggleBackdrop();
};

const addMovieHandler = () => {
  const titleValue = userInputs[0].value.trim();
  const imageValue = userInputs[1].value.trim();
  const ratingValue = userInputs[2].value;

  if (!titleValue || !imageValue || +ratingValue < 1 || +ratingValue > 5) {
    alert("Please enter valid values (Rating between 1-5)");
    return;
  }

  if (currentMovieId) {
    // Update existing movie
    const movieIndex = movies.findIndex((m) => m.id === currentMovieId);
    if (movieIndex === -1) return;

    movies[movieIndex] = {
      id: currentMovieId,
      title: titleValue,
      image: imageValue,
      rating: ratingValue,
    };
    renderMovieElement(movies[movieIndex]);
  } else {
    // Add new movie
    const newMovie = {
      id: Date.now().toString(),
      title: titleValue,
      image: imageValue,
      rating: ratingValue,
    };
    movies.push(newMovie);
    renderMovieElement(newMovie);
  }

  closeMovieModal();
  toggleBackdrop();
  clearUserInputs();
  currentMovieId = null;
  addBtn.textContent = "Add";
  updateUI();
};

// Event Listeners
addMovieBtn.addEventListener("click", () => {
  movieModal.classList.add("visible");
  toggleBackdrop();
});

backdrop.addEventListener("click", () => {
  clearUserInputs();
  closeMovieModal();
  cancelMovieDeletion();
  currentMovieId = null;
  addBtn.textContent = "Add";
});

cancelBtn.addEventListener("click", cancelAddMovie);
addBtn.addEventListener("click", addMovieHandler);
dangerBtn.addEventListener("click", cancelMovieDeletion);
