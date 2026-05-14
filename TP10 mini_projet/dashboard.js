// Données des étudiants (étendues)
let students = [
    {"id":1,"nom":"Andriamatoa","prenom":"Jean","parcours":"Informatique","moyenne":15.2},
    {"id":2,"nom":"Rakoto","prenom":"Mina","parcours":"Mathématiques","moyenne":17.8},
    {"id":3,"nom":"Rasoa","prenom":"Hery","parcours":"Physique","moyenne":12.5},
    {"id":4,"nom":"Rabe","prenom":"Lala","parcours":"Informatique","moyenne":14.0},
    {"id":5,"nom":"Rajaonarivelo","prenom":"Tiana","parcours":"Mathématiques","moyenne":16.3},
    {"id":6,"nom":"Vololona","prenom":"Andry","parcours":"Chimie","moyenne":13.8},
    {"id":7,"nom":"Tsia","prenom":"Rivo","parcours":"Physique","moyenne":18.2},
    {"id":8,"nom":"Manantsoa","prenom":"Lina","parcours":"Informatique","moyenne":11.5}
];

let sortConfig = {
    nom: { asc: true },
    moyenne: { asc: true },
    parcours: { asc: true }
};

const tableBody = document.querySelector("#studentsTable tbody");
const searchInput = document.getElementById("searchInput");
const filterParcours = document.getElementById("filterParcours");
const exportBtn = document.getElementById("exportBtn");
const thNom = document.getElementById("thNom");
const thMoyenne = document.getElementById("thMoyenne");

// Statistiques
const statsDiv = document.createElement('div');
statsDiv.className = 'stats';
statsDiv.innerHTML = `
    <span>Moyenne générale: <strong>--</strong></span>
    <span>Meilleure note: <strong>--</strong></span>
    <span>Plus bas: <strong>--</strong></span>
`;
document.querySelector('.controls').parentNode.insertBefore(statsDiv, document.querySelector('.controls').nextSibling);

// 1. Générer le filtre parcours
function populateFilter() {
    filterParcours.innerHTML = '<option value="">Tous les parcours</option>';
    const parcoursSet = [...new Set(students.map(s => s.parcours))].sort();
    parcoursSet.forEach(p => {
        const option = document.createElement("option");
        option.value = p;
        option.textContent = p;
        filterParcours.appendChild(option);
    });
}

// 2. Rendu du tableau avec animations
function renderTable(data) {
    tableBody.innerHTML = "";
    
    data.forEach((student, index) => {
        const tr = document.createElement("tr");
        tr.dataset.index = index;
        tr.innerHTML = `
            <td class="nom">${escapeHtml(student.nom)}</td>
            <td>${escapeHtml(student.prenom)}</td>
            <td class="parcours">${escapeHtml(student.parcours)}</td>
            <td class="moyenne">${student.moyenne.toFixed(2)} 
                <span class="note-badge ${getNoteColor(student.moyenne)}">
                    ${getNoteLabel(student.moyenne)}
                </span>
            </td>
        `;
        tableBody.appendChild(tr);
    });
    
    // Animation d'apparition
    setTimeout(() => {
        document.querySelectorAll('#studentsTable tbody tr').forEach((tr, i) => {
            tr.style.animationDelay = `${i * 0.05}s`;
            tr.classList.add('fade-in');
        });
    }, 100);
}

// 3. Filtre + recherche + tri
function filterAndSort() {
    const searchText = searchInput.value.toLowerCase().trim();
    const parcoursFilter = filterParcours.value;
    
    let filtered = students.filter(student => 
        (!searchText || 
         student.nom.toLowerCase().includes(searchText) || 
         student.prenom.toLowerCase().includes(searchText)) &&
        (!parcoursFilter || student.parcours === parcoursFilter)
    );
    
    // Appliquer le tri actif
    const activeSort = getActiveSort();
    if (activeSort) {
        filtered.sort((a, b) => {
            let valA = a[activeSort.field];
            let valB = b[activeSort.field];
            
            if (activeSort.field === 'nom') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }
            
            if (sortConfig[activeSort.field].asc) {
                return valA > valB ? 1 : -1;
            } else {
                return valA < valB ? 1 : -1;
            }
        });
    }
    
    renderTable(filtered);
    updateStats(filtered);
}

// 4. Gestion du tri multi-colonnes
function setupSorting() {
    thNom.addEventListener("click", () => toggleSort('nom'));
    thMoyenne.addEventListener("click", () => toggleSort('moyenne'));
    
    // Tri par parcours
    const thParcours = document.querySelector('th:nth-child(3)');
    thParcours.textContent = 'Parcours ↕';
    thParcours.style.cursor = 'pointer';
    thParcours.addEventListener("click", () => toggleSort('parcours'));
}

function toggleSort(field) {
    // Reset autres tris
    Object.keys(sortConfig).forEach(f => {
        if (f !== field) sortConfig[f].asc = true;
    });
    
    // Toggle tri actuel
    sortConfig[field].asc = !sortConfig[field].asc;
    
    // Mettre à jour les icônes
    updateSortIcons();
    filterAndSort();
}

function getActiveSort() {
    for (let field in sortConfig) {
        if (!sortConfig[field].asc === false || true) { // Active sort
            return { field };
        }
    }
    return null;
}

function updateSortIcons() {
    thNom.innerHTML = `Nom ${sortConfig.nom.asc ? '↗' : '↘'}`;
    thMoyenne.innerHTML = `Moyenne ${sortConfig.moyenne.asc ? '↗' : '↘'}`;
    
    const thParcours = document.querySelector('th:nth-child(3)');
    thParcours.innerHTML = `Parcours ${sortConfig.parcours.asc ? '↗' : '↘'}`;
}

// 5. Statistiques
function updateStats(data) {
    if (!data.length) {
        statsDiv.innerHTML = '<span>Aucun étudiant trouvé</span>';
        return;
    }
    
    const moyennes = data.map(s => s.moyenne);
    const moyenne = moyennes.reduce((a,b) => a+b, 0) / moyennes.length;
    const max = Math.max(...moyennes);
    const min = Math.min(...moyennes);
    
    statsDiv.innerHTML = `
        <span>Moyenne générale: <strong>${moyenne.toFixed(1)}</strong></span>
        <span>Meilleure note: <strong>${max.toFixed(1)}</strong></span>
        <span>Plus bas: <strong>${min.toFixed(1)}</strong></span>
    `;
}

// 6. Export CSV amélioré
exportBtn.addEventListener("click", () => {
    const filtered = getFilteredData();
    const csvContent = [
        ['Nom', 'Prénom', 'Parcours', 'Moyenne'],
        ...filtered.map(s => [s.nom, s.prenom, s.parcours, s.moyenne.toFixed(2)])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `etudiants_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
});

// 7. Utilitaires
function getFilteredData() {
    const searchText = searchInput.value.toLowerCase().trim();
    const parcoursFilter = filterParcours.value;
    return students.filter(s => 
        (!searchText || s.nom.toLowerCase().includes(searchText) || s.prenom.toLowerCase().includes(searchText)) &&
        (!parcoursFilter || s.parcours === parcoursFilter)
    );
}

function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function getNoteColor(moyenne) {
    if (moyenne >= 16) return 'excellent';
    if (moyenne >= 14) return 'bon';
    if (moyenne >= 12) return 'passable';
    return 'insuffisant';
}

function getNoteLabel(moyenne) {
    if (moyenne >= 16) return 'A';
    if (moyenne >= 14) return 'B';
    if (moyenne >= 12) return 'C';
    return 'D';
}

// 8. Événements
searchInput.addEventListener("input", debounce(filterAndSort, 300));
filterParcours.addEventListener("change", filterAndSort);

// Debounce pour la recherche
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    populateFilter();
    setupSorting();
    updateSortIcons();
    filterAndSort();
});