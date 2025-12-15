import api from "./axios";

/* TYPES*/

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}


   //    AUTH APIs


// 1️⃣ Register
export const registerUser = (payload: {
  email: string;
  username: string;
  password: string;
}) =>
  api.post<ApiResponse<AuthUser>>("/auth/register", payload);

// 2️⃣ Login
export const loginUser = (payload: {
  emailOrPhoneOrUsername?: string;
  email?: string;
  password: string;
  otp?: string;
}) =>
  api.post<ApiResponse<AuthUser>>("/auth/login", payload);

// 3️⃣ Forgot password (verify email + otp)
export const verifyEmailOtp = (payload: {
  email: string;
  otp: string;
}) =>
  api.post("/auth/verifyEmail", payload);

// 4️⃣ Reset password
export const resetPassword = (payload: {
  email: string;
  password: string;
}) =>
  api.post("/auth/reset-password", payload);

// 5️⃣ Send OTP
export const sendOtp = (payload: {
  email: string;
  purpose: "reset-password" | "login" | "register";
}) =>
  api.post(`/auth/sendOtp/${payload.purpose}`, {
    email: payload.email,
  });

// 6️⃣ Verify OTP
export const verifyOtp = (payload: {
  email: string;
  otp: string;
  purpose: "reset-password" | "login" | "register";
}) =>
  api.post("/auth/verifyOtp", payload);


//    OAUTH APIs


// 7️⃣ Google OAuth redirect
export const googleOAuth = () =>
  `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;

// 8️⃣ GitHub OAuth redirect
export const githubOAuth = () =>
  `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;

// 9️⃣ Exchange temp OAuth token → JWTs
export const exchangeOAuthToken = (payload: {
  tempOAuthToken: string;
}) =>
  api.post("/auth/oauth/token", payload);
