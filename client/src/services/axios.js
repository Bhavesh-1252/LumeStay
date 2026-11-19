import axios from "axios";

const client = axios.create({
    baseURL: import.meta.env.VITE_SERVER_BASE_URL,
    withCredentials: true,
})

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_BASE_URL,
    withCredentials: true,
})

client.interceptors.request.use(
    function (config) {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken)
            config.headers.Authorization = `Bearer ${accessToken}`;

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
)

export async function rotateTokens() {
    const response = await api.post(`/api/auth/rotate-token`);
    return response.data;
}


let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });

    failedQueue = [];
}

client.interceptors.response.use(
    function (response) { return response; },
    async function (error) {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then(() => {
                    return client(originalRequest);
                    })
            }

            isRefreshing = true;
            try {
                const data = await rotateTokens();
                localStorage.setItem("accessToken", data.accessToken);
                processQueue(null, data.accessToken);
                return client(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                localStorage.removeItem("accessToken");
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
)

export default client;