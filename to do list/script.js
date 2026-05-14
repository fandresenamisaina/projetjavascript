const form = document.querySelector('form');
const liste = document.querySelector('.liste');
const input = document.querySelector('#item');

let toutesLesTaches = [];

// Soumission du formulaire
form.addEventListener('submit', event => {
    event.preventDefault();
    
    const text = input.value.trim();
    if (text !== '') {
        rajouterTache(text);
        input.value = '';
        input.focus(); // Remet le focus sur l'input
    }
});

// Ajouter une nouvelle tâche
function rajouterTache(text) {
    const todo = {
        text,
        id: Date.now(),
        complete: false
    };
    
    toutesLesTaches.unshift(todo); // Ajoute en haut de la liste
    sauvegarderTaches();
    afficherListe();
}

// Affichage de toutes les tâches
function afficherListe() {
    // Vider la liste
    liste.innerHTML = '';
    
    // Recréer tous les éléments
    toutesLesTaches.forEach(todo => {
        const item = creerElementTache(todo);
        liste.appendChild(item);
    });
}

// Création d'un élément de tâche
function creerElementTache(todo) {
    const item = document.createElement('li');
    item.setAttribute('data-key', todo.id);
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.complete;
    checkbox.addEventListener('change', () => marquerTacheFaite(todo.id));
    item.appendChild(checkbox);
    
    // Texte de la tâche
    const txt = document.createElement('span');
    txt.contentEditable = true; // Permet d'éditer le texte
    txt.textContent = todo.text;
    txt.addEventListener('blur', (e) => modifierTache(todo.id, e.target.textContent));
    txt.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    });
    item.appendChild(txt);
    
    // Bouton supprimer
    const btnSupprimer = document.createElement('button');
    btnSupprimer.className = 'btn-supprimer';
    btnSupprimer.innerHTML = '✕';
    btnSupprimer.title = 'Supprimer';
    btnSupprimer.addEventListener('click', () => supprimerTache(todo.id));
    item.appendChild(btnSupprimer);
    
    // Appliquer la classe si tâche terminée
    if (todo.complete) {
        item.classList.add('finDeTache');
    }
    
    return item;
}

// Marquer une tâche comme faite/non faite
function marquerTacheFaite(id) {
    const todo = toutesLesTaches.find(t => t.id == id);
    if (todo) {
        todo.complete = !todo.complete;
        sauvegarderTaches();
        afficherListe();
    }
}

// Modifier le texte d'une tâche
function modifierTache(id, nouveauTexte) {
    const todo = toutesLesTaches.find(t => t.id == id);
    if (todo && nouveauTexte.trim() !== '') {
        todo.text = nouveauTexte.trim();
        sauvegarderTaches();
        afficherListe();
    }
}

// Supprimer une tâche
function supprimerTache(id) {
    toutesLesTaches = toutesLesTaches.filter(todo => todo.id != id);
    sauvegarderTaches();
    afficherListe();
}

// Sauvegarder dans localStorage
function sauvegarderTaches() {
    localStorage.setItem('toutesLesTaches', JSON.stringify(toutesLesTaches));
}

// Charger les tâches depuis localStorage
function chargerTaches() {
    const sauvegarde = localStorage.getItem('toutesLesTaches');
    if (sauvegarde) {
        toutesLesTaches = JSON.parse(sauvegarde);
        afficherListe();
    }
}

// Fonctionnalités supplémentaires
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        form.dispatchEvent(new Event('submit'));
    }
});

// Double-clic sur une tâche pour la modifier
liste.addEventListener('dblclick', (e) => {
    if (e.target.tagName === 'SPAN') {
        e.target.focus();
    }
});

// Compteur de tâches
function majCompteur() {
    const terminees = toutesLesTaches.filter(t => t.complete).length;
    const total = toutesLesTaches.length;
    console.log(`${terminees}/${total} tâches terminées`);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    chargerTaches();
    input.focus();
});

// Nettoyage au départ
window.addEventListener('beforeunload', () => {
    sauvegarderTaches();
});