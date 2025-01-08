// Importer les modules nécessaires
import getContentIds from "./api/fetch/get_contentids.js";
import deleteEpisodes from "./api/fetch/delete_episode.js";

// Gérer les messages reçus
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log("Background reçoit un message :", message);
    try {
        if (message.action === "FETCH_CONTENT_IDS") {
            const data = await getContentIds(message.payload.title);
            sendResponse({ success: true, data });
        } else if (message.action === "DELETE_EPISODES") {
            const data = await deleteEpisodes(message.payload.ids);
            sendResponse({ success: true, data });
        } else {
            sendResponse({ success: false, error: "Action inconnue." });
        }
    } catch (error) {
        sendResponse({ success: false, error: error.message });
    }
    return true; // Assure que sendResponse sera utilisé dans les callbacks asynchrones
});
