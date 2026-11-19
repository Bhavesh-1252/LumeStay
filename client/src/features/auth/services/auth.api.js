import client from "../../../services/axios";

export async function register(username, email, password) {
  const response = await client.post(`/api/auth/register`, {
    username,
    email,
    password,
  });

  return response.data;
}

export async function verifyEmail(email, otp) {
  const response = await client.post(`/api/auth/verify`, {
    email,
    otp,
  });

  return response.data;
}

export async function resendVerificationOtp(email) {
  const response = await client.post("/api/auth/resend-verification-otp", { email });
  return response.data;
}

export async function login(identifier, password) {
  const response = await client.post(`/api/auth/login`, {
    identifier,
    password,
  });

  return response.data;
}

export async function logout() {
  const response = await client.post(`/api/auth/logout`);
  return response.data;
}

export async function logoutAll() {
    const response = await client.post(`/api/auth/logout-all`);

    return response.data;
}

export async function getMe() {
  const response = await client.get(`/api/auth/get-me`);
  return response.data;
}

export async function forgotPassword(email) {
  const response = await client.post("/api/auth/forgot-password", { email });
  return response.data;
}

export async function verifyOtp(email, otp) {
  const response = await client.post("/api/auth/verify-reset-code", { email, otp });
  return response.data;
}

export async function resetPassword(email, otp, newPassword) {
  const response = await client.post("/api/auth/reset-password", {
    email,
    otp,
    password: newPassword
  });
  return response.data;
}