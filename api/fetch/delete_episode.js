import fetchToken from "./get_token.js";

async function deleteEpisodes(contentIds) {
    try {
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
        } else {
            console.error(
                `Erreur lors de la suppression : ${response.status} - ${response.statusText}`
            );
        }
    } catch (error) {
        console.error("Erreur réseau ou lors de la suppression :", error.message);
    }
}

export default deleteEpisodes;