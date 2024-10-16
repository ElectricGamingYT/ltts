const modal = document.getElementById('myModal');
const openModalBtn = document.getElementById('btn-verifica');
const whereAmIBtn = document.getElementById('btn-mai-multe');
const closeModalBtn = document.getElementById('closeModal');
const cityBox = document.getElementById('city-box');
const content = document.getElementById('content');
const loadingCircle = document.getElementById('loading-circle');

whereAmIBtn.addEventListener('click', function() {
  whereAmIBtn.style.display = 'none';
  loadingCircle.style.display = 'block';

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert('Geolocation nu este suportat de acest browser.');
    loadingCircle.style.display = 'none';
  }
});

openModalBtn.addEventListener('click', function() {
  modal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

function error() {
  cityBox.textContent = "Eroare la obținerea locației GPS.";
  cityBox.style.display = 'block';
  loadingCircle.style.display = 'none';
}

// Funcția pentru calcularea distanței dintre două coordonate (Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Raza Pământului în km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distanța în km
}

// Lista locațiilor predefinite cu coordonate
const oraseCuCoordonate = [
  { nume: 'Ploiești', lat: 44.939088, lon: 25.991130, mesaj: 'Te afli la Liceul Toma Socolescu din Ploiești!', raza: 1 },
  { nume: 'Cabana Dichiu', lat: 45.34746, lon: 25.42748, mesaj: 'Te afli la Cabana Dichiu, un loc minunat pentru drumeții!', raza: 2 },
  { nume: 'Lacul Bolboci', lat: 45.3906, lon: 25.4263, mesaj: 'Te afli la Lacul Bolboci, o destinație pitorească în Munții Bucegi!', raza: 1 },
  { nume: 'Pestera Ialomiței', lat: 45.393286, lon: 25.436873, mesaj: 'Te afli la Lacul Bolboci, o destinație pitorească în Munții Bucegi!', raza: 1 },
  { nume: 'Lacul Bolboci', lat: 45.290959, lon: 25.507908, mesaj: 'Te afli la Lacul Bolboci, o destinație pitorească în Munții Bucegi!', raza: 1 }
];

// Găsește orașul pe baza coordonatelor și distanței
function findCityByCoords(lat, lon) {
  return oraseCuCoordonate.find(oras => {
    const dist = calculateDistance(lat, lon, oras.lat, oras.lon);
    return dist <= oras.raza;
  });
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const orasGasit = findCityByCoords(lat, lon);

  if (orasGasit) {
    // Afișăm informațiile doar dacă orașul este găsit pe baza coordonatelor
    cityBox.textContent = "Te afli în locația: " + orasGasit.nume;
    content.textContent = orasGasit.mesaj;
    cityBox.style.display = 'block';
    openModalBtn.style.display = 'inline-block'; 
  } else {
    // Dacă nu se găsește niciun oraș în lista definită, afișăm mesaj corespunzător
    cityBox.textContent = "Te afli într-o locație necunoscută.";
    cityBox.style.display = 'block';
    openModalBtn.style.display = 'none';
  }

  loadingCircle.style.display = 'none'; // Oprim cercul de încărcare
}
