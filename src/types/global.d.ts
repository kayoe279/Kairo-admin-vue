import type { DialogApi, LoadingBarApi, MessageApi, NotificationApi } from "naive-ui";
import "vue";

declare global {
  declare type Locale = "zh-CN" | "en-US";

  interface Window {
    $loadingBar: LoadingBarApi;
    $dialog: DialogApi;
    $message: MessageApi;
    $notification: NotificationApi;
  }

  interface DictMap {
    [key: string]: Entity.Dict[];
  }

  declare namespace Storage {
    interface Session {
      dict: DictMap;
    }

    interface Local {
      /* 存储用户信息 */
      userInfo: Api.Login.Info;
      /* 存储登录账号 */
      loginAccount: any;
      /* 存储当前语言 */
      locale: Locale;
    }
  }

  declare namespace Cookie {
    interface Key {
      /* 存储访问token */
      accessToken: string;
      /* 存储刷新token */
      refreshToken: string;
    }
  }

  type Recordable = Record<string, any>;
}

export {};
