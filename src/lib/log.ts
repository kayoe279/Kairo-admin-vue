const projectName = import.meta.env.VITE_GLOB_APP_TITLE;

export const warn = (message: string) => {
  console.warn(`[${projectName} warn]:${message}`);
};

export const error = (message: string) => {
  throw new Error(`[${projectName} error]:${message}`);
};
