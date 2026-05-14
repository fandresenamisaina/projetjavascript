const today = new Date();
const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

let day = ("0" + nextWeek.getDate()).slice(-2);
let month = ("0" + (nextWeek.getMonth() + 1)).slice(-2); // CORRIGÉ : nextWeek au lieu de today
let year = nextWeek.getFullYear(); // CORRIGÉ : nextWeek au lieu de today

const affichage = document.querySelector('.affichage');
const btns = document.querySelectorAll('button');
const input = document.querySelectorAll('input');
const infoTxt = document.querySelector('.info-txt');
let dejaFait = false;

document.querySelector('input[type="date"]').value = `${year}-${month}-${day}`;

btns.forEach(btn => {
    btn.addEventListener('click', btnAction);
});

function btnAction(e) {
    let nvObj = {};
    input.forEach(input => {
        let attrName = input.getAttribute('name');
        let attrValeur = attrName !== "cookieExpire" ? input.value : input.valueAsDate;
        nvObj[attrName] = attrValeur;
    });

    let description = e.target.getAttribute('data-cookie');

    if (description === 'creer') {
        creerCookie(nvObj.cookieName, nvObj.cookieValue, nvObj.cookieExpire);
    } else if (description === "toutAfficher") {
        listeCookies();
    }
}

function creerCookie(name, value, exp) {
    infoTxt.innerText = "";
    affichage.innerHTML = "";

    let cookies = document.cookie.split(';');
    dejaFait = false; // CORRIGÉ : reset au début

    cookies.forEach(cookie => {
        cookie = cookie.trim();
        let formatCookie = cookie.split('=');
        if (formatCookie[0] === encodeURIComponent(name)) {
            dejaFait = true;
        }
    });

    if (dejaFait) {
        infoTxt.innerText = "Le nom est déjà utilisé";
        return;
    }

    if (name.length === 0) {
        infoTxt.innerText = "Impossible de créer un cookie sans nom";
        return;
    }

    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${exp.toUTCString()};path=/`;

    let info = document.createElement('li');
    info.innerText = `Cookie "${name}" créé`;
    affichage.appendChild(info);

    setTimeout(() => {
        info.remove();
    }, 1500);
}

function listeCookies() {
    let cookies = document.cookie.split(';');

    if (document.cookie === "") {
        infoTxt.innerText = "La liste de cookies est vide";
        affichage.innerHTML = ""; // CORRIGÉ : vider la liste même si vide
        return;
    }

    affichage.innerHTML = "";
    infoTxt.innerText = "Cookies enregistrés :";

    cookies.forEach(cookie => {
        cookie = cookie.trim();
        let formatCookie = cookie.split('=');

        let item = document.createElement('li');
        item.innerText = `Nom : ${decodeURIComponent(formatCookie[0])} | Valeur : ${decodeURIComponent(formatCookie[1] || '')}`; // CORRIGÉ : gestion des cookies sans valeur

        affichage.appendChild(item);
    });
}