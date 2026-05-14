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

const overlay = document.querySelector(".overlay");

// 🔹 Fonction pour cacher l'overlay
function hideOverlay() {
    overlay.style.transition = "opacity 0.5s ease";
    overlay.style.opacity = "0";
    setTimeout(() => overlay.style.display = "none", 500);
}

// 🔹 Fonction pour afficher l'overlay
function showOverlay() {
    overlay.style.display = "flex";
    overlay.style.opacity = "1";
}

// 📍 Initialisation au chargement
document.addEventListener('DOMContentLoaded', function() {
    showOverlay();
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const long = position.coords.longitude;
                const lat = position.coords.latitude;
                AppelAPI(long, lat);
            }, 
            () => {
                const ville = prompt("Vous avez refusé la géolocalisation. Entrez votre ville :");
                if (ville) {
                    AppelAPIVille(ville);
                } else {
                    alert("Impossible de récupérer la météo !");
                    hideOverlay();
                }
            }
        );
    } else {
        const ville = prompt("Votre navigateur ne supporte pas la géolocalisation. Entrez votre ville :");
        if (ville) {
            AppelAPIVille(ville);
        } else {
            alert("Impossible de récupérer la météo !");
            hideOverlay();
        }
    }
});

// 🔹 Météo par coordonnées
function AppelAPI(long, lat) {
    // MÉTÉO ACTUELLE
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&lang=fr&appid=${CLEFAPI}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => afficherMeteoActuelle(data))
        .catch(err => {
            console.error('Erreur météo actuelle:', err);
            alert("Impossible de récupérer la météo actuelle !");
            hideOverlay();
        });

    // PRÉVISIONS 3h / 7 jours
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&lang=fr&appid=${CLEFAPI}`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        })
        .then(data => {
            afficherPrevisions(data);
            hideOverlay();
        })
        .catch(err => {
            console.error('Erreur prévisions:', err);
            alert("Impossible de récupérer les prévisions météo !");
            hideOverlay();
        });
}

// 🔹 Météo par ville (fallback)
function AppelAPIVille(ville) {
    showOverlay();
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ville}&units=metric&lang=fr&appid=${CLEFAPI}`)
        .then(res => {
            if (!res.ok) throw new Error(`Ville non trouvée: ${res.status}`);
            return res.json();
        })
        .then(data => {
            afficherMeteoActuelle(data);
            AppelAPI(data.coord.lon, data.coord.lat);
        })
        .catch(err => {
            console.error('Erreur ville:', err);
            alert("Ville non trouvée !");
            hideOverlay();
        });
}

// 🔹 Affichage météo actuelle
function afficherMeteoActuelle(data) {
    if (!data || data.cod !== 200 || !inIncon[0]) return;

    temps.innerText = data.weather[0].description;
    temperature.innerText = `${Math.trunc(data.main.temp)}°`;
    localisation.innerText = data.name;

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    inIncon[0].src = iconUrl;
    inIncon[0].alt = data.weather[0].description;
}

// 🔹 Affichage prévisions
function afficherPrevisions(data) {
    if (!data || data.cod !== "200") return;
    
    const heureActuelle = new Date().getHours();

    // Heures + températures (6 premières prévisions à 3h d'intervalle)
    for (let i = 0; i < Math.min(heure.length, data.list.length); i++) {
        let heureIncr = (heureActuelle + i * 3) % 24;
        heure[i].innerText = `${heureIncr}h`;
        tempPourH[i].innerText = `${Math.trunc(data.list[i].main.temp)}°`;
    }

    // Jours + températures (7 jours)
    for (let j = 0; j < Math.min(7, joursDiv.length); j++) {
        const index = j * 8; // 8 prévisions par jour (3h)
        if (data.list[index]) {
            joursDiv[j].innerText = tabJourEnOrdre[j].slice(0, 3);
            tempJoursDiv[j].innerText = `${Math.trunc(data.list[index].main.temp)}°`;
        }
    }
}