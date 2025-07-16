export function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { token } : {};
}
