const affichageTravail = document.querySelector('.affichageT');
const affichagePause = document.querySelector('.affichageP');
const btnGo = document.querySelector('.b1');
const btnPause = document.querySelector('.b2');
const btnReset = document.querySelector('.b3');
const cycles = document.querySelector('h2');

const T_INIT = 1500;  // 25 minutes
const T_REP = 300;    // 5 minutes

let tempsInitial = T_INIT;
let tempsDeRepos = T_REP;
let pause = false;
let nbDeCycles = 0;
let ChronoEnMarche = false;
let timer = null;
let modeTravail = true;  // true = travail, false = repos

// Fonction utilitaire pour formater le temps
function formatTemps(secondes) {
    const minutes = Math.trunc(secondes / 60);
    const secs = secondes % 60;
    return `${minutes} : ${secs < 10 ? '0' + secs : secs}`;
}

// Initialisation de l'affichage
function initAffichage() {
    cycles.innerText = `Nombre de cycles : ${nbDeCycles}`;
    affichageTravail.innerText = formatTemps(tempsInitial);
    affichagePause.innerText = formatTemps(tempsDeRepos);
}

// Démarrer le chronomètre
function demarrerChrono() {
    if (ChronoEnMarche || timer) return;
    
    ChronoEnMarche = true;
    btnGo.textContent = "En cours...";
    
    timer = setInterval(() => {
        if (!pause) {
            if (modeTravail && tempsInitial > 0) {
                // Mode travail
                tempsInitial--;
                affichageTravail.innerText = formatTemps(tempsInitial);
                
                if (tempsInitial === 0) {
                    modeTravail = false;  // Passer en mode repos
                }
            } else if (!modeTravail && tempsDeRepos > 0) {
                // Mode repos
                tempsDeRepos--;
                affichagePause.innerText = formatTemps(tempsDeRepos);
                
                if (tempsDeRepos === 0) {
                    // Fin du cycle - reset et nouveau cycle
                    terminerCycle();
                }
            }
        }
    }, 1000);
}

// Terminer un cycle complet
function terminerCycle() {
    nbDeCycles++;
    cycles.innerText = `Nombre de cycles : ${nbDeCycles}`;
    
    // Reset pour nouveau cycle
    tempsInitial = T_INIT;
    tempsDeRepos = T_REP;
    modeTravail = true;
    
    initAffichage();
}

// Bouton Commencer
btnGo.addEventListener('click', () => {
    if (!ChronoEnMarche) {
        demarrerChrono();
    }
});

// Bouton Pause/Reprendre
btnPause.addEventListener('click', () => {
    if (ChronoEnMarche) {
        pause = !pause;
        btnPause.textContent = pause ? "Reprendre" : "Pause";
    }
});

// Bouton Réinitialiser
btnReset.addEventListener('click', () => {
    // Arrêter le timer
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
    
    // Reset toutes les variables
    ChronoEnMarche = false;
    pause = false;
    nbDeCycles = 0;
    tempsInitial = T_INIT;
    tempsDeRepos = T_REP;
    modeTravail = true;
    
    // Reset boutons
    btnGo.textContent = "Commencer";
    btnPause.textContent = "Pause";
    
    // Reset affichage
    initAffichage();
});

// Initialisation au chargement
initAffichage();