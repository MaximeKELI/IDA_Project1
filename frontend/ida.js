document.addEventListener('DOMContentLoaded', function () {
    const salles = ['Salle A', 'Salle B', 'Salle C', 'Salle D'];
    const sallesList = document.getElementById('salles-list');
    const salleSelect = document.getElementById('salle');
    const coursForm = document.getElementById('cours-form');
    const emploiDuTempsTable = document.getElementById('emploi-du-temps-table').getElementsByTagName('tbody')[0];
    const telechargerPdfBtn = document.getElementById('telecharger-pdf');

    // Afficher les salles
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

    // Gérer l'ajout d'un cours
    coursForm.addEventListener('submit', function (event) {
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

    // Gérer la suppression d'un cours
    window.supprimerCours = function (button) {
        const row = button.closest('tr');
        row.remove();
    };

    // Gérer le téléchargement du PDF
    telechargerPdfBtn.addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Titre du document
        doc.setFontSize(18);
        doc.text("Emploi du Temps", 10, 10);

        // En-têtes du tableau
        const headers = ["Salle", "Cours", "Professeur", "Jour", "Heure de début", "Heure de fin"];
        let data = [];
        data.push(headers);

        // Récupérer les données du tableau
        const rows = emploiDuTempsTable.querySelectorAll('tr');
        rows.forEach(row => {
            const rowData = [];
            row.querySelectorAll('td').forEach(cell => {
                rowData.push(cell.textContent);
            });
            data.push(rowData);
        });

        // Générer le tableau dans le PDF
        doc.autoTable({
            startY: 20,
            head: [headers],
            body: data.slice(1), // Exclure les en-têtes du corps
        });

        // Télécharger le PDF
        doc.save('emploi_du_temps.pdf');
    });
});