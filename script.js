const modal = document.getElementById('myModal');
const openModalBtn = document.getElementById('btn-verifica');
const whereAmIBtn = document.getElementById('btn-mai-multe');
const closeModalBtn = document.getElementById('closeModal');
const cityBox = document.getElementById('city-box');
const content = document.getElementById('content');
const loadingCircle = document.getElementById('loading-circle');

// Adaugă verificări în consolă pentru debugging
whereAmIBtn.addEventListener('click', function() {
  console.log("Buton 'Unde mă aflu' a fost apăsat."); // Verificăm dacă evenimentul este declanșat
  whereAmIBtn.style.display = 'none';
  loadingCircle.style.display = 'block';

  if (navigator.geolocation) {
    console.log("Geolocația este suportată. Se solicită locația...");
    navigator.geolocation.getCurrentPosition(success, handleError, { timeout: 10000, enableHighAccuracy: true });
  } else {
    alert('Geolocația nu este suportată de acest browser.');
    loadingCircle.style.display = 'none';
  }
});

openModalBtn.addEventListener('click', function() {
  modal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

function handleError(error) {
  let errorMessage = 'Eroare necunoscută la obținerea locației.';
  console.error("Cod eroare geolocație: ", error.code); // Debugging pentru erori
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorMessage = 'Accesul la locație a fost refuzat.';
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage = 'Informațiile despre locație nu sunt disponibile.';
      break;
    case error.TIMEOUT:
      errorMessage = 'A expirat timpul pentru a obține locația.';
      break;
  }
  cityBox.textContent = errorMessage;
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
  { nume: 'Ploiești', lat: 44.939088, lon: 25.991130, mesaj: 'Ploiești este municipiul de reședință al județului Prahova, Muntenia, România. Este situat la 60 km nord de București, pe coordonatele de 26°1\'48" longitudine estică și 44°56\'24" latitudine nordică și are o suprafață de aproape 60 km².', raza: 1 },
  { nume: 'Cabana Dichiu', lat: 45.34746, lon: 25.42748, mesaj: 'Cabana Dichiu este situată în Munții Bucegi, județul Dâmbovița, România. Aceasta se află la o altitudine de aproximativ 1.550 de metri, pe coordonatele de 25°25\'45" longitudine estică și 45°18\'30" latitudine nordică. Este un punct de plecare ideal pentru drumeții în Munții Bucegi, oferind acces ușor către diverse trasee montane.', raza: 2 },
  { nume: 'Lacul Bolboci', lat: 45.3906, lon: 25.4263, mesaj: 'Lacul Bolboci este un lac de acumulare din Munții Bucegi, județul Dâmbovița, România. Situat la o altitudine de 1.438 de metri, pe coordonatele de 25°27\'50" longitudine estică și 45°22\'05" latitudine nordică, lacul oferă un peisaj spectaculos și este cunoscut ca "Marea din Bucegi".', raza: 1 },
  { nume: 'Pestera Ialomiței', lat: 45.393286, lon: 25.436873, mesaj: 'Peștera Ialomiței se află în Munții Bucegi, județul Dâmbovița, România, la o altitudine de 1.530 de metri. Peștera este situată pe coordonatele de 25°26\'35" longitudine estică și 45°22\'45" latitudine nordică și este una dintre cele mai vizitate atracții turistice din zonă datorită frumuseții sale naturale și a bogățiilor geologice.', raza: 1 },
  { nume: 'Lacul Bolboci', lat: 45.290959, lon: 25.507908, mesaj: 'Pensiunea Valea Șipotelor este situată în comuna Moroeni, județul Dâmbovița, România. Amplasată pe coordonatele de 25°26\'10" longitudine estică și 45°19\'20" latitudine nordică, pensiunea oferă cazare într-un cadru natural liniștit, aproape de pădurile Munților Bucegi, fiind un loc perfect pentru relaxare și drumeții.', raza: 1 }
];

// Găsește orașul pe baza coordonatelor și distanței
function findCityByCoords(lat, lon) {
  return oraseCuCoordonate.find(oras => {
    const dist = calculateDistance(lat, lon, oras.lat, oras.lon);
    console.log(`Distanța calculată: ${dist} km de la ${oras.nume}`); // Log pentru distanță
    return dist <= oras.raza;
  });
}

function success(position) {
  console.log("Locația a fost detectată cu succes.");
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  console.log(`Coordonate GPS: Lat = ${lat}, Lon = ${lon}`); // Afișăm coordonatele pentru debugging

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
