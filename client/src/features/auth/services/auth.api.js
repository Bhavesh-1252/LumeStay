import axios from "axios"

// const baseUrl = ;

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})

export async function register({ username, email, password }) {
    try {
        const response = await api.post(`/api/auth/register`, {
            username, email, password
        })

        return response.data;
    }
    catch (error) {
        console.log(error)
    }
}

export async function login({ email, username, password }) {
    try {
        const response = await api.post(`/api/auth/login`, {
            username, email, password
        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export async function logout() {
    try {
        const response = await api.post(`/api/auth/logout`)

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export async function logoutAll() {
    try {
        const response = await api.post(`/api/auth/logout-all`);

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export async function rotateTokens() {
    try {
        const response = await api.post(`/api/auth/rotate-token`)

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

export async function getMe() {
    try {
        const response = await api.get(`/api/auth/get-me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}
