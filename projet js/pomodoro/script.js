const affichageTravail = document.querySelector('.affichageT');
const affichagePause = document.querySelector('.affichageP');
const btnGo = document.querySelector('.b1');
const btnPause = document.querySelector('.b2');
const btnReset = document.querySelector('.b3');
const cycles = document.querySelector('h2');

const T_INIT = 1500;
const T_REP = 300;

let tempsInitial = T_INIT;
let tempsDeRepos = T_REP;
let pause = false;
let nbDeCycles = 0;
cycles.innerText = `Nombre de cycles : ${nbDeCycles}`;

let ChronoEnMarche = false;

affichageTravail.innerText =
  `${Math.trunc(tempsInitial / 60)} : ${tempsInitial % 60 < 10 ? '0' + (tempsInitial % 60) : tempsInitial % 60}`;

affichagePause.innerText =
  `${Math.trunc(tempsDeRepos / 60)} : ${tempsDeRepos % 60 < 10 ? '0' + (tempsDeRepos % 60) : tempsDeRepos % 60}`;

btnGo.addEventListener('click', () => {
  if (!ChronoEnMarche) {
    ChronoEnMarche = true;
    if (tempsInitial > 0) {
      tempsInitial--;
    }
    affichageTravail.innerText =
      `${Math.trunc(tempsInitial / 60)} : ${tempsInitial % 60 < 10 ? '0' + (tempsInitial % 60) : tempsInitial % 60}`;
  }
});

let timer = setInterval(() => {
  if (!pause && tempsInitial > 0) {
    tempsInitial--;
    affichageTravail.innerText =
      `${Math.trunc(tempsInitial / 60)} : ${tempsInitial % 60 < 10 ? '0' + (tempsInitial % 60) : tempsInitial % 60}`;
  } else if (!pause && tempsDeRepos === 0 && tempsInitial === 0) {
    tempsInitial = T_INIT;
    tempsDeRepos = T_REP;
    nbDeCycles++;
    cycles.innerText = `Nombre de cycles : ${nbDeCycles}`;

    affichageTravail.innerText =
      `${Math.trunc(tempsInitial / 60)} : ${tempsInitial % 60 < 10 ? '0' + (tempsInitial % 60) : tempsInitial % 60}`;

    affichagePause.innerText =
      `${Math.trunc(tempsDeRepos / 60)} : ${tempsDeRepos % 60 < 10 ? '0' + (tempsDeRepos % 60) : tempsDeRepos % 60}`;
  } else if (!pause && tempsInitial === 0) {
    tempsDeRepos--;
    affichagePause.innerText =
      `${Math.trunc(tempsDeRepos / 60)} : ${tempsDeRepos % 60 < 10 ? '0' + (tempsDeRepos % 60) : tempsDeRepos % 60}`;
  }
}, 1000);

btnReset.addEventListener('click', () => {
  clearInterval(timer);
  ChronoEnMarche = false;
  pause = false;
  tempsInitial = T_INIT;
  tempsDeRepos = T_REP;
  btnPause.innerText = "Pause";
  nbDeCycles = 0;
  cycles.innerText = `Nombre de cycles : ${nbDeCycles}`;

  affichageTravail.innerText =
    `${Math.trunc(tempsInitial / 60)} : ${tempsInitial % 60 < 10 ? '0' + (tempsInitial % 60) : tempsInitial % 60}`;

  affichagePause.innerText =
    `${Math.trunc(tempsDeRepos / 60)} : ${tempsDeRepos % 60 < 10 ? '0' + (tempsDeRepos % 60) : tempsDeRepos % 60}`;
});

btnPause.addEventListener('click', () => {
  if (ChronoEnMarche) {
    if (pause) {
      btnPause.innerText = "Pause";
    } else {
      btnPause.innerText = "Reprendre";
    }
    pause = !pause;
  }
});
