const form = document.querySelector(".form-quizz");
let tableauResultats = [];
const reponses = ['c', 'a', 'b', 'a', 'c'];
const titreResultat = document.querySelector(".resultats h2");
const textResultat = document.querySelector(".note");
const aideResultat = document.querySelector(".aide");
const toutesLesQuetions = document.querySelectorAll(".question-block");
let verifTableau = [];

form.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche la soumission classique du formulaire
    tableauResultats = []; // Reset du tableau avant lecture
    for (let i = 1; i <= 5; i++) {
        const reponseChoisie = document.querySelector(`input[name="q${i}"]:checked`);
        tableauResultats.push(reponseChoisie ? reponseChoisie.value : ""); // Si rien coché, on push ""
    }
    verifFunc(tableauResultats);
});

function verifFunc(tabResultats){
    verifTableau = [];
    for(let a = 0; a < 5; a++){
        verifTableau.push(tabResultats[a] === reponses[a]);
    }
    afficherResultats(verifTableau);
    couleursFonction(verifTableau);
}

function afficherResultats(tabCheck){
    const nbDeFautes = tabCheck.filter(el => !el).length;

    switch (nbDeFautes) {
        case 0:
            titreResultat.innerText= "Bravo, c'est un sans faute !";
            aideResultat.innerText= '';
            textResultat.innerText= '5/5';
            break;
        case 1:
            titreResultat.innerText= "Vous y êtes presque !";
            aideResultat.innerText= 'Retentez une autre réponse dans les cases rouges puis validez !';
            textResultat.innerText= '4/5';
            break;
        case 2:
            titreResultat.innerText= "Encore un effort";
            aideResultat.innerText= 'Retentez une autre réponse dans les cases rouges puis validez !';
            textResultat.innerText= '3/5';
            break;
        case 3:
            titreResultat.innerText= "Il reste quelques erreurs";
            aideResultat.innerText= 'Retentez une autre réponse dans les cases rouges puis validez !';
            textResultat.innerText= '2/5';
            break;
        case 4:
            titreResultat.innerText= "Peut mieux faire !";
            aideResultat.innerText= 'Retentez une autre réponse dans les cases rouges puis validez !';
            textResultat.innerText= '1/5';
            break;
        case 5:
            titreResultat.innerText= "Toutes les réponses sont fausses !";
            aideResultat.innerText= 'Retentez le quiz !';
            textResultat.innerText= '0/5';
            break;
        default:
            titreResultat.innerText= 'Woops, cas inattendu';
            aideResultat.innerText= '';
            textResultat.innerText= '';
            break;
    }
}

function couleursFonction(tabValBool){
    for(let j = 0; j < tabValBool.length; j++){
        if(tabValBool[j]){
            toutesLesQuetions[j].style.background = 'lightgreen';
        } else {
            toutesLesQuetions[j].style.background = '#ffb8b8';
            toutesLesQuetions[j].classList.add('echec');
            setTimeout(() => {
                toutesLesQuetions[j].classList.remove('echec');
            }, 500);
        }
    }
}

toutesLesQuetions.forEach(item =>{
    item.addEventListener('click', () =>{
        item.style.background =  "white";
    });
});
