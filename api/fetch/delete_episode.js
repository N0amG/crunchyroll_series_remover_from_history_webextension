import fetchToken from "./get_token.js";

async function deleteLimitedEpisodes(contentIds) {
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

        if (!response.ok) {
            console.error(
                `Erreur lors de la suppression : ${response.status} - ${response.statusText}`
            );
        }
    } catch (error) {
        console.error("Erreur réseau ou lors de la suppression :", error.message);
    }
}

async function deleteEpisodes(contentIds) {
    const idsArray = contentIds.split(",");
    const chunkSize = 300;
    let success = true;

    for (let i = 0; i < idsArray.length; i += chunkSize) {
        const chunk = idsArray.slice(i, i + chunkSize).join(",");
        const result = await deleteLimitedEpisodes(chunk);
        if (!result) {
            success = false;
        }
        console.log(`Suppression de ${i + chunkSize} épisodes sur ${idsArray.length}`);
        await sleep(2000); // Attendre 1 seconde entre chaque suppression
    }

    return success;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default deleteEpisodes;