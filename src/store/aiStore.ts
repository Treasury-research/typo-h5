import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAiStore: any = create<any>()(
	persist(
		(set: any, get: any) => ({
			totalCoupon: 0,
			usedCoupon: 0,
			setTotalCoupon: (totalCoupon: number) => {
				set({ totalCoupon });
			},
			setUsedCoupon: (usedCoupon: number) => {
				set({ usedCoupon });
			},
		}),
		{
			name: "useAiStore",
		}
	)
);
