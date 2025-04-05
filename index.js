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

const toggleBackdrop = () => {
  backdrop.classList.toggle("visible");
};

const clearUserInputs = () => {
  for (const usrInput of userInputs) {
    usrInput.value = "";
  }
};

const closeMovieModal = () => {
  movieModal.classList.remove("visible");
};

const cancelAddMovie = () => {
  toggleBackdrop();
  closeMovieModal();
  clearUserInputs();
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

const renderMovieElement = (id, title, imageUrl, rating) => {
  const newMovieElement = document.createElement("li");
  newMovieElement.className = "movie-element";
  newMovieElement.dataset.id = id;
  newMovieElement.innerHTML = `
    <div class="movie-element__image">
      <img src="${imageUrl}" alt="${title}">
    </div>
    <div class="movie-element__info">
      <h2>${title}</h2>
      <p>${rating}/10 stars</p>
    </div>
  `;
  newMovieElement.addEventListener("click", deleteMovieElement.bind(null, id));
  document.getElementById("movie-list").append(newMovieElement);
};

const addMovieHandler = () => {
  const titleValue = userInputs[0].value.trim();
  const imageValue = userInputs[1].value.trim();
  const ratingValue = userInputs[2].value;

  if (!titleValue || !imageValue || +ratingValue < 1 || +ratingValue > 10) {
    alert("Please enter valid values (Rating between 1-10)");
    return;
  }

  const newMovie = {
    id: Date.now().toString(),
    title: titleValue,
    image: imageValue,
    rating: ratingValue,
  };

  movies.push(newMovie);
  renderMovieElement(
    newMovie.id,
    newMovie.title,
    newMovie.image,
    newMovie.rating
  );
  closeMovieModal();
  toggleBackdrop();
  clearUserInputs();
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
});

cancelBtn.addEventListener("click", cancelAddMovie);
addBtn.addEventListener("click", addMovieHandler);
dangerBtn.addEventListener("click", cancelMovieDeletion);
