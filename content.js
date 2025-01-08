let intervalId;
let searchedTitle;

// Ajouter une barre de saisie à la page
function ajouterBarreDeSaisie() {
    if (document.getElementById('barreDeSaisie')) return; // Vérifier si la barre de saisie existe déjà
    const barreDeSaisie = document.createElement('input');
    barreDeSaisie.id = 'barreDeSaisie';
    barreDeSaisie.type = 'text';
    barreDeSaisie.placeholder = 'Supprimer une série';
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

    // Insérer la barre de saisie juste avant le bouton "clear-history-button"
    if (clearHistoryButton) {
        clearHistoryButton.parentNode.insertBefore(barreDeSaisie, clearHistoryButton);
    }

    barreDeSaisie.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const searchedTitle = barreDeSaisie.value.toLowerCase();
            barreDeSaisie.value = ""; // Vider la barre de recherche

            // Envoyer un message pour récupérer les contentIds
            chrome.runtime.sendMessage(
                { action: "FETCH_CONTENT_IDS", payload: { title: searchedTitle } },
                (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Erreur de runtime:", chrome.runtime.lastError.message);
                        return;
                    }

                    console.log("Réponse de l'arrière-plan :", response);

                    if (response && response.success) {
                        const contentIds = response.data;
                        if (!contentIds || contentIds === "") { 
                            console.log("Aucun ID de contenu trouvé pour le titre spécifié.");
                            return;
                        }
                        // Envoyer un message pour supprimer les épisodes
                        chrome.runtime.sendMessage(
                            { action: "DELETE_EPISODES", payload: { document : document, ids: contentIds } },
                            (deleteResponse) => {
                                if (chrome.runtime.lastError) {
                                    console.error("Erreur de runtime:", chrome.runtime.lastError.message);
                                    return;
                                }

                                console.log("Réponse de suppression :", deleteResponse);

                                if (deleteResponse && deleteResponse.success) {
                                    console.log("Épisodes supprimés avec succès.");
                                } else {
                                    console.log("Erreur lors de la suppression :", deleteResponse.error);
                                }
                            }
                        );
                    } else {
                        console.log("Erreur lors de la récupération des contentIds :", response.error);
                    }
                }
            );
        }
    });
}

let currentUrl = window.location.href;

function checkAndAddBarreDeSaisie() {
    const clearHistoryButton = document.getElementsByClassName('clear-history-button')[0];
    if (clearHistoryButton) {
        ajouterBarreDeSaisie();
    } else {
        const observer = new MutationObserver(function () {
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
const urlObserver = new MutationObserver(function () {
    if ((currentUrl !== window.location.href)) {
        currentUrl = window.location.href;
        if (currentUrl.includes('history') && !currentUrl.includes('crunchylists') && !currentUrl.includes('watchlist'))
            checkAndAddBarreDeSaisie();
    }
});

urlObserver.observe(document.body, { childList: true, subtree: true });

if (currentUrl.includes('history'))
    checkAndAddBarreDeSaisie();

console.log('Crunchyroll Series Remover From History: Script loaded.');
