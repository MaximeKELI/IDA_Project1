document.addEventListener('DOMContentLoaded', function () {
    const salles = ['Salle A', 'Salle B', 'Salle C', 'Salle D'];
    const sallesList = document.getElementById('salles-list');
    const salleSelect = document.getElementById('salle');
    const coursForm = document.getElementById('cours-form');
    const emploiDuTempsTable = document.getElementById('emploi-du-temps-table');
    const tbody = emploiDuTempsTable.getElementsByTagName('tbody')[0];
    const telechargerPdfBtn = document.getElementById('telecharger-pdf');
    const filiereSelect = document.getElementById('filiere');
    const nouvelleFiliereInput = document.getElementById('nouvelle-filiere');
    const ajouterFiliereBtn = document.getElementById('ajouter-filiere');
    const afficherTousBtn = document.getElementById('afficher-tous');

    // Données par filière
    let emploiDuTempsParFiliere = {};

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

    // Gérer l'ajout d'une nouvelle filière
    ajouterFiliereBtn.addEventListener('click', function () {
        const nouvelleFiliere = nouvelleFiliereInput.value.trim();
        if (nouvelleFiliere && !emploiDuTempsParFiliere[nouvelleFiliere]) {
            emploiDuTempsParFiliere[nouvelleFiliere] = [];
            const option = document.createElement('option');
            option.value = nouvelleFiliere;
            option.textContent = nouvelleFiliere;
            filiereSelect.appendChild(option);
            nouvelleFiliereInput.value = ''; // Vider le champ
        } else {
            alert("Cette filière existe déjà ou le nom est invalide.");
        }
    });

    // Gérer l'ajout d'un cours
    coursForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const filiere = filiereSelect.value;
        const salle = salleSelect.value;
        const cours = document.getElementById('cours').value;
        const professeur = document.getElementById('professeur').value;
        const jour = document.getElementById('jour').value;
        const heureDebut = document.getElementById('heure-debut').value;
        const heureFin = document.getElementById('heure-fin').value;

        // Vérifier si la filière existe dans l'objet
        if (!emploiDuTempsParFiliere[filiere]) {
            emploiDuTempsParFiliere[filiere] = []; // Créer un tableau vide pour la filière
        }

        // Créer un nouvel objet cours
        const nouveauCours = {
            filiere,
            salle,
            cours,
            professeur,
            jour,
            heureDebut,
            heureFin,
        };

        // Ajouter le cours à la filière sélectionnée
        emploiDuTempsParFiliere[filiere].push(nouveauCours);

        // Mettre à jour l'affichage en ajoutant uniquement le nouveau cours
        afficherEmploiDuTemps(filiere, nouveauCours);
        coursForm.reset();
    });

    // Gérer la suppression d'un cours
    window.supprimerCours = function (button, filiere) {
        const row = button.closest('tr');
        const index = row.rowIndex - 1; // Ignorer la ligne d'en-tête
        emploiDuTempsParFiliere[filiere].splice(index, 1);

        // Mettre à jour l'affichage complet après suppression
        afficherEmploiDuTemps(filiere);
    };

    // Gérer le téléchargement du PDF
    telechargerPdfBtn.addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Titre du document
        doc.setFontSize(18);
        doc.text("Emploi du Temps", 10, 10);

        // En-têtes du tableau
        const headers = ["Filière", "Salle", "Cours", "Professeur", "Jour", "Heure de début", "Heure de fin"];
        let data = [];
        data.push(headers);

        // Parcourir toutes les filières
        for (const filiere in emploiDuTempsParFiliere) {
            if (emploiDuTempsParFiliere[filiere].length > 0) {
                emploiDuTempsParFiliere[filiere].forEach(cours => {
                    data.push([cours.filiere, cours.salle, cours.cours, cours.professeur, cours.jour, cours.heureDebut, cours.heureFin]);
                });
            }
        }

        // Générer le tableau dans le PDF
        doc.autoTable({
            startY: 20,
            head: [headers],
            body: data.slice(1),
        });

        // Télécharger le PDF
        doc.save(`emploi_du_temps.pdf`);
    });

    // Afficher tous les cours
    afficherTousBtn.addEventListener('click', function () {
        afficherEmploiDuTemps();
    });

    // Afficher l'emploi du temps pour la filière sélectionnée
    function afficherEmploiDuTemps(filiere = null, nouveauCours = null) {
        tbody.innerHTML = ''; // Vider le contenu actuel du tbody

        let hasData = false;

        // Parcourir toutes les filières
        for (const f in emploiDuTempsParFiliere) {
            if (filiere && f !== filiere) continue; // Filtrer par filière si spécifiée

            if (emploiDuTempsParFiliere[f].length > 0) {
                hasData = true;
                emploiDuTempsParFiliere[f].forEach((cours, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${cours.filiere}</td>
                        <td>${cours.salle}</td>
                        <td>${cours.cours}</td>
                        <td>${cours.professeur}</td>
                        <td>${cours.jour}</td>
                        <td>${cours.heureDebut}</td>
                        <td>${cours.heureFin}</td>
                        <td class="actions">
                            <button onclick="supprimerCours(this, '${f}')">Supprimer</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            }
        }

        // Afficher un message si aucune donnée n'est disponible
        if (!hasData) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="8" style="text-align: center;">Aucun cours disponible.</td>
            `;
            tbody.appendChild(row);
        }
    }

    // Afficher l'emploi du temps initial (vide)
    afficherEmploiDuTemps();
});