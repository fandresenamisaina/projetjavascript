const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

let adj = new Date();
let options = { weekday: 'long' };
let jourActuel = adj.toLocaleDateString('fr-FR', options);
jourActuel = jourActuel.charAt(0).toUpperCase() + jourActuel.slice(1);

let tabJourEnOrdre = joursSemaine
    .slice(joursSemaine.indexOf(jourActuel))
    .concat(joursSemaine.slice(0, joursSemaine.indexOf(jourActuel)));

const CLEFAPI = '7eeafd3b450d84ab0b212a36ee7fa20d';

const temps = document.querySelector(".temps");
const temperature = document.querySelector(".temperature");
const localisation = document.querySelector(".localisation");

const heure = document.querySelectorAll(".heure-nom-prevision");
const tempPourH = document.querySelectorAll(".heure-prevision-valeur");

const joursDiv = document.querySelectorAll(".jour-prevision-nom");
const tempJoursDiv = document.querySelectorAll(".jour-prevision-temp");
const inIncon = document.querySelectorAll(".logo-meteo");

const overlay = document.querySelector(".overlay"); // <-- overlay ajouté

// 🔹 Fonction pour cacher l'overlay
function hideOverlay() {
    overlay.style.transition = "opacity 0.5s ease";
    overlay.style.opacity = 0;
    setTimeout(() => overlay.style.display = "none", 500);
}

// 📍 Géolocalisation avec fallback prompt
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const long = position.coords.longitude;
        const lat = position.coords.latitude;
        AppelAPI(long, lat);
    }, () => {
        const ville = prompt("Vous avez refusé la géolocalisation. Entrez votre ville :");
        if (ville) AppelAPIVille(ville);
        else {
            alert("Impossible de récupérer la météo !");
            hideOverlay(); // overlay disparaît si échec
        }
    });
} else {
    alert("Votre navigateur ne supporte pas la géolocalisation !");
    hideOverlay();
}

// 🔹 Météo par coordonnées
function AppelAPI(long, lat) {
    // MÉTÉO ACTUELLE
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&lang=fr&appid=${CLEFAPI}`)
        .then(res => res.json())
        .then(data => afficherMeteoActuelle(data))
        .catch(err => {
            console.error(err);
            alert("Impossible de récupérer la météo actuelle !");
            hideOverlay();
        });

    // PRÉVISIONS 3h / 7 jours
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&lang=fr&appid=${CLEFAPI}`)
        .then(res => res.json())
        .then(data => {
            afficherPrevisions(data);
            hideOverlay(); // overlay disparaît après affichage
        })
        .catch(err => {
            console.error(err);
            alert("Impossible de récupérer les prévisions météo !");
            hideOverlay();
        });
}

// 🔹 Météo par ville (fallback prompt)
function AppelAPIVille(ville) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&units=metric&lang=fr&appid=${CLEFAPI}`)
        .then(res => res.json())
        .then(data => {
            afficherMeteoActuelle(data);
            AppelAPI(data.coord.lon, data.coord.lat);
        })
        .catch(err => {
            console.error(err);
            alert("Impossible de récupérer la météo pour cette ville !");
            hideOverlay();
        });
}

// 🔹 Affichage météo actuelle
function afficherMeteoActuelle(data) {
    if (!data || !inIncon[0]) return;

    temps.innerText = data.weather[0].description;
    temperature.innerText = `${Math.trunc(data.main.temp)}°`;
    localisation.innerText = data.name;

    const iconCode = data.weather[0].icon;
    inIncon[0].src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    inIncon[0].alt = data.weather[0].description;
}

// 🔹 Affichage prévisions
function afficherPrevisions(data) {
    if (!data) return;
    const heureActuelle = new Date().getHours();

    // Heures + températures
    for (let i = 0; i < heure.length; i++) {
        if (!data.list[i]) continue;
        let heureIncr = (heureActuelle + i * 3) % 24;
        heure[i].innerText = `${heureIncr} h`;
        tempPourH[i].innerText = `${Math.trunc(data.list[i].main.temp)}°`;
    }

    // Jours + températures
    for (let j = 0; j < 7; j++) {
        const index = j * 8;
        if (!data.list[index]) continue;
        joursDiv[j].innerText = tabJourEnOrdre[j].slice(0, 3);
        tempJoursDiv[j].innerText = `${Math.trunc(data.list[index].main.temp)}°`;
    }
}
