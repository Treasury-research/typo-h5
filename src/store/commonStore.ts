import { create } from "zustand";
import { persist } from "zustand/middleware";

export type supportLanguage = "en" | "ar";

export const useCommonStore: any = create<any>()(
        persist(
                (set, get) => ({
                        // state
                        language: "en",
                        openShareModal: false,
                        setLanguage: (language: supportLanguage) => {
                                set({ language });
                        },
                        setOpenShareModal: (openShareModal: boolean) => {
                                set({ openShareModal });
                        },
                }),
                {
                        name: "useCommon",
                }
        )
);
