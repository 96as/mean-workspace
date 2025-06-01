export const environment = {
  production: true,
  apiUrl: (globalThis as any)?.ENV?.API_URL || 'https://YOUR_CLOUD_RUN_URL/api'
};