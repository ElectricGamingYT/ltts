const modal = document.getElementById('myModal');
const openModalBtn = document.getElementById('btn-verifica');
const whereAmIBtn = document.getElementById('btn-mai-multe');
const startGameBtn = document.getElementById('btn-incepe-jocul');
const closeModalBtn = document.getElementById('closeModal');
const cityBox = document.getElementById('city-box');
const content = document.getElementById('content');
const loadingCircle = document.getElementById('loading-circle');

// Eveniment pentru butonul "Vreau să știu mai multe despre unde sunt"
whereAmIBtn.addEventListener('click', function() {
  whereAmIBtn.style.display = 'none'; // Ascunde butonul "Vreau să știu mai multe"
  startGameBtn.style.display = 'none'; // Ascunde butonul "Vreau să încep jocul"
  loadingCircle.style.display = 'block'; // Arată cercul de încărcare

  // Folosire IPinfo pentru a obține locația utilizatorului prin IP
  fetch('https://ipinfo.io?token=0fcee6375a1282') // Înlocuiește cu cheia ta API
    .then(response => response.json())
    .then(data => {
      const userCity = data.city;
      console.log("Oraș detectat de IPinfo: ", userCity);
      showCity(userCity);
    })
    .catch(error => {
      console.error('Eroare la obținerea locației:', error);
      cityBox.textContent = "Eroare la obținerea locației.";
      cityBox.style.display = 'block';
      loadingCircle.style.display = 'none';
    });
});

// Eveniment pentru butonul "Vreau să încep jocul"
startGameBtn.addEventListener('click', function() {
  alert("Funcția de joc nu este implementată încă!");
});

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
  const normalizedUserCity = normalizeText(userCity);

  for (const oras of orase) {
    const normalizedCityName = normalizeText(oras.nume);
    
    if (normalizedCityName === normalizedUserCity) {
      cityBox.textContent = "Te afli în orașul: " + oras.nume;
      cityBox.style.display = 'block';
      content.textContent = oras.mesaj;
      openModalBtn.style.display = 'inline-block';
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
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "");
}
