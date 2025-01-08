import fetchToken from "./get_token.js";

async function deleteEpisodes(document, contentIds) {
    try {
        console.log("Document :", document);
        if (!contentIds || contentIds === "") {
            throw new Error("Aucun ID valide fourni pour la suppression.");
        }

        const tokenData = await fetchToken();
        if (!tokenData || !tokenData.access_token || !tokenData.account_id) {
            throw new Error("Token ou account_id manquant");
        }

        const url = `https://www.crunchyroll.com/content/v2/${tokenData.account_id}/watch-history/${contentIds}`;

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${tokenData.access_token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            console.log(`Les épisodes ${contentIds} ont été supprimés avec succès.`);
            // Supprimer les épisodes de la page HTML
            removeEpisodesFromPage(document, contentIds);
        } else {
            console.error(
                `Erreur lors de la suppression : ${response.status} - ${response.statusText}`
            );
        }
    } catch (error) {
        console.error("Erreur réseau ou lors de la suppression :", error);
    }
}

function removeEpisodesFromPage(document, contentIds) {
    console.log("Suppression des épisodes de la page HTML :", contentIds);
    const idsArray = contentIds.split(",");
    idsArray.forEach(id => {
        try {
            const episodeLink = document.querySelector(`a[href*="${id}"]`);
            if (episodeLink) {
                const listItem = episodeLink.closest('[role="listitem"]');
                if (listItem) {
                    listItem.remove();
                    console.log(`Épisode avec ID ${id} supprimé de la page.`);
                } else {
                    console.log(`Élément parent avec la classe 'listitem' non trouvé pour l'ID ${id}.`);
                }
            } else {
                console.log(`Épisode avec ID ${id} non trouvé sur la page.`);
            }
        } catch (error) {
            console.error(`Erreur lors de la suppression de l'épisode avec ID ${id} :`, error);
        }
    });
}

export default deleteEpisodes;