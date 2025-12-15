export const googleOAuth = () => {
  if (typeof window === "undefined") return;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("NEXT_PUBLIC_API_URL is missing");
    return;
  }

  // 🔐 Always backend OAuth
  window.location.href = `${apiUrl}/auth/google`;
};

export const githubOAuth = () => {
  if (typeof window === "undefined") return;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("NEXT_PUBLIC_API_URL is missing");
    return;
  }

  window.location.href = `${apiUrl}/auth/github`;
};
