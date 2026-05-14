const form = document.querySelector('form');
const input = document.getElementById('liste');
const todoList = document.querySelector('.liste');

let toutesLesTaches = JSON.parse(localStorage.getItem('taches')) || [];

// Ajout d'un compteur
const compteur = document.createElement('div');
compteur.className = 'compteur';
compteur.innerHTML = `<strong>0/0 tâches</strong>`;
form.parentNode.insertBefore(compteur, todoList);

// Soumission du formulaire
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const text = input.value.trim();
    if (text === '') {
        input.style.borderColor = '#ff4444';
        setTimeout(() => input.style.borderColor = '', 500);
        return;
    }

    // Créer nouvelle tâche
    const nouvelleTache = {
        id: Date.now(),
        text: text,
        complete: false
    };
    
    toutesLesTaches.unshift(nouvelleTache); // Ajoute en haut
    sauvegarderEtAfficher();
    input.value = '';
    input.focus();
});

// Gestion des clics sur la liste (Event Delegation)
todoList.addEventListener('click', function(e) {
    const target = e.target;
    const li = target.closest('li');
    if (!li) return;
    
    const tacheId = parseInt(li.dataset.id);
    const tache = toutesLesTaches.find(t => t.id === tacheId);
    if (!tache) return;
    
    if (target.classList.contains('btn-complete')) {
        tache.complete = !tache.complete;
        sauvegarderEtAfficher();
    } else if (target.classList.contains('btn-delete')) {
        toutesLesTaches = toutesLesTaches.filter(t => t.id !== tacheId);
        sauvegarderEtAfficher();
    }
});

// Édition du texte (double clic)
todoList.addEventListener('dblclick', function(e) {
    const span = e.target.closest('.tache-texte');
    if (!span || span.contentEditable === 'true') return;
    
    const tacheId = parseInt(span.closest('li').dataset.id);
    const tache = toutesLesTaches.find(t => t.id === tacheId);
    
    span.contentEditable = true;
    span.focus();
    
    // Sauvegarder à la perte de focus
    const sauvegarderEdition = () => {
        const nouveauTexte = span.textContent.trim();
        if (nouveauTexte && nouveauTexte !== tache.text) {
            tache.text = nouveauTexte;
            sauvegarderEtAfficher();
        }
        span.contentEditable = false;
    };
    
    span.addEventListener('blur', sauvegarderEdition, { once: true });
    span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sauvegarderEdition();
        } else if (e.key === 'Escape') {
            span.textContent = tache.text;
            span.contentEditable = false;
        }
    }, { once: true });
});

// Fonction principale : sauvegarde + affichage + compteur
function sauvegarderEtAfficher() {
    localStorage.setItem('taches', JSON.stringify(toutesLesTaches));
    afficherTaches();
    majCompteur();
}

// Affichage de toutes les tâches
function afficherTaches() {
    todoList.innerHTML = '';
    
    toutesLesTaches.forEach(tache => {
        const li = document.createElement('li');
        li.dataset.id = tache.id;
        
        // Checkbox visuelle
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = tache.complete;
        checkbox.disabled = true;
        li.appendChild(checkbox);
        
        // Texte éditable
        const span = document.createElement('span');
        span.className = 'tache-texte';
        span.textContent = tache.text;
        if (tache.complete) span.style.textDecoration = 'line-through';
        li.appendChild(span);
        
        // Boutons
        const btnComplete = document.createElement('button');
        btnComplete.className = 'btn-complete';
        btnComplete.innerHTML = tache.complete ? '↻' : '✔';
        btnComplete.title = tache.complete ? 'Refaire' : 'Terminer';
        li.appendChild(btnComplete);
        
        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn-delete';
        btnDelete.innerHTML = '🗑️';
        btnDelete.title = 'Supprimer';
        li.appendChild(btnDelete);
        
        todoList.appendChild(li);
    });
}

// Mise à jour du compteur
function majCompteur() {
    const terminees = toutesLesTaches.filter(t => t.complete).length;
    const total = toutesLesTaches.length;
    compteur.innerHTML = `<strong>${terminees}/${total} tâches ${total ? `( ${Math.round(terminees/total*100)}% )` : ''}</strong>`;
}

// Fonctionnalités bonus
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') form.dispatchEvent(new Event('submit'));
});

// Trier par priorité (Ctrl+clic sur compteur)
compteur.addEventListener('click', (e) => {
    if (e.ctrlKey) {
        toutesLesTaches.sort((a, b) => {
            const completeA = a.complete ? 1 : 0;
            const completeB = b.complete ? 1 : 0;
            return completeA - completeB;
        });
        sauvegarderEtAfficher();
    }
});

// Nettoyer les tâches terminées (Shift+clic sur compteur)
compteur.addEventListener('click', (e) => {
    if (e.shiftKey) {
        toutesLesTaches = toutesLesTaches.filter(t => !t.complete);
        sauvegarderEtAfficher();
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    afficherTaches();
    majCompteur();
    input.focus();
});

// Sauvegarde automatique avant fermeture
window.addEventListener('beforeunload', sauvegarderEtAfficher);