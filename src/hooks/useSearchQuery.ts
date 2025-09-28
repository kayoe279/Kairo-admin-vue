import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  PAGE_NAME,
  PAGE_SIZE_NAME,
  SORT_BY_NAME,
  SORT_ORDER_NAME,
  typedBoolean,
  validValue
} from "@/lib";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

type QueryParams<T extends string> = {
  [key in T]: string | undefined;
};

export const queryKeys = [PAGE_NAME, PAGE_SIZE_NAME, SORT_BY_NAME, SORT_ORDER_NAME, "keyword"];
type QueryKeys =
  | typeof PAGE_NAME
  | typeof PAGE_SIZE_NAME
  | typeof SORT_BY_NAME
  | typeof SORT_ORDER_NAME
  | "keyword";

const excludeResetKeys = [PAGE_SIZE_NAME, SORT_BY_NAME, SORT_ORDER_NAME];

export const useSearchQuery = <T extends string>({
  prefix,
  extendKeys = [],
  extendSearchParams = {}
}: {
  prefix?: string;
  extendKeys?: T[];
  extendSearchParams?: Record<string, any>;
} = {}) => {
  const route = useRoute();
  const router = useRouter();
  const allQueryKeys = [...(extendKeys as T[]), ...(queryKeys as QueryKeys[])];

  // 获取带前缀的 key
  const getPrefixedKey = (key: string) => (prefix ? `${prefix}_${key}` : key);

  const pageKey = getPrefixedKey(PAGE_NAME);
  const pageSizeKey = getPrefixedKey(PAGE_SIZE_NAME);

  const rawQuery = useQueryParams(allQueryKeys, prefix);

  const searchQuery = computed(() => {
    let raw = {
      ...rawQuery.value,
      ...extendSearchParams
    };
    if (rawQuery.value[pageKey]) {
      raw = {
        ...raw,
        [pageKey]: isNaN(Number(raw[pageKey])) ? Number(DEFAULT_PAGE) : Number(raw[pageKey])
      };
    }
    if (rawQuery.value[pageSizeKey]) {
      raw = {
        ...raw,
        [pageSizeKey]: isNaN(Number(raw[pageSizeKey]))
          ? Number(DEFAULT_PAGE_SIZE)
          : Number(raw[pageSizeKey])
      };
    }

    return raw;
  });

  const allSearchQuery = computed(() => route.query as Record<string, string | null>);

  const noQuery = computed(
    () => Object.values(searchQuery.value).filter(typedBoolean).length === 0
  );

  // 设置搜索参数, 排除 excludeKeys 外的所有参数
  const setSearchQuery = (
    newParams: Record<string, any>,
    excludeKeys: string[] = [],
    options: { replace?: boolean } = {}
  ) => {
    const query = Object.entries({ ...route.query, ...newParams }).reduce(
      (acc, [key, value]) => {
        const prefixedKey = getPrefixedKey(key);
        if (validValue(value) && !excludeKeys?.includes(prefixedKey)) {
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

  // 重置搜索参数, 排除 excludeResetKeys 外的所有参数
  const resetSearchQuery = (options: { replace?: boolean } = {}) => {
    const resetQuery: Record<string, any> = {};

    Object.entries(route.query).forEach(([key, value]) => {
      const prefixedKey = getPrefixedKey(key);
      if (excludeResetKeys.includes(prefixedKey) && validValue(value as string)) {
        resetQuery[key] = value;
      }
    });

    if (options.replace) {
      router.replace({
        query: resetQuery
      });
      return;
    }

    router.push({
      query: resetQuery
    });
  };

  return { allSearchQuery, searchQuery, noQuery, setSearchQuery, resetSearchQuery };
};

// 通过特定的 key 在 url 上获取值，支持前缀
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
