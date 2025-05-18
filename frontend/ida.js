document.addEventListener('DOMContentLoaded', async function () {
    const sallesList = document.getElementById('salles-list');
    const salleSelect = document.getElementById('salle');
    const searchSalleInput = document.getElementById('search-salle');
    const coursForm = document.getElementById('cours-form');
    const emploiDuTempsTable = document.getElementById('emploi-du-temps-table');
    const tbody = emploiDuTempsTable.getElementsByTagName('tbody')[0];
    const telechargerPdfBtn = document.getElementById('telecharger-pdf');
    const filiereSelect = document.getElementById('filiere');
    const nouvelleFiliereInput = document.getElementById('nouvelle-filiere');
    const ajouterFiliereBtn = document.getElementById('ajouter-filiere');
    const afficherTousBtn = document.getElementById('afficher-tous');
    const nouvelleSalleInput = document.getElementById('nouvelle-salle');
    const ajouterSalleBtn = document.getElementById('ajouter-salle');

    // Fonction pour afficher les salles
    function afficherSalles(salles) {
        sallesList.innerHTML = '';
        salleSelect.innerHTML = '<option value="">Sélectionnez une salle</option>';
        
        salles.forEach(salle => {
            // Ajouter à la liste des salles
            const salleDiv = document.createElement('div');
            salleDiv.className = 'salle highlight-hover';
            salleDiv.textContent = salle.nom;
            salleDiv.dataset.id = salle.id;
            
            // Ajouter l'événement de clic
            salleDiv.addEventListener('click', () => {
                // Retirer la sélection précédente
                document.querySelectorAll('.salle').forEach(s => s.classList.remove('selected'));
                // Ajouter la sélection
                salleDiv.classList.add('selected');
                // Mettre à jour le select
                salleSelect.value = salle.id;
            });
            
            sallesList.appendChild(salleDiv);

            // Ajouter au select
            const option = document.createElement('option');
            option.value = salle.id;
            option.textContent = salle.nom;
            salleSelect.appendChild(option);
        });
    }

    // Gérer la sélection dans le select
    salleSelect.addEventListener('change', function() {
        const selectedId = this.value;
        document.querySelectorAll('.salle').forEach(salleDiv => {
            if (salleDiv.dataset.id === selectedId) {
                salleDiv.classList.add('selected');
                salleDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                salleDiv.classList.remove('selected');
            }
        });
    });

    // Charger les données initiales
    try {
        // Charger les filières
        const filieres = await getFilieres();
        filieres.forEach(filiere => {
            const option = document.createElement('option');
            option.value = filiere.id;
            option.textContent = filiere.nom;
            filiereSelect.appendChild(option);
        });

        // Charger les salles
        const salles = await getSalles();
        afficherSalles(salles);

        // Charger tous les cours
        await afficherEmploiDuTemps();
    } catch (error) {
        showNotification(error.message, 'error');
    }

    // Gérer la recherche de salles
    searchSalleInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const salles = Array.from(sallesList.children);
        
        salles.forEach(salleDiv => {
            const salleName = salleDiv.textContent.toLowerCase();
            salleDiv.style.display = salleName.includes(searchTerm) ? 'block' : 'none';
        });
    });

    // Gérer l'ajout d'une nouvelle filière
    ajouterFiliereBtn.addEventListener('click', async function () {
        const nouvelleFiliere = nouvelleFiliereInput.value.trim();
        if (nouvelleFiliere) {
            try {
                const filiere = await ajouterFiliere(nouvelleFiliere);
                const option = document.createElement('option');
                option.value = filiere.id;
                option.textContent = filiere.nom;
                filiereSelect.appendChild(option);
                nouvelleFiliereInput.value = '';
                showNotification('Filière ajoutée avec succès', 'success');
            } catch (error) {
                showNotification(error.message, 'error');
            }
        }
    });

    // Gérer l'ajout d'une nouvelle salle
    ajouterSalleBtn.addEventListener('click', async function () {
        const nouvelleSalle = nouvelleSalleInput.value.trim();
        if (nouvelleSalle) {
            try {
                const salle = await ajouterSalle(nouvelleSalle);
                
                // Ajouter à la liste des salles
                const salleDiv = document.createElement('div');
                salleDiv.className = 'salle highlight-hover';
                salleDiv.textContent = salle.nom;
                sallesList.appendChild(salleDiv);

                // Ajouter au select
                const option = document.createElement('option');
                option.value = salle.id;
                option.textContent = salle.nom;
                salleSelect.appendChild(option);

                nouvelleSalleInput.value = '';
                showNotification('Salle ajoutée avec succès', 'success');
            } catch (error) {
                showNotification(error.message, 'error');
            }
        }
    });

    // Gérer l'ajout d'un cours
    coursForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Validation des champs
        const filiereId = parseInt(filiereSelect.value);
        const salleId = parseInt(salleSelect.value);
        const nom = document.getElementById('cours').value.trim();
        const professeur = document.getElementById('professeur').value.trim();
        const jour = document.getElementById('jour').value;
        const heureDebut = document.getElementById('heure-debut').value;
        const heureFin = document.getElementById('heure-fin').value;

        console.log('Valeurs des champs:', {
            filiereId,
            salleId,
            nom,
            professeur,
            jour,
            heureDebut,
            heureFin
        });

        // Vérification que tous les champs sont remplis
        if (!filiereId || !salleId || !nom || !professeur || !jour || !heureDebut || !heureFin) {
            showNotification('Veuillez remplir tous les champs', 'error');
            return;
        }

        // Convertir les heures en format TimeSpan (HH:mm:ss)
        const heureDebutTimeSpan = heureDebut + ':00';
        const heureFinTimeSpan = heureFin + ':00';

        const nouveauCours = {
            FiliereId: filiereId,
            SalleId: salleId,
            Nom: nom,
            Professeur: professeur,
            Jour: jour,
            HeureDebut: heureDebutTimeSpan,
            HeureFin: heureFinTimeSpan
        };

        console.log('Tentative d\'ajout du cours:', nouveauCours);
        console.log('JSON envoyé:', JSON.stringify(nouveauCours));

        try {
            const response = await fetch(`${API_BASE_URL}/cours`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nouveauCours),
            });

            console.log('Statut de la réponse:', response.status);
            const responseText = await response.text();
            console.log('Réponse du serveur:', responseText);

            if (!response.ok) {
                throw new Error(responseText || 'Erreur lors de l\'ajout du cours');
            }

            coursForm.reset();
            await afficherEmploiDuTemps();
            showNotification('Cours ajouté avec succès', 'success');
        } catch (error) {
            console.error('Erreur complète:', error);
            showNotification(error.message, 'error');
        }
    });

    // Gérer la suppression d'un cours
    window.supprimerCours = async function (button, coursId) {
        try {
            await supprimerCours(coursId);
            await afficherEmploiDuTemps();
            showNotification('Cours supprimé avec succès', 'success');
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    // Gérer le téléchargement du PDF
    telechargerPdfBtn.addEventListener('click', async function () {
        try {
            const cours = await getCours();
            console.log('Cours pour PDF:', cours);

            // Charger toutes les filières et salles
            const filieres = await getFilieres();
            const salles = await getSalles();

            // Créer des maps pour un accès rapide
            const filieresMap = new Map(filieres.map(f => [f.id, f]));
            const sallesMap = new Map(salles.map(s => [s.id, s]));

            // Initialiser jsPDF
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Titre du document
            doc.setFontSize(18);
            doc.text("Emploi du Temps", 10, 20);

            // Préparer les données pour le tableau
            const data = cours.map(c => {
                const filiere = filieresMap.get(c.filiereId);
                const salle = sallesMap.get(c.salleId);
                return [
                    filiere ? filiere.nom : 'N/A',
                    salle ? salle.nom : 'N/A',
                    c.nom,
                    c.professeur,
                    c.jour,
                    c.heureDebut.substring(0, 5),
                    c.heureFin.substring(0, 5)
                ];
            });

            // Générer le tableau dans le PDF
            doc.autoTable({
                startY: 30,
                head: [["Filière", "Salle", "Cours", "Professeur", "Jour", "Début", "Fin"]],
                body: data,
                theme: 'grid',
                styles: {
                    fontSize: 8,
                    cellPadding: 2
                },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontSize: 9,
                    fontStyle: 'bold'
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245]
                }
            });

            // Télécharger le PDF
            doc.save('emploi_du_temps.pdf');
            showNotification('PDF téléchargé avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            showNotification('Erreur lors de la génération du PDF: ' + error.message, 'error');
        }
    });

    // Afficher tous les cours
    afficherTousBtn.addEventListener('click', async function () {
        await afficherEmploiDuTemps();
    });

    // Afficher l'emploi du temps
    async function afficherEmploiDuTemps(filiereId = null) {
        try {
            tbody.innerHTML = '';
            const cours = filiereId ? await getCoursByFiliere(filiereId) : await getCours();
            console.log('Cours reçus:', cours);

            if (!cours || cours.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td colspan="8" style="text-align: center;">Aucun cours disponible.</td>
                `;
                tbody.appendChild(row);
                return;
            }

            // Charger toutes les filières et salles
            const filieres = await getFilieres();
            const salles = await getSalles();

            // Créer des maps pour un accès rapide
            const filieresMap = new Map(filieres.map(f => [f.id, f]));
            const sallesMap = new Map(salles.map(s => [s.id, s]));

            cours.forEach(cours => {
                const row = document.createElement('tr');
                const heureDebut = cours.heureDebut.substring(0, 5); // Garder seulement HH:mm
                const heureFin = cours.heureFin.substring(0, 5); // Garder seulement HH:mm

                // Récupérer la filière et la salle correspondantes
                const filiere = filieresMap.get(cours.filiereId);
                const salle = sallesMap.get(cours.salleId);

                row.innerHTML = `
                    <td>${filiere ? filiere.nom : 'N/A'}</td>
                    <td>${salle ? salle.nom : 'N/A'}</td>
                    <td>${cours.nom}</td>
                    <td>${cours.professeur}</td>
                    <td>${cours.jour}</td>
                    <td>${heureDebut}</td>
                    <td>${heureFin}</td>
                    <td class="actions">
                        <button onclick="supprimerCours(this, ${cours.id})" class="btn-danger">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Erreur lors de l\'affichage des cours:', error);
            showNotification(error.message, 'error');
        }
    }

    // Système de notification
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        
        notificationMessage.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 500);
        }, 3000);
    }

    // Système de thèmes
    const themeOptions = document.querySelectorAll('.theme-option');
    const body = document.body;

    // Charger le thème sauvegardé
    const savedTheme = localStorage.getItem('selectedTheme') || 'default';
    body.setAttribute('data-theme', savedTheme);
    themeOptions.forEach(option => {
        if (option.getAttribute('data-theme') === savedTheme) {
            option.classList.add('active');
        }
    });

    // Gérer le changement de thème
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            body.setAttribute('data-theme', theme);
            
            // Sauvegarder le thème
            localStorage.setItem('selectedTheme', theme);
            
            // Mettre à jour l'état actif
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Garder le reste du code pour les animations et effets visuels
    // ... existing code ...

    // Initialiser toutes les fonctionnalités
    createParticles();
    initParallaxEffect();
    addShineEffect();
    animateInputs();
    animateTable();
    addRippleEffect();
});

// Création des particules
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.opacity = Math.random();
        particlesContainer.appendChild(particle);
    }
}

// Effet de parallaxe sur le mouvement de la souris
function initParallaxEffect() {
    document.addEventListener('mousemove', (e) => {
        const sections = document.querySelectorAll('section');
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        sections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const moveX = (centerX - e.clientX) / 50;
            const moveY = (centerY - e.clientY) / 50;

            section.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        });
    });
}

// Effet de brillance au survol
function addShineEffect() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            button.style.setProperty('--shine-x', `${x}px`);
            button.style.setProperty('--shine-y', `${y}px`);
        });
    });
}

// Animation des inputs
function animateInputs() {
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
            input.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
            input.style.transform = 'scale(1)';
        });
    });
}

// Animation du tableau
function animateTable() {
    const rows = document.querySelectorAll('#emploi-du-temps-table tbody tr');
    rows.forEach((row, index) => {
        row.style.animation = `slideIn 0.5s ease-out ${index * 0.1}s forwards`;
        row.style.opacity = '0';
        
        row.addEventListener('mouseenter', () => {
            row.style.transform = 'scale(1.02)';
            row.style.background = 'rgba(255, 255, 255, 0.1)';
        });

        row.addEventListener('mouseleave', () => {
            row.style.transform = 'scale(1)';
            row.style.background = 'transparent';
        });
    });
}

// Effet de vague sur les boutons
function addRippleEffect() {
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            this.appendChild(ripple);

            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            setTimeout(() => ripple.remove(), 1000);
        });
    });
}
