export const api = async (url, method = "GET", body,  isFormData = false) => {
  const options = { method, credentials: "include", headers: {} };

  if (body) {
    if (isFormData) {
      options.body = body;
      // DO NOT set Content-Type manually for FormData
    } else {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  const res = await fetch(`http://localhost:4000${url}`, options);

  if (res.status === 401) {
    await fetch(`http://localhost:4000/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Session expired. Logged out.");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};
