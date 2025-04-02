// Description: This file contains helper functions for making API requests.
import { api } from './api'; 

export function ApiHelperGet(url: RequestInfo | URL, headers?: Record<string, string>) {
    return api.get(url.toString(), {
        headers
    })
    .then((response) => {
        return response.data;
    })
    .catch(error => {
        console.error('There was a problem with the axios operation:', error);
        throw error; // Re-throwing to allow calling code to handle errors
    });
}
export function ApiHelperPost(url: RequestInfo | URL, data: any, headers?: Record<string, string>) {
    return api.post(url.toString(), data, {
        headers
    })
    .then((response) => {
        return response.data;
    })
    .catch(error => {
        console.error('There was a problem with the POST request:', error);
        throw error; // Re-throwing to allow calling code to handle errors
    });
}