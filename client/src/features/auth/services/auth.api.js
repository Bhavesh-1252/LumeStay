import axios from "axios";

// const baseUrl = ;

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function register(username, email, password) {
  const response = await api.post(`/api/auth/register`, {
    username,
    email,
    password,
  });

  return response.data;
}

export async function verifyEmail(email, otp) {
  const response = await api.post(`/api/auth/verify`, {
    email,
    otp,
  });

  return response.data;
}

export async function login(identifier, password) {
  const response = await api.post(`/api/auth/login`, {
    identifier,
    password,
  });

  return response.data;
}

export async function logout() {
  const response = await api.post(`/api/auth/logout`);
  return response.data;
}

export async function logoutAll() {
  try {
    const response = await api.post(`/api/auth/logout-all`);

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function rotateTokens() {
  const response = await api.post(`/api/auth/rotate-token`);
  return response.data;
}

export async function getMe(accessToken) {
  const response = await api.get(`/api/auth/get-me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
}

export async function forgotPassword(email) {
    const response = await api.post("/api/auth/forgot-password", {email});
    return response.data;
}

export async function verifyOtp(email, otp) {
    const response = await api.post("/api/auth/verify-reset-code", {email, otp});
    return response.data;
}

export async function resetPassword(email, otp, newPassword) {
    const response = await api.post("/api/auth/reset-password", {
        email,
        otp,
        newPassword
    });
    return response.data;
}