const modal = document.getElementById('myModal');
const openModalBtn = document.getElementById('btn-verifica');
const whereAmIBtn = document.getElementById('btn-mai-multe');
const startGameBtn = document.getElementById('btn-incepe-jocul');
const closeModalBtn = document.getElementById('closeModal');
const cityBox = document.getElementById('city-box');
const content = document.getElementById('content');
const loadingCircle = document.getElementById('loading-circle');

// Eveniment pentru butonul "Unde ma aflu"
whereAmIBtn.addEventListener('click', function() {
  whereAmIBtn.style.display = 'none'; // Ascunde butonul "Unde ma aflu"
  startGameBtn.style.display = 'none'; // Ascunde butonul "Incepe jocul"
  loadingCircle.style.display = 'block'; // Arată cercul de încărcare

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert('Geolocation nu este suportat de acest browser.');
    getIpLocation(); // fallback to IP location
  }
});

openModalBtn.addEventListener('click', function() {
  modal.style.display = 'flex'; // Deschide modalul
});

closeModalBtn.addEventListener('click', function() {
  modal.style.display = 'none'; // Închide modalul
});

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(data => {
      const userCity = data.address.city || data.address.town || data.address.village;
      showCity(userCity);
    })
    .catch(error => {
      cityBox.textContent = "Eroare la obținerea locației.";
      cityBox.style.display = 'block';
      loadingCircle.style.display = 'none';
    });
}

function error() {
  getIpLocation(); // fallback la locația IP dacă GPS-ul eșuează
}

function getIpLocation() {
  fetch('https://ipinfo.io?token=0fcee6375a1282') // Înlocuiește cu cheia ta API
    .then(response => response.json())
    .then(data => {
      const userCity = data.city;
      showCity(userCity);
    })
    .catch(() => {
      cityBox.textContent = "Eroare la obținerea locației.";
      cityBox.style.display = 'block';
      loadingCircle.style.display = 'none';
    });
}

function showCity(userCity) {
  const orase = [
    {nume: 'Ploiești', mesaj: 'Nu ai nimic de aflat despre acest oraș.'},
    {nume: 'Baicoi', mesaj: 'Bucureștiul este capitala României, vibrant și aglomerat!'}
  ];

  let foundCity = false;
  const normalizedUserCity = normalizeText(userCity);

  for (const oras of orase) {
    const normalizedCityName = normalizeText(oras.nume);
    
    if (normalizedCityName === normalizedUserCity) {
      cityBox.textContent = "Te afli în orașul: " + oras.nume;
      content.textContent = oras.mesaj;
      cityBox.style.display = 'block';
      openModalBtn.style.display = 'inline-block'; // Butonul "Vreau să știu mai mult" devine vizibil
      foundCity = true;
      break;
    }
  }

  if (!foundCity) {
    cityBox.textContent = "Te afli într-o locație necunoscută.";
    cityBox.style.display = 'block';
    openModalBtn.style.display = 'none';
  }

  loadingCircle.style.display = 'none';
}

function normalizeText(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
