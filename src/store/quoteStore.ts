import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useQuoteStore: any = create<any>()(
  persist(
    (set, get) => ({
      isCopilot:false,
      isShowInputQuote: false,
      quoteContent:'',
      quoteType:'',
      isOpenQuest:false,
      clickList:{
        time:'',
        list:[],
      },
      awards:[],
      setAwards: (awards:boolean) => {
        set({ awards });
      },
      setIsOpenQuest: (isOpenQuest:boolean) => {
        set({ isOpenQuest });
      },
      setClickList: (clickList:any) => {
        set({ clickList });
      },
      setIsShowInputQuote: (isShowInputQuote:boolean) => {
        set({ isShowInputQuote });
      },
      setQuoteContent: (quoteContent:string) => {
        set({ quoteContent });
      },
      setQuoteType: (quoteType:string) => {
        set({ quoteType });
      },
      setIsCopilot: (isCopilot:boolean) => {
        set({ isCopilot });
      },
    }),
    {
      name: "useQuoteStore",
    }
  )
);
