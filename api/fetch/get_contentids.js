import fetchToken from "./get_token.js";

async function getWatchHistoryLength() {
    const tokenData = await fetchToken();
    if (!tokenData?.access_token || !tokenData?.account_id) {
        console.error("Impossible d'obtenir le token ou l'ID de compte.");
        return null;
    }

    const url = `https://www.crunchyroll.com/content/v2/${tokenData.account_id}/watch-history`;
    const params = new URLSearchParams({ page_size: 1, page: 1 });
    const headers = { "Authorization": `Bearer ${tokenData.access_token}` };

    try {
        const response = await fetch(`${url}?${params}`, { headers });
        if (!response.ok) throw new Error(`Erreur : ${response.status}`);
        const data = await response.json();
        return data.total;
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
        return null;
    }
}

async function getWatchHistory(pageSize) {
    const tokenData = await fetchToken();
    if (!tokenData || !tokenData.access_token || !tokenData.account_id) {
        console.error("Impossible d'obtenir le token ou l'ID de compte.");
        return null;
    }

    const url = `https://www.crunchyroll.com/content/v2/${tokenData.account_id}/watch-history`;
    const params = new URLSearchParams({ page_size: pageSize, page: 1 });
    const headers = {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*"
    };

    try {
        const response = await fetch(`${url}?${params.toString()}`, {
            method: "GET",
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des données : ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Historique de visionnage :", data);
        return data;
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
        return null;
    }
}

async function getContentIds(title) {
    const historyLen = await getWatchHistoryLength();
    const watchHistory = await getWatchHistory(historyLen);
    if (!watchHistory || !watchHistory.data) {
        console.error("Erreur lors de la récupération de l'historique de visionnage.");
        return null;
    }

    const contentIds = watchHistory.data
        .filter((item) => item.panel && item.panel.episode_metadata && item.panel.episode_metadata.series_title.toLowerCase() === title.toLowerCase())
        .map((item) => item.id)
        .join(",");

    if (contentIds) {
        console.log("Résultats :", contentIds);
        return contentIds;
    } else {
        console.log("Aucun épisode trouvé pour le titre spécifié.");
        return null;
    }
}

export default getContentIds;