// useTranslation.js
import { EN_JSON } from "../lib/locales/en/common"; // 英文语言包
import { AR_JSON } from "../lib/locales/ar/common"; // 阿拉伯语言包
import { useCallback } from "react";
import { supportLanguage, useCommonStore } from "store/commonStore";

const LanguageMap: any = {
  en: EN_JSON,
  ar: AR_JSON,
};

const useTranslation = () => {
  const { language } = useCommonStore();
  const jsonFun = useCallback(
    (key: string, params: any = {}) => {
      // 获取当前的语言包里面key所对应的value值
      let value = LanguageMap[(language as supportLanguage) || "en"][key];
      /*
         如果传key进来，或者没有找到value，就直接返回key就好了，页面上就显示key，方便找到漏翻译的字段
       */
      if (!key || !value) return key;
      /*
         这里是为了能够让我们写的hook能支持传参
       */
      Object.keys(params).forEach((item) => {
        value = value.replace(new RegExp(`{{${item}}}`, "g"), params[item]);
      });
      return value;
    },
    [language]
  );
  return {
    t: jsonFun,
  };
};

export default useTranslation;
