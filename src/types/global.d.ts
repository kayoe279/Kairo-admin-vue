import "vue";

declare global {
  declare type Locale = "zh-CN" | "en-US";

  interface Window {
    $loadingBar: import("naive-ui").LoadingBarApi;
    $dialog: import("naive-ui").DialogApi;
    $message: import("naive-ui").MessageApi;
    $notification: import("naive-ui").NotificationApi;
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
}
