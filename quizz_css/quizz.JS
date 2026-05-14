const form = document.querySelector(".form-quizz");
const reponses = ['c', 'a', 'b', 'a', 'c'];
const titreResultat = document.querySelector(".resultats h2");
const textResultat = document.querySelector(".note");
const aideResultat = document.querySelector(".aide");
const toutesLesQuestions = document.querySelectorAll(".question-block");
let verifTableau = [];

// Écouteur sur la soumission du formulaire
form.addEventListener("submit", (e) => {
    e.preventDefault();
    verifierReponses();
});

// Fonction principale de vérification
function verifierReponses() {
    const tableauResultats = [];
    
    // Récupération des réponses choisies
    for (let i = 1; i <= 5; i++) {
        const reponseChoisie = document.querySelector(`input[name="q${i}"]:checked`);
        tableauResultats.push(reponseChoisie ? reponseChoisie.value : "");
    }
    
    // Vérification des réponses
    verifTableau = [];
    for(let i = 0; i < 5; i++){
        verifTableau.push(tableauResultats[i] === reponses[i]);
    }
    
    afficherResultats(verifTableau);
    couleursFonction(verifTableau);
}

// Affichage des résultats avec note
function afficherResultats(tabCheck) {
    const nbBonnesReponses = tabCheck.filter(el => el).length;
    const nbDeFautes = 5 - nbBonnesReponses;
    
    textResultat.innerText = `${nbBonnesReponses}/5`;
    
    // Messages personnalisés selon le score
    const messages = {
        5: { titre: "🎉 Bravo, c'est un sans faute !", aide: "Parfait !" },
        4: { titre: "👏 Vous y êtes presque !", aide: "Changez la réponse rouge et validez !" },
        3: { titre: "👍 Encore un effort !", aide: "Changez les réponses rouges et validez !" },
        2: { titre: "💪 Il reste du travail", aide: "Changez les réponses rouges et validez !" },
        1: { titre: "😅 Peut mieux faire !", aide: "Changez les réponses rouges et validez !" },
        0: { titre: "😱 Toutes les réponses sont fausses !", aide: "Recommencez !" }
    };
    
    const message = messages[nbBonnesReponses] || { titre: "Erreur", aide: "" };
    titreResultat.innerText = message.titre;
    aideResultat.innerText = message.aide;
}

// Coloration des questions (vert = bon, rouge = faux)
function couleursFonction(tabValBool) {
    toutesLesQuestions.forEach((question, index) => {
        if (tabValBool[index]) {
            question.style.background = 'lightgreen';
            question.style.border = '2px solid #4CAF50';
        } else {
            question.style.background = '#ffb8b8';
            question.style.border = '2px solid #f44336';
            
            // Animation de secousse pour les erreurs
            question.classList.add('shake');
            setTimeout(() => {
                question.classList.remove('shake');
            }, 500);
        }
    });
}

// Reset couleur au clic sur une question
toutesLesQuestions.forEach(question => {
    question.addEventListener('click', () => {
        question.style.background = 'white';
        question.style.border = 'none';
    });
    
    // Reset couleur quand on sélectionne une réponse
    question.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            question.style.background = 'white';
            question.style.border = 'none';
        });
    });
});

// Fonction pour réinitialiser le quiz
function reinitialiserQuiz() {
    // Reset des réponses
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Reset des couleurs et résultats
    toutesLesQuestions.forEach(question => {
        question.style.background = 'white';
        question.style.border = 'none';
    });
    
    titreResultat.innerText = '';
    textResultat.innerText = '';
    aideResultat.innerText = '';
    verifTableau = [];
}

// Ajout d'un bouton reset dans les résultats (optionnel)
const btnReset = document.createElement('button');
btnReset.textContent = 'Refaire le quiz';
btnReset.className = 'btn-reset';
btnReset.style.cssText = `
    margin-top: 20px;
    padding: 10px 20px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
`;
btnReset.addEventListener('click', reinitialiserQuiz);

form.addEventListener('submit', () => {
    // Ajoute le bouton reset après les résultats
    if (!document.querySelector('.btn-reset')) {
        document.querySelector('.resultats').appendChild(btnReset);
    }
});