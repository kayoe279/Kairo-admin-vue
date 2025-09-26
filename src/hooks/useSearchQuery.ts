import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, typedBoolean, validValue } from "@/lib";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

type QueryParams<T extends string> = {
  [key in T]: string | undefined;
};

export const queryKeys = ["page", "pageSize", "keyword", "sortBy", "sortOrder"];
type QueryKeys = "page" | "pageSize" | "keyword" | "sortBy" | "sortOrder";

export const useSearchQuery = <T extends string>({
  prefix,
  extendKeys = [],
  pageSize: pageSizeParam,
  extendSearchParams = {}
}: {
  prefix?: string;
  extendKeys?: T[];
  pageSize?: number;
  extendSearchParams?: Record<string, any>;
} = {}) => {
  const route = useRoute();
  const router = useRouter();
  const allQueryKeys = [...(extendKeys as T[]), ...(queryKeys as QueryKeys[])];

  const allQuery = computed(() => route.query as Record<string, string | null>);

  const searchQuery = computed(() => {
    const result = {} as QueryParams<QueryKeys | T>;

    allQueryKeys.forEach((key) => {
      const prefixedKey = prefix ? `${prefix}_${key}` : key;
      const value = allQuery.value[prefixedKey] || undefined;
      if (validValue(value)) {
        result[key] = value;
      }
    });

    const { page, pageSize, ...rest } = result;

    const pageSizeValue = Number(pageSize || pageSizeParam || DEFAULT_PAGE_SIZE);

    const raw = {
      ...rest,
      ...extendSearchParams,
      page: page ? Number(page) : Number(DEFAULT_PAGE),
      pageSize: isNaN(pageSizeValue) ? Number(DEFAULT_PAGE_SIZE) : pageSizeValue
    };

    return raw;
  });

  const noQuery = computed(
    () => Object.values(searchQuery.value).filter(typedBoolean).length === 0
  );

  // 设置参数
  const setSearchQuery = (newParams: Record<string, any>, options: { replace?: boolean } = {}) => {
    const newQuery = { ...route.query, ...newParams };

    const query = Object.entries(newQuery).reduce(
      (acc, [key, value]) => {
        if (validValue(value)) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    if (options.replace) {
      router.replace({
        query
      });
    } else {
      router.push({
        query
      });
    }
  };

  return { allQuery, searchQuery, noQuery, setSearchQuery };
};

export const useQueryParams = <T extends string>(keys: T[], prefix?: string) => {
  const route = useRoute();

  return computed(() => {
    const result = {} as QueryParams<T>;
    const query = route.query as Record<string, string | null>;

    keys.forEach((key) => {
      const prefixedKey = prefix ? `${prefix}_${key}` : key;
      const value = query[prefixedKey] || undefined;
      if (validValue(value)) {
        result[key] = value;
      }
    });

    return result;
  });
};
