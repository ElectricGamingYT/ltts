const modal = document.getElementById('myModal');
const openModalBtn = document.getElementById('btn-verifica');
const whereAmIBtn = document.getElementById('btn-unde-aflu');
const closeModalBtn = document.getElementById('closeModal');
const cityBox = document.getElementById('city-box');
const content = document.getElementById('content');
const loadingCircle = document.getElementById('loading-circle');
const blurOverlay = document.createElement('div');

// Eveniment pentru butonul "Unde mă aflu"
whereAmIBtn.addEventListener('click', function() {
  whereAmIBtn.style.display = 'none'; // Ascunde butonul "Unde mă aflu"
  loadingCircle.style.display = 'block'; // Arată cercul de încărcare

  // Folosire IPinfo pentru a obține locația utilizatorului prin IP
  fetch('https://ipinfo.io?token=0fcee6375a1282') // Înlocuiește YOUR_API_TOKEN cu cheia ta API
    .then(response => response.json())
    .then(data => {
      const userCity = data.city; // Obține numele orașului din răspunsul IPinfo
      console.log("Oraș detectat de IPinfo: ", userCity); // Log pentru a verifica orașul detectat
      showCity(userCity);
    })
    .catch(error => {
      console.error('Eroare la obținerea locației:', error);
      cityBox.textContent = "Eroare la obținerea locației.";
      cityBox.style.display = 'block';
      loadingCircle.style.display = 'none'; // Ascunde cercul de încărcare
    });
});

// Eveniment pentru butonul "Vreau să știu mai mult"
openModalBtn.addEventListener('click', function() {
  modal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

window.addEventListener('click', function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

function showCity(userCity) {
  const orase = [
    {nume: 'Ploiești', mesaj: 'Nu ai nimic de aflat'},
    {nume: 'Baicoi', mesaj: 'Bucureștiul este capitala României, vibrant și aglomerat!'}
  ];

  let foundCity = false;

  // Normalizează textul pentru a elimina diferențele de capitalizare și diacritice
  const normalizedUserCity = normalizeText(userCity);

  for (const oras of orase) {
    const normalizedCityName = normalizeText(oras.nume);
    
    if (normalizedCityName === normalizedUserCity) {
      cityBox.textContent = "Te afli în orașul: " + oras.nume;
      cityBox.style.display = 'block'; // Arată textul orașului
      content.textContent = oras.mesaj;
      openModalBtn.style.display = 'inline-block'; // Activează butonul "Vreau să știu mai mult"
      foundCity = true;
      break;
    }
  }

  if (!foundCity) {
    cityBox.textContent = "Te afli într-o locație necunoscută.";
    cityBox.style.display = 'block'; // Arată textul orașului chiar și atunci când nu este găsit niciun oraș
    openModalBtn.style.display = 'none'; // Ascunde butonul "Vreau să știu mai mult" dacă nu e oraș recunoscut
  }

  loadingCircle.style.display = 'none'; // Ascunde cercul de încărcare
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD') // Normalizează și elimină diacriticele
    .replace(/[\u0300-\u036f]/g, ""); // Șterge diacriticele
}
