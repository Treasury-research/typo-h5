import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserInfoStore: any = create<any>()(
	persist(
		(set: any, get: any) => ({
			account: "",
			email: "",
			avatar: "",
			username: "",
			email_subscription: false,
			email_verified: false,
			organization: "",
			score: 0,
			rank: 0,
			userId: "",
			level: 1,
			nftLevel: "",
			token_id: "",
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
			setAvatar: (avatar: string) => {
				set({ avatar });
			},
			setUserName: (username: string) => {
				set({ username });
			},
			setRank: (rank: number) => {
				set({ rank });
			},
			setScore: (score: number) => {
				set({ score });
			},
			setLevel: (level: number) => {
				set({ level });
			},
			setNftLevel: (nftLevel: number) => {
				set({ nftLevel });
			},
			setTokenId: (token_id: number) => {
				set({ token_id });
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
					score: 0,
					avatar: "",
					isPassuser: false,
					level: 1,
					nftLevel: "",
					token_id: "",
					noPassuserSearchTimes: 0,
				});
			},
		}),
		{
			name: "useUserInfoStore",
		}
	)
);
