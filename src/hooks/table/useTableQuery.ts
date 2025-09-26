import { useSearchQuery } from "@/hooks/useSearchQuery";
import { PAGE_NAME } from "@/lib";

export const useClearQueryParams = (prefix?: string) => {
  const { searchQuery, setSearchQuery } = useSearchQuery();

  const clearQueryParams = () => {
    const currentQuery = searchQuery.value;
    if (Object.keys(currentQuery).length > 0) {
      if (prefix) {
        const newQuery: Record<string, any> = {};
        for (const [key, value] of Object.entries(currentQuery)) {
          if (!key.startsWith(prefix)) {
            newQuery[key] = value;
          }
        }
        setSearchQuery(newQuery);
      } else {
        setSearchQuery({});
      }
    }
  };

  // 清除 page
  const clearPageKey = () => {
    const pageKey = prefix ? `${prefix}_${PAGE_NAME}` : PAGE_NAME;
    const currentQuery = { ...searchQuery.value };

    if (currentQuery[pageKey]) {
      delete currentQuery[pageKey];
      setSearchQuery(currentQuery);
    }
  };

  return { clearQueryParams, clearPageKey };
};
