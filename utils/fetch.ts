export async function fetchWithToken(url: string, options = {}) {
  const response = await fetch(url, { ...options, credentials: "include" });

  if (response.status === 401) {
    // Token is expired; try refreshing it
    const refreshResponse = await fetch("/api/refresh-token", {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      // Retry the original request after refreshing the token
      return await fetch(url, { ...options, credentials: "include" });
    } else {
      throw new Error("Unable to refresh token. Please log in again.");
    }
  }

  return response; // Return the original response if no 401 occurred
}
