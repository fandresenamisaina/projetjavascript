// Données des étudiants
let students = [
    {"id":1,"nom":"Andriamatoa","prenom":"Jean","parcours":"Informatique","moyenne":15.2},
    {"id":2,"nom":"Rakoto","prenom":"Mina","parcours":"Mathématiques","moyenne":17.8},
    {"id":3,"nom":"Rasoa","prenom":"Hery","parcours":"Physique","moyenne":12.5},
    {"id":4,"nom":"Rabe","prenom":"Lala","parcours":"Informatique","moyenne":14.0},
    {"id":5,"nom":"Rajaonarivelo","prenom":"Tiana","parcours":"Mathématiques","moyenne":16.3}
];

let sortNomAsc = true;
let sortMoyenneAsc = true;

const tableBody = document.querySelector("#studentsTable tbody");
const searchInput = document.getElementById("searchInput");
const filterParcours = document.getElementById("filterParcours");
const exportBtn = document.getElementById("exportBtn");

// Générer le filtre parcours
function populateFilter() {
    const parcoursSet = new Set(students.map(s => s.parcours));
    parcoursSet.forEach(p => {
        const option = document.createElement("option");
        option.value = p;
        option.textContent = p;
        filterParcours.appendChild(option);
    });
}

// Afficher le tableau
function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach(student => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${student.nom}</td>
            <td>${student.prenom}</td>
            <td>${student.parcours}</td>
            <td>${student.moyenne.toFixed(2)}</td>
        `;
        tableBody.appendChild(tr);
    });
}

// Filtre + recherche
function filterAndRender() {
    const searchText = searchInput.value.toLowerCase();
    const parcours = filterParcours.value;
    const filtered = students.filter(s => 
        s.nom.toLowerCase().includes(searchText) &&
        (parcours === "" || s.parcours === parcours)
    );
    renderTable(filtered);
}

// Initialisation
populateFilter();
renderTable(students);

// Recherche live
searchInput.addEventListener("input", filterAndRender);

// Filtre parcours
filterParcours.addEventListener("change", filterAndRender);

// Tri par nom
document.getElementById("thNom").addEventListener("click", () => {
    students.sort((a,b) => sortNomAsc ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom));
    sortNomAsc = !sortNomAsc;
    filterAndRender();
});

// Tri par moyenne
document.getElementById("thMoyenne").addEventListener("click", () => {
    students.sort((a,b) => sortMoyenneAsc ? a.moyenne - b.moyenne : b.moyenne - a.moyenne);
    sortMoyenneAsc = !sortMoyenneAsc;
    filterAndRender();
});

// téchargement 
exportBtn.addEventListener("click", () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Nom,Prénom,Parcours,Moyenne\n";
    students.forEach(s => {
        csvContent += `${s.nom},${s.prenom},${s.parcours},${s.moyenne}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
