import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserInfoStore: any = create<any>()(
	persist(
		(set: any, get: any) => ({
			account: "",
			email: "",
			email_subscription: false,
			email_verified: false,
			organization: "",
			username: "",
			userId: "",
			new_email: "",
			isInvite: false,
			isPassuser: false,
			noPassuserSearchTimes: 0,
			setNoPassuserSearchTimes: (noPassuserSearchTimes: number) => {
				set({ noPassuserSearchTimes });
			},
			setUserId: (userId: string) => {
				set({ userId });
			},
			setAccount: (account: string) => {
				set({ account });
			},
			setUserInfo: (data: any) => {
				set({ ...data });
			},
			setEmail: (email: string) => {
				set({ email });
			},
			setIsInvite: (isInvite: boolean) => {
				set({ isInvite });
			},
			setIsPassuser: (isPassuser: boolean) => {
				set({ isPassuser });
			},
			clearUserInfo: () => {
				set({
					email: "",
					email_subscription: false,
					email_verified: false,
					organization: "",
					username: "",
					userId: "",
					account: "",
					isInvite: false,
				});
			},
		}),
		{
			name: "useUserInfoStore",
		}
	)
);
