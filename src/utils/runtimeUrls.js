const DEFAULT_PRODUCTION_API_BASE_URL =
  "https://vibesphere-backend-plut.onrender.com/api";

const stripTrailingSlash = (value) => value.replace(/\/+$/, "");

const getAbsoluteOrigin = (value) => {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

export const getApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL?.trim();
  if (envBase) return stripTrailingSlash(envBase);

  return import.meta.env.DEV ? "/api" : DEFAULT_PRODUCTION_API_BASE_URL;
};

export const getSocketUrl = () => {
  const envSocket = import.meta.env.VITE_SOCKET_URL?.trim();
  if (envSocket) return stripTrailingSlash(envSocket);

  const apiBase = getApiBaseUrl();
  if (apiBase.startsWith("/")) {
    return import.meta.env.DEV
      ? window.location.origin
      : getAbsoluteOrigin(DEFAULT_PRODUCTION_API_BASE_URL);
  }

  return getAbsoluteOrigin(apiBase) || apiBase;
};

export const getRefreshUrl = () => `${getApiBaseUrl()}/auth/refresh`;
