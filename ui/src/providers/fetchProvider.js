import { useState, useEffect } from 'react';
import { msalInstance } from "./authProvider";

export const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            let headers = {};
            const token = await currentAccessToken();
            if (token && token.length > 0) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            fetch(url, { headers: headers })
                .then((response) => response.json())
                .then((result) => {
                    setData(result);
                    setLoading(false);
                })
        }
        fetchData();
    }, [url])
    return { loading, data };
};

const currentAccessToken = async () => {
    const activeAccount = msalInstance.getActiveAccount(); // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
    const accounts = msalInstance.getAllAccounts();
    if (!activeAccount && accounts.length === 0) {
        return undefined;
    }
    const request = {
        scopes: ["api://reviewer.mrcabot.com/user_impersonation"],
        account: activeAccount || accounts[0]
    };

    const authResult = await msalInstance.acquireTokenSilent(request);
    return authResult.accessToken;
}

export const send = (url, body) => {
    const submitFetch = async () => {
        const headers = {};
        const token = await currentAccessToken();
        if (token && token.length > 0) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (typeof (body) === 'string') {
            headers['Content-Type'] = 'application/json';
        }

        fetch(url, {
            method: "POST",
            headers: headers,
            body: body
        }).then((response) => response.json())
    }
    submitFetch();
}
