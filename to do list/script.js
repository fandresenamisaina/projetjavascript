const form = document.querySelector('form');
const liste = document.querySelector('ul');
const input = document.querySelector('form input');

let toutesLesTaches = [];

form.addEventListener('submit', event => {
    event.preventDefault();

    const text = input.value.trim();
    if (text !== '') {
        rajouterTache(text);
        input.value = '';
    }
})

function rajouterTache(text) {
    const todo = {
        text,
        id: Date.now()
    }
    afficherListe(todo);
}

function afficherListe(todo) {
    const item = document.createElement('li');
    item.setAttribute('data-key', todo.id);

    const checkbox = document.createElement('input'); 
    checkbox.setAttribute('type', 'checkbox');
    checkbox.addEventListener('click', tacheFaite); 
    item.appendChild(checkbox);

    const txt = document.createElement('span');
    txt.innerText = todo.text;
    item.appendChild(txt);

    const btn = document.createElement('button'); 
    btn.addEventListener('click', supprimerTache);
    const img = document.createElement('img');
    img.setAttribute('src', 'fermer.svg');
    btn.appendChild(img);
    item.appendChild(btn);

    liste.appendChild(item);
    toutesLesTaches.push(item);
}

function tacheFaite(e) {
    e.target.parentNode.classList.toggle('finDeTache');
}

function supprimerTache(e) {
    toutesLesTaches.forEach(el => {
        if (e.target.parentNode.getAttribute('data-key') ===
            el.getAttribute('data-key')) { 
            el.remove();
            toutesLesTaches = toutesLesTaches.filter(li =>
                li.dataset.key !== el.dataset.key
            );
        }
    })
}
