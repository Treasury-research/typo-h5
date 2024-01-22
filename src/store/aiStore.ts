import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAiStore: any = create<any>()(
	persist(
		(set: any, get: any) => ({
			totalCoupon: 0,
			usedCoupon: 0,
			searchLimit: 0,
			dailyAdd: 0,
			setTotalCoupon: (totalCoupon: number) => {
				set({ totalCoupon });
			},
			setUsedCoupon: (usedCoupon: number) => {
				set({ usedCoupon });
			},
			setSearchLimit: (searchLimit: number) => {
				set({ searchLimit });
			},
			setDailyAdd: (dailyAdd: number) => {
				set({ dailyAdd });
			},
		}),
		{
			name: "useAiStore",
		}
	)
);
