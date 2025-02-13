import { useMediaQuery } from "@vueuse/core";

export const useMedia = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return { isMobile };
};
