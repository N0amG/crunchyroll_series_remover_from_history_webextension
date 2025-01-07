// Importer les modules nécessaires
import getContentIds from "./api/fetch/get_contentids.js";
import deleteEpisodes from "./api/fetch/delete_episode.js";

// Gérer les messages reçus
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "FETCH_CONTENT_IDS") {
        try {
            const data = await getContentIds(message.payload.title);
            sendResponse({ success: true, data });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }

    if (message.action === "DELETE_EPISODES") {
        try {
            const data = await deleteEpisodes(message.payload.seriesTitle);
            sendResponse({ success: true, data });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }

    return true; // Permet d'attendre une réponse asynchrone
});
