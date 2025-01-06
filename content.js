
let intervalId;
let searchedTitle;

// Ajouter une barre de saisie à la page
function ajouterBarreDeSaisie() {
    console.log('Ajout de la barre de saisie.');
    const barreDeSaisie = document.createElement('input');
    barreDeSaisie.type = 'text';
    barreDeSaisie.placeholder = 'Supprimé une série';
    barreDeSaisie.style.padding = '10px';
    barreDeSaisie.style.fontSize = '16px';

    // Styles supplémentaires pour correspondre au style de Crunchyroll
    barreDeSaisie.style.border = '1px solid #e5e5e5';
    barreDeSaisie.style.borderRadius = '4px';
    barreDeSaisie.style.backgroundColor = '#f8f8f8';
    barreDeSaisie.style.color = '#333';
    barreDeSaisie.style.margin = '10px 0';
    barreDeSaisie.style.width = 'calc(30% - 20px)'; // Ajuster la largeur pour s'adapter à la marge
    barreDeSaisie.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    barreDeSaisie.style.outline = 'none';
    barreDeSaisie.style.transition = 'border-color 0.3s, box-shadow 0.3s';

    // Ajouter un effet de focus
    barreDeSaisie.addEventListener('focus', function () {
        barreDeSaisie.style.borderColor = '#ff6600';
        barreDeSaisie.style.boxShadow = '0 0 5px rgba(255, 102, 0, 0.5)';
    });

    barreDeSaisie.addEventListener('blur', function () {
        barreDeSaisie.style.borderColor = '#e5e5e5';
        barreDeSaisie.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    });

    // Trouver le bouton "clear-history-button"
    const clearHistoryButton = document.getElementsByClassName('clear-history-button')[0];
    console.log("Bouton trouvé: ", clearHistoryButton);

    // Insérer la barre de saisie juste avant le bouton "clear-history-button"
    if (clearHistoryButton) {
        clearHistoryButton.parentNode.insertBefore(barreDeSaisie, clearHistoryButton);
    }

    barreDeSaisie.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            console.log('Entrée détectée dans la barre de saisie.');
            searchedTitle = barreDeSaisie.value.toLowerCase();
            barreDeSaisie.value = ''; // Vider la barre de recherche
            if (intervalId) {
                clearInterval(intervalId); // Arrêter l'intervalle précédent
            }
            intervalId = setInterval(relancerScript, 20); // Relancer le script toutes les 0.02 secondes
        }
    });
}

// Fonction pour faire défiler la page
function scrollPage(noCardsFound = false) {
    if (noCardsFound)
        window.scrollBy(0, window.innerHeight); // Faire défiler d'une hauteur de fenêtre entière
}

// Fonction principale pour supprimer les cartes
function supprimerHistorique() {
    console.log('Suppression de l\'historique.');
    // Sélectionner tous les conteneurs "history-playable-card"
    const cards = document.querySelectorAll('div[class^="history-playable-card"]');

    // Trouver la première carte qui correspond au titre recherché
    const cardToDelete = Array.from(cards).find(card => {
        const titleElement = card.querySelector('[class*="show-title"]');
        return titleElement && titleElement.textContent.toLowerCase() === searchedTitle;
    });

    // Fonction pour supprimer une carte
    function supprimerCarte(card) {
        const trashIcons = card.querySelectorAll('[class*="trash-icon"]'); // Trouver toutes les icônes de la corbeille
        if (trashIcons.length > 0) {
            // Créer un événement de clic
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });

            // Fonction pour vérifier la suppression
            function verifierSuppression() {
                let allRemoved = true;
                for (const trashIcon of trashIcons) {
                    trashIcon.dispatchEvent(clickEvent);
                    if (document.body.contains(card)) {
                        allRemoved = false;
                    }
                }
                if (!allRemoved) {
                    setTimeout(verifierSuppression, 100); // Réessayer après un délai
                }
            }

            verifierSuppression();
        }
    }

    // Supprimer la carte trouvée
    if (cardToDelete) {
        supprimerCarte(cardToDelete);
    }
    else
        scrollPage(true);

    // Vérifier si la page est en bas
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        if (!cardToDelete) {
            console.log('Arrêt du script.');
            clearInterval(intervalId); // Arrêter le script
        }
    }
}

// Fonction pour relancer le script régulièrement
function relancerScript() {
    supprimerHistorique();
    const cards = document.querySelectorAll('div[class^="history-playable-card"]');
    const cardToDelete = Array.from(cards).find(card => {
        const titleElement = card.querySelector('[class*="show-title"]');
        return titleElement && titleElement.textContent.toLowerCase().includes(searchedTitle);
    });
    scrollPage(!cardToDelete);
}

let currentUrl = window.location.href;

function checkAndAddBarreDeSaisie() {
    const clearHistoryButton = document.getElementsByClassName('clear-history-button')[0];
    if (clearHistoryButton) {
        ajouterBarreDeSaisie();
    } else {
        const observer = new MutationObserver(function() {
            const clearHistoryButton = document.getElementsByClassName('clear-history-button')[0];
            if (clearHistoryButton) {
                ajouterBarreDeSaisie();
                observer.disconnect(); // Déconnecter l'observateur après avoir trouvé l'élément
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
}



// Observer les changements dans l'URL
const urlObserver = new MutationObserver(function() {
    if ((currentUrl !== window.location.href)) {
        currentUrl = window.location.href;
        console.log('URL changée ou page rechargée:', currentUrl);
        if (currentUrl.includes('history') && !currentUrl.includes('crunchylists') && !currentUrl.includes('watchlist'))
            checkAndAddBarreDeSaisie();
    }
});

urlObserver.observe(document.body, { childList: true, subtree: true });

if (currentUrl.includes('history'))
    checkAndAddBarreDeSaisie();

console.log('Crunchyroll Series Remover From History: Script loaded.');
