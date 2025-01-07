import fetchToken from "./get_token.js";

async function deleteEpisodes(contentIds) {
    //contentIds : lsit de string des épisodes à supprimer sous la forme 'ID,ID,...' dans l'url
    try {
        const accessToken = await fetchToken();


        if (!accessToken || !accessToken.access_token || !accessToken.account_id) {
            throw new Error("Token ou account_id manquant");
        }

        // URL de la requête DELETE
        const url = `https://www.crunchyroll.com/content/v2/${accessToken.account_id}/watch-history/${contentIds}`;

        // Faire la requête DELETE
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken.access_token}`, // Token d'authentification
                "Content-Type": "application/json" // Type des données (JSON)
            }
        });

        if (response.ok) {
            console.log(`Les épisodes ${contentIds} a été supprimé avec succès.`);
        } else {
            console.error("Erreur lors de la suppression :", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Erreur réseau ou lors de la récupération du token :", error);
    }
}

export default deleteEpisodes;