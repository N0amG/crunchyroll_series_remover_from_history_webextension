async function fetchToken() {
    const url = "https://www.crunchyroll.com/auth/v1/token";

    const payload = new URLSearchParams({
        device_id: "51d457b9-d4b2-48b5-aabf-9d99ff7803bd",
        device_type: "Chrome on Windows",
        grant_type: "etp_rt_cookie"
    });

    const headers = {
        "Authorization": "Basic bm9haWhkZXZtXzZpeWcwYThsMHE6", // Encodé en Base64
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Referer": "https://www.crunchyroll.com/fr",
        "Origin": "https://www.crunchyroll.com",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.170 Safari/537.36",
        "Cookie": "device_id=51d457b9-d4b2-48b5-aabf-9d99ff7803bd; session_id=834bc1622b37bdd7d13b6160a6c119b4; etp_rt=6c664510-fd3c-4f97-8d58-a8d99cd6fa93;", // Utilise les cookies nécessaires
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: payload.toString()
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        //console.log("Réponse du serveur :", data);

        // Retourner un objet JSON contenant les données nécessaires
        return {
            access_token: data.access_token,
            account_id: data.account_id,
            profile_id: data.profile_id,
            expires_in: data.expires_in,
            token_type: data.token_type,
            scope: data.scope,
            country: data.country
        };
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
        return null; // Retourner null en cas d'erreur
    }
}

export default fetchToken;