export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  ASSESSMENT_DURATION_SECONDS: Number(
    import.meta.env.VITE_ASSESSMENT_DURATION_SECONDS
  ),
};

if (!APP_CONFIG.API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}
