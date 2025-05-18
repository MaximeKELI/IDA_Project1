const API_BASE_URL = 'http://localhost:5114/api';

// Fonctions pour les filières
async function getFilieres() {
    const response = await fetch(`${API_BASE_URL}/filieres`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des filières');
    return response.json();
}

async function ajouterFiliere(nom) {
    const response = await fetch(`${API_BASE_URL}/filieres`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom }),
    });
    if (!response.ok) throw new Error('Erreur lors de l\'ajout de la filière');
    return response.json();
}

// Fonctions pour les salles
async function getSalles() {
    const response = await fetch(`${API_BASE_URL}/salles`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des salles');
    return response.json();
}

async function ajouterSalle(nom) {
    const response = await fetch(`${API_BASE_URL}/salles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom }),
    });
    if (!response.ok) throw new Error('Erreur lors de l\'ajout de la salle');
    return response.json();
}

// Fonctions pour les cours
async function getCours() {
    const response = await fetch(`${API_BASE_URL}/cours`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des cours');
    return response.json();
}

async function getCoursByFiliere(filiereId) {
    const response = await fetch(`${API_BASE_URL}/cours/filiere/${filiereId}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des cours de la filière');
    return response.json();
}

async function ajouterCours(cours) {
    const response = await fetch(`${API_BASE_URL}/cours`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cours),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Erreur lors de l\'ajout du cours');
    }
    return response.json();
}

async function supprimerCours(id) {
    const response = await fetch(`${API_BASE_URL}/cours/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression du cours');
} 