let dogs = [];
let selectedFemale = null;
let selectedMales = [];

async function fetchDogs() {
  const response = await fetch("dogs.json");
  dogs = await response.json();
}

function renderFemaleSearch() {
  const query = document.getElementById("searchFemale").value.toLowerCase();
  const results = dogs.filter(
    (dog) =>
      dog.Kön.toLowerCase() === "tik" &&
      (dog.Namn.toLowerCase().includes(query) ||
        dog.Regnr.toLowerCase().includes(query))
  );

  const container = document.getElementById("femaleResult");
  container.innerHTML = "";

  results.forEach((dog) => {
    const card = document.createElement("div");
    card.className = "dog-card";
    card.style.cursor = "pointer";
    card.innerHTML = `
      <strong>${dog.Namn}</strong> (${dog.Regnr}) – SI: ${dog.Index}
    `;

    card.onclick = () => {
      selectedFemale = dog;
      const input = document.getElementById("searchFemale");
      input.value = `${dog.Namn} (${dog.Regnr})`;
      container.innerHTML = `<p>✅ Vald tik: <strong>${dog.Namn}</strong> – SI: ${dog.Index}</p>`;
    };

    container.appendChild(card);
  });
}

function renderMaleSearch() {
  const query = document.getElementById("searchMale").value.toLowerCase();
  const results = dogs.filter(
    (dog) =>
      dog.Kön.toLowerCase() === "hane" &&
      (dog.Namn.toLowerCase().includes(query) ||
        dog.Regnr.toLowerCase().includes(query))
  );

  const container = document.getElementById("maleResults");
  container.innerHTML = "";

  results.forEach((dog) => {
    const alreadySelected = selectedMales.some((m) => m.Regnr === dog.Regnr);
    const item = document.createElement("div");
    item.className = "dog-card";

    const btn = document.createElement("button");
    btn.className = "readMore_btn";
    btn.disabled = alreadySelected || selectedMales.length >= 5;
    btn.textContent = alreadySelected
      ? `✅ Redan vald`
      : `➕ Lägg till ${dog.Namn.toUpperCase()} – SI: ${dog.Index}`;

    btn.onclick = () => {
      selectedMales.push(dog);
      updateMaleList();

      const searchInput = document.getElementById("searchMale");
      searchInput.value = "";
      container.innerHTML = "";

      const listSection = document.getElementById("selectedMaleList");
      if (listSection) {
        listSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    item.innerHTML = `
      <strong>${dog.Namn}</strong> (${dog.Regnr}) – SI: ${dog.Index}<br/>
    `;
    item.appendChild(btn);
    container.appendChild(item);
  });
}

function updateMaleList() {
  const info = document.getElementById("selectedMalesInfo");
  info.textContent = `Valda hanar: ${selectedMales.length}/5`;

  const container = document.getElementById("selectedMaleList");
  container.innerHTML = "";

  selectedMales.forEach((dog, index) => {
    const item = document.createElement("div");
    item.className = "dog-card";
    item.innerHTML = `
      <strong>${dog.Namn}</strong> (${dog.Regnr}) – SI: ${dog.Index}
      <br><button onclick="removeMale(${index})" class="readMore_btn" style="margin-top: 5px;">❌ Ta bort</button>
    `;
    container.appendChild(item);
  });
}

function removeMale(index) {
  selectedMales.splice(index, 1);
  updateMaleList();
}

function calculatePairings() {
  const container = document.getElementById("pairResults");
  container.innerHTML = "";

  if (!selectedFemale) {
    container.innerHTML =
      "<p style='color:red'>❗ Du måste välja en tik först.</p>";
    return;
  }

  if (selectedMales.length === 0) {
    container.innerHTML =
      "<p style='color:red'>❗ Du måste välja minst en hane.</p>";
    return;
  }

  const resultWrapper = document.createElement("div");
  resultWrapper.innerHTML = `<h2>Provparningar för <strong>${selectedFemale.Namn}</strong>:</h2>`;

  selectedMales.forEach((hane) => {
    const avgIndex = (
      (Number(selectedFemale.Index) + Number(hane.Index)) /
      2
    ).toFixed(1);

    // 🔸 Färgkodning baserat på gemensamt SI
    let siColor = "gray";
    if (avgIndex < 100) {
      siColor = "green";
    } else if (avgIndex <= 110) {
      siColor = "orange";
    } else {
      siColor = "red";
    }

    const item = document.createElement("div");
    item.className = "dog-card";
    item.innerHTML = `
      <strong>${selectedFemale.Namn}</strong> × <strong>${hane.Namn}</strong><br>
      SI Tik: ${selectedFemale.Index} | SI Hane: ${hane.Index}<br>
      <strong>Gemensamt SI:</strong> <span style="color:${siColor}; font-weight: bold;">${avgIndex}</span>
    `;
    resultWrapper.appendChild(item);
  });

  container.appendChild(resultWrapper);
}

// 🧠 Eventlyssnare
document
  .getElementById("searchFemale")
  .addEventListener("input", renderFemaleSearch);
document
  .getElementById("searchMale")
  .addEventListener("input", renderMaleSearch);
document
  .getElementById("calculateBtn")
  .addEventListener("click", calculatePairings);

fetchDogs();
