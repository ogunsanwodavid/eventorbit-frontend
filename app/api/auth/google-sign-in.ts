const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function googleSignIn(
  latitude?: number | null,
  longitude?: number | null,
  pageRedirect?: string
) {
  //Trigger a browser redirect
  //::Lat, long and redirect route as query params
  window.location.href = `${API_BASE_URL}/api/auth/google?latitude=${
    latitude ?? ""
  }&longitude=${longitude ?? ""}&pageRedirect=${pageRedirect ?? ""}`;
}
