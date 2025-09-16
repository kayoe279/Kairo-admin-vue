import { warn } from "@/lib";
import pkg from "~/package.json";

export const getAppEnvConfig = () => {
  const ENV = import.meta.env;

  if (!ENV) {
    throw new Error("ENV is undefined");
  }

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_FILE_URL,
    VITE_USE_MOCK,
    VITE_LOGGER_MOCK
  } = ENV;

  if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`
    );
  }

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
    VITE_GLOB_FILE_URL,
    VITE_USE_MOCK,
    VITE_LOGGER_MOCK
  };
};

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv() {
  return import.meta.env.MODE as "development" | "production";
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}

export const getCommonStoragePrefix = () => {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig();
  return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}`.toUpperCase();
};

// Generate cache key according to version
export const getStorageShortName = () => {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
};
