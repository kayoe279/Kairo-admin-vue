import { createAlovaInstance } from "./alova";
import mocks from "./mocks";
import { useGlobSetting } from "@/hooks/useGlobSetting";
import { ResultEnum } from "@/lib/enums/httpEnum";
import { local } from "@/lib/storage";
import { isUrl } from "@/lib/utils/is";
import { useUserStore } from "@/store";
import { createAlovaMockAdapter } from "@alova/mock";
import { createAlova } from "alova";
import adapterFetch from "alova/fetch";
import VueHook from "alova/vue";
import { isString } from "lodash-es";

const { useMock, apiUrl, urlPrefix, loggerMock } = useGlobSetting();

const mockAdapter = createAlovaMockAdapter([...mocks], {
  // 全局控制是否启用mock接口，默认为true
  enable: useMock,

  // 非模拟请求适配器，用于未匹配mock接口时发送请求
  httpAdapter: adapterFetch(),

  // mock接口响应延迟，单位毫秒
  delay: 1000,

  // 自定义打印mock接口请求信息
  // mockRequestLogger: (res) => {
  //   loggerMock && console.log(`Mock Request ${res.url}`, res);
  // },
  mockRequestLogger: loggerMock,
  onMockError(error, currentMethod) {
    console.error("🚀 ~ onMockError ~ currentMethod:", currentMethod);
    console.error("🚀 ~ onMockError ~ error:", error);
  }
});

export const Alova = createAlova({
  baseURL: apiUrl,
  statesHook: VueHook,
  // 关闭全局请求缓存
  // cacheFor: null,
  // 全局缓存配置
  // cacheFor: {
  //   POST: {
  //     mode: 'memory',
  //     expire: 60 * 10 * 1000
  //   },
  //   GET: {
  //     mode: 'memory',
  //     expire: 60 * 10 * 1000
  //   },
  //   HEAD: 60 * 10 * 1000 // 统一设置HEAD请求的缓存模式
  // },
  // 在开发环境开启缓存命中日志
  cacheLogger: process.env.NODE_ENV === "development",
  requestAdapter: mockAdapter,
  beforeRequest(method) {
    const userStore = useUserStore();
    const token = userStore.token;
    // 添加 token 到请求头
    if (!method.meta?.ignoreToken && token) {
      method.config.headers["token"] = token;
    }
    // 处理 api 请求前缀
    const isUrlStr = isUrl(method.url as string);
    if (!isUrlStr && urlPrefix) {
      method.url = `${urlPrefix}${method.url}`;
    }
    if (!isUrlStr && apiUrl && isString(apiUrl)) {
      method.url = `${apiUrl}${method.url}`;
    }
  },
  responded: {
    onSuccess: async (response, method) => {
      const res = (response.json && (await response.json())) || response.body;

      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      if (method.meta?.isReturnNativeResponse) {
        return res;
      }
      // 请根据自身情况修改数据结构
      const { message, code, result } = res;

      // 不进行任何处理，直接返回
      // 用于需要直接获取 code、result、 message 这些信息时开启
      if (method.meta?.isTransformResponse === false) {
        return res.data;
      }

      const Message = window.$message;
      const Modal = window.$dialog;

      const LoginPath = "/login";
      if (ResultEnum.SUCCESS === code) {
        return result;
      }
      // 需要登录
      if (code === 912) {
        Modal?.warning({
          title: "提示",
          content: "登录身份已失效，请重新登录!",
          closable: false,
          maskClosable: false,
          onPositiveClick: async () => {
            local.clear();
            window.location.href = LoginPath;
          }
        });
      } else {
        // 可按需处理错误 一般情况下不是 912 错误，不一定需要弹出 message
        Message?.error(message);
        throw new Error(message);
      }
    }
  }
});

// 项目，多个不同 api 地址，可导出多个实例
// export const AlovaTwo = createAlova({
//   baseURL: 'http://localhost:9001',
// });

export const request = createAlovaInstance({
  baseURL: import.meta.env.VITE_API_ENDPOINT
});
