// Importer les modules nécessaires
import getContentIds from "./api/fetch/get_contentids.js";
import deleteEpisodes from "./api/fetch/delete_episode.js";

// Gérer les messages reçus
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message reçu par le background :", message);

    (async () => {
        try {
            if (message.action === "FETCH_CONTENT_IDS") {
                const data = await getContentIds(message.payload.title);
                sendResponse({ success: true, data });
            } else if (message.action === "DELETE_EPISODES") {
                const result = await deleteEpisodes(message.payload.ids);
                sendResponse({ success: true, data: result });
            } else {
                sendResponse({ success: false, error: "Action inconnue" });
            }
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    })();

    return true; // Indique que la réponse sera envoyée de manière asynchrone
});