export const api = async (url, method = "GET", body, isFormData = false) => {
  const options = {
    method,
    credentials: "include",
  };

  if (body) {
    if (isFormData) {
      // ✅ FormData: let browser set headers
      options.body = body;
    } else {
      // ✅ JSON request
      options.headers = {
        "Content-Type": "application/json",
      };
      options.body = JSON.stringify(body);
    }
  }

  const res = await fetch(`http://localhost:4000${url}`, options);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Request failed");

  return data;
};
