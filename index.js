// Replace with your NASA API Key
const API_KEY = "jOQuP7qMi4S5vg3y3Yy9Nk88BPfA27BqcM1olEdP";
const BASE_URL = "https://api.nasa.gov/planetary/apod";

// Fetch and display the image of the day for the current date
async function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    try {
        const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&date=${currentDate}`);
        if (!response.ok) throw new Error("Failed to fetch data.");
        const data = await response.json();
        displayImage(data);
    } catch (error) {
        displayError(error.message);
    }
}

// Fetch and display the image of the day for a selected date
async function getImageOfTheDay(date) {
    try {
        const response = await fetch(`${BASE_URL}?api_key=${API_KEY}&date=${date}`);
        if (!response.ok) throw new Error("Failed to fetch data.");
        const data = await response.json();
        displayImage(data);
        saveSearch(date);
        addSearchToHistory();
    } catch (error) {
        displayError(error.message);
    }
}

// Save the selected date to local storage
function saveSearch(date) {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem("searches", JSON.stringify(searches));
    }
}

// Add the search history to the UI
function addSearchToHistory() {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    const searchHistory = document.getElementById("search-history");
    searchHistory.innerHTML = ""; // Clear existing list

    searches.forEach(date => {
        const listItem = document.createElement("li");
        listItem.textContent = date;
        listItem.addEventListener("click", () => getImageOfTheDay(date));
        searchHistory.appendChild(listItem);
    });
}

// Display the image data in the UI
function displayImage(data) {
    const container = document.getElementById("current-image-container");
    container.innerHTML = `
        <h2>${data.title}</h2>
        <p>${data.date}</p>
        <img src="${data.url}" alt="${data.title}">
        <p>${data.explanation}</p>
    `;
}

// Display an error message in the UI
function displayError(message) {
    const container = document.getElementById("current-image-container");
    container.innerHTML = `<p class="error">${message}</p>`;
}

// Event listener for form submission
document.getElementById("search-form").addEventListener("submit", event => {
    event.preventDefault();
    const dateInput = document.getElementById("search-input").value;
    if (dateInput) {
        getImageOfTheDay(dateInput);
    }
});

// Initialize the page
window.onload = () => {
    getCurrentImageOfTheDay();
    addSearchToHistory();
};
