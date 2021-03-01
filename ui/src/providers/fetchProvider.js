import { useState, useEffect } from 'react';
import { authProvider } from './authProvider';

export const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            let headers = {};
            if (authProvider.getAccount()) {
                const token = await authProvider.getAccessToken();
                headers['Authorization'] = `Bearer ${token.accessToken}`;
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

export const send = (url, body) => {
    const submitFetch = async () => {
        const headers = {};
        if (authProvider.getAccount()) {
            const token = await authProvider.getAccessToken();
            headers['Authorization'] = `Bearer ${token.accessToken}`;
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
