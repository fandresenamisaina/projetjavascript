const searchImput = document.querySelector(".recherche-poke input");
let allPokemon = [];
let tableauFin = [];
let listePoke = document.querySelector(".liste-poke");
const limite = 75;
var PokeNombreDebut = 21;

var types = {
    bug: "#a8b820",
    dark: "#705848",
    dragon: "#7030f8",
    electric: "#f8d030",
    fairy: "#ee99ac",
    fighting: "#c03028",
    fire: "#f08030",
    flying: "#a890f0",
    ghost: "#705998",
    grass: "#78c850",
    ground: "#e0c068",
    ice: "#98d8d8",
    normal: "#a8a878",
    poison: "#a040a0",
    psychic: "#f85888",
    rock: "#b8a0f0",
    steel: "#b8b8d0",
    water: "#6890f0",
    immune: "#d6d6d6",
    noteffective: "#fdd0d0",
    veryeffective: "#ccfbcc",
};

function fetchPokemonBase() {
    const promises = [];

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limite}`)
        .then(reponse => reponse.json())
        .then(allPoke => {
            allPoke.results.forEach(pokemon => {
                promises.push(fetchPokemonComplet(pokemon));
            });
        })
        .then(() => {
            Promise.all(promises).then(() => {
                tableauFin = allPokemon
                    .sort((a, b) => a.id - b.id)
                    .slice(0, PokeNombreDebut);

                creatCard(tableauFin);
            });
        });
}

let counter = 0;

function fetchPokemonComplet(pokemon) {
    let objPokemonFull = {};
    let url = pokemon.url;

    return fetch(url)
        .then(reponse => reponse.json())
        .then(pokeData => {
            objPokemonFull.id = pokeData.id;
            objPokemonFull.name = pokeData.name;
            objPokemonFull.type = pokeData.types[0].type.name;
            objPokemonFull.pic = pokeData.sprites.front_default;

            allPokemon.push(objPokemonFull);
            counter++;
        });
}

function creatCard(arr) {
    for (let i = 0; i < arr.length; i++) {
        const carte = document.createElement("li");
        carte.classList.add("hoverableCarte");

        carte.style.background = types[arr[i].type];

        const txtCarte = document.createElement("h5");
        txtCarte.innerText = arr[i].name;

        const idCarte = document.createElement("p");
        idCarte.innerText = `ID# ${arr[i].id}`;

        const imgCarte = document.createElement("img");
        imgCarte.src = arr[i].pic;

        carte.append(imgCarte, txtCarte, idCarte);
        listePoke.appendChild(carte);
    }
}

searchImput.addEventListener("input", e => {
    e.target.parentNode.classList.toggle("active-input", e.target.value !== "");
});

let index = PokeNombreDebut;

window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (clientHeight + scrollTop >= scrollHeight - 20) {
        addPoke(6);
    }
});

function addPoke(nb) {
    if (index >= counter) return;
    creatCard(allPokemon.slice(index, index + nb));
    index += nb;
}

document.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();
    recherche();
});

function recherche() {
    if (index < counter) addPoke(counter - index);

    let filter = searchImput.value.toUpperCase();
    let allLi = document.querySelectorAll(".liste-poke li");
    let allTitles = document.querySelectorAll(".liste-poke li h5");

    for (let i = 0; i < allLi.length; i++) {
        allLi[i].style.display =
            allTitles[i].innerText.toUpperCase().includes(filter)
                ? "flex"
                : "none";
    }
}

fetchPokemonBase();
