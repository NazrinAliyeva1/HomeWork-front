document.addEventListener("DOMContentLoaded", function () {
    fetchShows();

    // Axtarış Formunun İşlənməsi
    document.getElementById("search-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const searchInput = document.getElementById("search-input").value;
        searchShows(searchInput); // Axtar işlemini yapan fonksiyonu çağır
    });
});

let showsData; // Seriyaların məlumatlarını saxlayacaq array

async function fetchShows() {
    const apiUrl = "https://api.tvmaze.com/shows";
    try {
        const response = await fetch(apiUrl);
        showsData = await response.json();
        displayShows(showsData);
    } catch (error) {
        console.error("Error fetching shows:", error);
    }
}

function displayShows(shows) {
    const showsList = document.getElementById("shows-list");
    showsList.innerHTML = ''; // Əvvəlcədən mövcud serialları silmək üçün
    shows.forEach(show => {
        const showElement = document.createElement("div");
        showElement.classList.add("col-md-4", "mb-4", "show-card");
        showElement.dataset.showId = show.id;
        showElement.innerHTML = `
      <div class="card">
        <img src="${show.image.medium}" class="card-img-top" alt="${show.name}">
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">IMDb: ${show.rating.average ? show.rating.average : "N/A"}</p>
        </div>
      </div>
    `;
        showsList.appendChild(showElement);
    });
}

// Axtar
function searchShows(query) {
    const searchResults = showsData.filter(show => show.name.toLowerCase().includes(query.toLowerCase()));
    displayShows(searchResults);
}

 // Serial Sıralamasının İşlənməsi
 document.getElementById("sort-btn").addEventListener("click", function () {
    const sortBtn = document.getElementById("sort-btn");
    let sortDirection = sortBtn.dataset.sortDirection || "asc"; // Başlanğıcda "artan" olaraq qeyd edilir

    let sortedShows;

    if (sortDirection === "asc") {
        sortedShows = showsData.slice().sort((a, b) => {
            const ratingA = a.rating.average || 0; // IMDb reytinqini yoxlamaq üçün
            const ratingB = b.rating.average || 0;
            return ratingA - ratingB;
        });
        sortBtn.textContent = "Azalan";
        sortDirection = "desc";
    } else {
        sortedShows = showsData.slice().sort((a, b) => {
            const ratingA = a.rating.average || 0;
            const ratingB = b.rating.average || 0;
            return ratingB - ratingA;
        });
        sortBtn.textContent = "Artan";
        sortDirection = "asc";
    }

    // Düzəldilmiş seriyaları göstər
    displayShows(sortedShows);

    // sortDirection-dəki dəyəri yenilə
    sortBtn.dataset.sortDirection = sortDirection;
});