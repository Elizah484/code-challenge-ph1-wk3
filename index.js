document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "http://localhost:3000/films";
    const filmLists = document.querySelector("#films");
    const moviePoster = document.querySelector("#movie-poster");
    const movieTitle = document.querySelector("#movie-title");
    const movieRuntime = document.querySelector("#movie-runtime");
    const movieShowtime = document.querySelector("#movie-showtime");
    const ticketsAvailable = document.querySelector("#tickets-available");
    const buyTicketButton = document.querySelector("#buy-ticket");

    let currentFilm;

    // Fetching all the movies to the menu
    fetch(baseUrl)
        .then((response) => response.json())
        .then((films) => {
            filmLists.innerHTML = ""; // Clears placeholder
            films.forEach((film) => {
                const li = document.createElement("li");
                li.textContent = film.title;
                li.classList.add("film", "item");
                li.addEventListener("click", () => displayFilmDetails(film));
                filmLists.appendChild(li);
            });
            displayFilmDetails(films[0]); // Display first film by default
        });

    function displayFilmDetails(film) {
        currentFilm = film; // Reloads the current film
        moviePoster.src = film.poster;
        movieTitle.textContent = film.title;
        movieRuntime.textContent = `Runtime: ${film.runtime} mins`;
        movieShowtime.textContent = `Showtime: ${film.showtime}`;
        updateTicketsDisplay(film);
    }

    function updateTicketsDisplay(film) {
        const availableTickets = film.capacity - film.tickets_sold;
        ticketsAvailable.textContent = `Available Tickets: ${availableTickets}`;
        buyTicketButton.disabled = availableTickets <= 0; // Disable button if no tickets are left
    }

    buyTicketButton.addEventListener("click", () => {
        const availableTickets = currentFilm.capacity - currentFilm.tickets_sold;
        if (availableTickets > 0) {
            currentFilm.tickets_sold += 1; // Increment tickets sold
            updateTicketsDisplay(currentFilm);

            // Update the server with the new tickets sold count
            fetch(`${baseUrl}/${currentFilm.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tickets_sold: currentFilm.tickets_sold }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to update tickets");
                    }
                    return response.json();
                })
                .catch((error) => console.error("Error updating tickets:", error));
        }
    });
});
