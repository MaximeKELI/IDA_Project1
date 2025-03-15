document.addEventListener('DOMContentLoaded', function() {
    const salles = ['Salle A', 'Salle B', 'Salle C', 'Salle D'];
    const sallesList = document.getElementById('salles-list');
    const salleSelect = document.getElementById('salle');
    const coursForm = document.getElementById('cours-form');
    const emploiDuTempsTable = document.getElementById('emploi-du-temps-table').getElementsByTagName('tbody')[0];

    salles.forEach(salle => {
        const salleDiv = document.createElement('div');
        salleDiv.className = 'salle';
        salleDiv.textContent = salle;
        sallesList.appendChild(salleDiv);

        const option = document.createElement('option');
        option.value = salle;
        option.textContent = salle;
        salleSelect.appendChild(option);
    });

    coursForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const salle = salleSelect.value;
        const cours = document.getElementById('cours').value;
        const professeur = document.getElementById('professeur').value;
        const jour = document.getElementById('jour').value;
        const heureDebut = document.getElementById('heure-debut').value;
        const heureFin = document.getElementById('heure-fin').value;

        const newRow = emploiDuTempsTable.insertRow();
        newRow.innerHTML = `
            <td>${salle}</td>
            <td>${cours}</td>
            <td>${professeur}</td>
            <td>${jour}</td>
            <td>${heureDebut}</td>
            <td>${heureFin}</td>
            <td class="actions">
                <button onclick="supprimerCours(this)">Supprimer</button>
            </td>
        `;

        coursForm.reset();
    });

    window.supprimerCours = function(button) {
        const row = button.closest('tr');
        row.remove();
    };
});