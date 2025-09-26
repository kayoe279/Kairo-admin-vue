import {
  type ListQueryParams,
  type ListResponse,
  type MutationResponse,
  type NavListInsert,
  SupabaseListAPI
} from "@/service";
import { queryKeysFactory } from "@/service/queryKey";
import {
  type QueryKey,
  type UseMutationOptions,
  type UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/vue-query";
import { MaybeRef, computed, unref } from "vue";

const listKey = queryKeysFactory("list");

export const useTableList = (
  params?: MaybeRef<ListQueryParams>,
  options?: Partial<UseQueryOptions<ListResponse, Error, ListResponse, ListResponse, QueryKey>>
) => {
  const result = useQuery({
    queryKey: computed(() => listKey.list({ ...unref(params) })),
    queryFn: () => SupabaseListAPI.getList(unref(params)),
    ...options
  });

  return result;
};

export const useTableCreate = (
  options?: Partial<UseMutationOptions<MutationResponse, Error, NavListInsert, MutationResponse>>
) => {
  const queryClient = useQueryClient();

  const result = useMutation({
    mutationFn: SupabaseListAPI.create,
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listKey.lists() });
    }
  });

  return result;
};
