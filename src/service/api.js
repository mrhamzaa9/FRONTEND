export const api = async (url, method = "GET", body) => {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`http://localhost:4000${url}`, options);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Request failed");

  return data;
};
