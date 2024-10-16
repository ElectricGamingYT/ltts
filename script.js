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
    {nume: 'Bucuresti', mesaj: 'Nu ai nimic de aflat despre acest oraș.'},
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


function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(data => {
      const userCity = data.address.city || data.address.town || data.address.village;
      checkCustomLocations(lat, lon); // Verifică locațiile custom
      showCity(userCity);
    })
    .catch(error => {
      cityBox.textContent = "Eroare la obținerea locației.";
      cityBox.style.display = 'block';
      loadingCircle.style.display = 'none';
    });
}

function checkCustomLocations(lat, lon) {
  const customLocations = [
    {nume: 'Cabana Dichiu', lat: 44.5600, lon: 25.5941, raza: 1000, mesaj: 'Ești în apropierea Cabanei Dichiu!'}
    // Adaugă alte locații personalizate aici
  ];

  let foundCustomLocation = false;
  
  for (const loc of customLocations) {
    const distance = calculateDistance(lat, lon, loc.lat, loc.lon);
    
    if (distance <= loc.raza) {
      cityBox.textContent = "Te afli în apropierea locației: " + loc.nume;
      content.textContent = loc.mesaj;
      cityBox.style.display = 'block';
      openModalBtn.style.display = 'inline-block'; // Butonul "Vreau să știu mai mult" devine vizibil
      foundCustomLocation = true;
      break;
    }
  }

  if (!foundCustomLocation) {
    openModalBtn.style.display = 'none'; // Ascunde butonul dacă nu e locație custom
  }

  loadingCircle.style.display = 'none';
}

// Funcție pentru calcularea distanței dintre două coordonate geografice (în metri)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Raza Pământului în metri
  const φ1 = lat1 * Math.PI/180; // Convertire în radiani
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2 - lat1) * Math.PI/180;
  const Δλ = (lon2 - lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distanța în metri
}
