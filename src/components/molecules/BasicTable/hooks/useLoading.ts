import { ref, unref } from "vue";

export function useLoading() {
  const loadingRef = ref(false);

  // 获取加载状态
  function getLoading() {
    return unref(loadingRef);
  }

  // 设置加载状态
  function setLoading(loading: boolean) {
    loadingRef.value = loading;
  }

  return {
    getLoading,
    setLoading
  };
}
