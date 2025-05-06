let dogs = [];

async function fetchDogs() {
  const response = await fetch("dogs.json");
  dogs = await response.json();
  applyFilters(); // Visa alla hundar från början
}

function applyFilters() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const gender = document.getElementById("genderFilter").value;

  const filtered = dogs.filter((dog) => {
    const matchSearch =
      dog.Namn.toLowerCase().includes(search) ||
      dog.Regnr.toLowerCase().includes(search);

    const matchGender =
      gender === "Alla" || dog.Kön.toLowerCase() === gender.toLowerCase();

    return matchSearch && matchGender;
  });

  displayDogs(filtered);
}

function displayDogs(dogArray) {
  const dogList = document.getElementById("dogList");
  dogList.innerHTML = "";

  // Sortera på Index (lägst först)
  const sortedDogs = [...dogArray].sort((a, b) => a.Index - b.Index);

  sortedDogs.forEach((dog, index) => {
    const card = document.createElement("div");
    card.className = "dog-card";
    card.innerHTML = `
      <strong>${index + 1}. ${dog.Namn}</strong> (${dog.Regnr})<br>
      <strong>Kön:</strong> ${dog.Kön}<br>
      <strong>Född:</strong> ${dog.Födelseår}<br>
      <strong>Index:</strong> ${dog.Index}<br>
      <strong>Genomsnittligt släktskap:</strong> ${dog.Medelsläktskap}<br>
      <strong>Antal gen:</strong> ${dog.Antal_gen}
    `;
    dogList.appendChild(card);
  });
}

// Eventlyssnare
document.getElementById("searchInput").addEventListener("input", applyFilters);
document
  .getElementById("genderFilter")
  .addEventListener("change", applyFilters);

fetchDogs();
