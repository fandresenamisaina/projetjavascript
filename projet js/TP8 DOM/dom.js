// Ici j'ai identifié les éléments du DOM dans le HTML
const form = document.querySelector('form');
const input = document.getElementById('liste');
const todoList = document.querySelector('.liste');

// Dans cette partie je vais gérer l'ajout des tâches
form.addEventListener('submit', function(e) {
    e.preventDefault(); // empêche le rechargement de la page

    const text = input.value.trim();
    if(text === '') return; // vérifie si le champ est vide, si oui on sort de la fonction

    // Crée un élément li pour la tâche
    const li = document.createElement('li');
    li.textContent = text;

    // Bouton pour marquer la tâche comme complète
    const completeBtn = document.createElement('button');
    completeBtn.textContent = '✔';
    completeBtn.style.marginLeft = '10px';

    // Bouton pour supprimer la tâche si on veut l'enlever
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✖';
    deleteBtn.style.marginLeft = '5px';

    // Ajoute les boutons au li
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);

    // Ajoute le li à la liste
    todoList.appendChild(li);

    // Vide le champ texte après l'ajout
    input.value = '';
});

// Gère les actions sur les tâches (marquer comme complète ou supprimer)
todoList.addEventListener('click', function(e) {
    const target = e.target;
    const li = target.parentElement; // parent = li

    if(target.textContent === '✖') {
        li.remove(); // supprime la tâche
    }
    if(target.textContent === '✔') {
        // Barre ou débarrer la tâche
        li.style.textDecoration = li.style.textDecoration === 'line-through' ? 'none' : 'line-through';
    }
});
