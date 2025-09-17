import { useDebounceFn } from "@vueuse/core";
import { onMounted, onUnmounted, ref } from "vue";

export interface UseDocumentResizeOptions {
  /**
   * 防抖延迟时间（毫秒）
   */
  debounceDelay?: number;
  /**
   * 要监听的目标元素，默认为 document.body
   */
  target?: HTMLElement;
  /**
   * 是否监听子树的变化（包括所有子元素）
   */
  subtree?: boolean;
  /**
   * 是否在初始化时立即执行一次回调
   */
  immediate?: boolean;
  /**
   * 是否自动开始监听，默认为 true
   */
  autoStart?: boolean;
}

/**
 * 监听文档中任何元素的尺寸变化
 * 使用 ResizeObserver 监听指定元素及其子元素的尺寸变化
 */
export const useDocumentResize = (callback: () => void, options: UseDocumentResizeOptions = {}) => {
  const {
    debounceDelay = 280,
    target,
    subtree = true,
    immediate = false,
    autoStart = true
  } = options;

  const isSupported = ref(false);
  const resizeObserver = ref<ResizeObserver | null>(null);

  // 防抖处理的回调函数
  const debouncedCallback = useDebounceFn(callback, debounceDelay);

  const startObserving = () => {
    // 检查浏览器是否支持 ResizeObserver
    if (!window.ResizeObserver) {
      console.warn("ResizeObserver is not supported in this browser");
      isSupported.value = false;
      return;
    }

    isSupported.value = true;

    // 创建 ResizeObserver 实例
    resizeObserver.value = new ResizeObserver((entries) => {
      // 当有元素尺寸变化时，触发回调
      if (entries.length > 0) {
        debouncedCallback();
      }
    });

    // 确定监听目标
    const targetElement = target || document.body;

    // 开始监听目标元素
    resizeObserver.value.observe(targetElement);

    // 如果需要监听子树，则递归监听所有子元素
    if (subtree) {
      const observeAllChildren = (element: Element) => {
        const children = element.children;
        for (let i = 0; i < children.length; i++) {
          const child = children[i] as HTMLElement;
          resizeObserver.value?.observe(child);
          // 递归监听子元素
          observeAllChildren(child);
        }
      };

      observeAllChildren(targetElement);
    }

    // 如果需要立即执行
    if (immediate) {
      callback();
    }

    console.log(`开始监听${subtree ? "文档中所有元素" : "目标元素"}的尺寸变化`);
  };

  const stopObserving = () => {
    if (resizeObserver.value) {
      resizeObserver.value.disconnect();
      resizeObserver.value = null;
      console.log("停止监听元素尺寸变化");
    }
  };

  onMounted(() => {
    if (autoStart) {
      startObserving();
    }
  });

  onUnmounted(() => {
    stopObserving();
  });

  return {
    isSupported,
    startObserving,
    stopObserving
  };
};

/**
 * 监听文档中动态添加的元素
 * 使用 MutationObserver 监听 DOM 变化，当有新元素添加时自动为其添加 ResizeObserver
 */
export const useDocumentDynamicResize = (
  callback: () => void,
  options: UseDocumentResizeOptions = {}
) => {
  const { debounceDelay = 280, target, immediate = false } = options;

  const isSupported = ref(false);
  const resizeObserver = ref<ResizeObserver | null>(null);
  const mutationObserver = ref<MutationObserver | null>(null);
  const observedElements = new Set<Element>();

  const debouncedCallback = useDebounceFn(callback, debounceDelay);

  const observeElement = (element: Element) => {
    if (!resizeObserver.value || observedElements.has(element)) return;

    resizeObserver.value.observe(element as HTMLElement);
    observedElements.add(element);
  };

  const startObserving = () => {
    // 检查浏览器支持
    if (!window.ResizeObserver || !window.MutationObserver) {
      console.warn("ResizeObserver or MutationObserver is not supported");
      isSupported.value = false;
      return;
    }

    isSupported.value = true;
    const targetElement = target || document.body;

    // 创建 ResizeObserver
    resizeObserver.value = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        debouncedCallback();
      }
    });

    // 监听现有的所有元素
    const observeAllExisting = (element: Element) => {
      observeElement(element);
      const children = element.children;
      for (let i = 0; i < children.length; i++) {
        observeAllExisting(children[i]);
      }
    };

    observeAllExisting(targetElement);

    // 创建 MutationObserver 监听新增元素
    mutationObserver.value = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              observeAllExisting(element);
            }
          });
        }
      });
    });

    // 开始监听 DOM 变化
    mutationObserver.value.observe(targetElement, {
      childList: true,
      subtree: true
    });

    if (immediate) {
      callback();
    }

    console.log("开始监听文档中所有元素的动态尺寸变化");
  };

  const stopObserving = () => {
    if (resizeObserver.value) {
      resizeObserver.value.disconnect();
      resizeObserver.value = null;
    }

    if (mutationObserver.value) {
      mutationObserver.value.disconnect();
      mutationObserver.value = null;
    }

    observedElements.clear();
    console.log("停止监听动态元素尺寸变化");
  };

  onMounted(() => {
    startObserving();
  });

  onUnmounted(() => {
    stopObserving();
  });

  return {
    isSupported,
    startObserving,
    stopObserving
  };
};
