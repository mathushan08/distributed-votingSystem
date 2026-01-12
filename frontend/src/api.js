const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiFetch = async (url, options = {}, retries = 3, backoff = 500) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(API_BASE + url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    // Retry on Server Errors (5xx)
    if (res.status >= 500) {
      if (retries > 0) {
        console.warn(`Server error ${res.status}. Retrying in ${backoff}ms...`);
        await wait(backoff);
        return apiFetch(url, options, retries - 1, backoff * 2);
      }
    }

    if (!res.ok) {
      let errorMessage = `API Error ${res.status}`;
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // ignore json parse error
      }
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (error) {
    // Retry on Network Errors (fetch failed)
    // Only retry if it's a network error (no response), not a 4xx logic error which throws above
    const isNetworkError = error.message === "Failed to fetch" || error.name === "TypeError";

    // Note: The throw new Error above is also caught here, so we must distinguish
    // If it's our logic error (4xx), don't retry.
    if (!isNetworkError && !error.message.includes("API Error")) {
      // Should technically be covered, but let's be safe.
    }

    if (retries > 0 && isNetworkError) {
      console.warn(`Network error. Retrying in ${backoff}ms...`);
      await wait(backoff);
      return apiFetch(url, options, retries - 1, backoff * 2);
    }

    throw error;
  }
};
