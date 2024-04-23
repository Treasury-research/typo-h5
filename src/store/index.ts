import { create } from "zustand";
import { ethers } from "ethers";
import { ReactNode } from "react";
import { KeyData } from "../lib/types";

interface AppState {
    token: string;
    setToken: (token: string) => void;
    address: string | undefined;
    setAddress: (address: string | undefined) => void;
    provider: ethers.providers.Web3Provider | null;
    setProvider: (provider: ethers.providers.Web3Provider | null) => void;
    signer: ethers.Signer | null;
    setSigner: (signer: ethers.Signer | null) => void;
    email: string;
    setEmail: (email: string) => void;
    activeKeyChart: number;
    setActiveKeyChart: (key: number) => void;
    baseMessage: string;
    setBaseMessage: (baseMessage: string) => void;
    signedMessage: string;
    setSignedMessage: (signedMessage: string) => void;
    jwt: string;
    setJwt: (token: string) => void;
    wallet: any;
    setWallet: (wallet: any) => void;
    toastMessage: string;
    toastType: "success" | "danger" | "warning" | "primary" | undefined;
    toastTime: number | undefined;
    showToast: (
	message: string,
	type?: "success" | "danger" | "warning" | "primary" | undefined,
	time?: number | undefined
    ) => void;
    emailSubscription: boolean | undefined;
    setEmailSubscription: (emailSubscription: boolean) => void;
    organization: string | undefined;
    setOrganization: (organization: string) => void;
    
    selectedApikey: KeyData | undefined;
    setSelectedApiKey: (selectedApikey: KeyData | undefined) => void;
    isApikeyModalOpen: boolean;
    setIsApikeyModalOpen: (isApikeyModalOpen: boolean) => void;
    defaultApikeyServiceName: string | undefined;
    setDefaultApikeyServiceName: (
	defaultApikeyServiceName: string | undefined
    ) => void;
    isSelectedApikeyModalOpen: boolean;
    setIsSelectedApikeyModalOpen: (isApikeyModalOpen: boolean) => void;
    showVisualize: boolean;
    setShowVisualize: (isualize: boolean) => void;
    openInviteModal: boolean;
    setOpenInviteModal: (openInviteModal: boolean) => void;
    openReferralModal: boolean;
    setOpenReferralModal: (openReferralModal: boolean) => void;
    openBindEmailModal: boolean;
    setOpenBindEmailModal: (openBindEmailModal: boolean) => void;
    openVerificationEmailModal: boolean;
    setOpenVerificationEmailModal: (openVerificationEmailModal: boolean) => void;
    openUploadAvatarModal: boolean;
    setOpenUploadAvatarModal: (openUploadAvatarModal: boolean) => void;
}

export const useStore = create<AppState>()((set) => ({
    token: "",
    setToken: (token) => set({ token }),
    address: "",
    setAddress: (address) => set({ address }),
    provider: null,
    setProvider: (provider) => set({ provider }),
    signer: null,
    wallet: null,
    setWallet: (wallet) => set(wallet),
    setSigner: (signer) => set({ signer }),
    email: "",
    jwt: "",
    setJwt: (token: string) => token,
    setEmail: (email) => set({ email }),
    activeKeyChart: 0,
    setActiveKeyChart: (keyIndex) => set({ activeKeyChart: keyIndex }),
    baseMessage: "",
    setBaseMessage: (baseMessage) => set({ baseMessage }),
    signedMessage: "",
    setSignedMessage: (signedMessage) => set({ signedMessage }),
    emailSubscription: undefined,
    setEmailSubscription: (emailSubscription) => set({ emailSubscription }),
    organization: undefined,
    setOrganization: (organization: string) => set({ organization }),
   
    toastMessage: "",
    toastType: undefined,
    toastTime: undefined,
    showToast: (
	message: string,
	type?: "success" | "danger" | "warning" | "primary" | undefined,
	time?: number | undefined
    ) =>
	set({
	    toastMessage: message,
	    toastType: type,
	    toastTime: time,
	}),
    selectedApikey: undefined,
    setSelectedApiKey: (selectedApikey: KeyData | undefined) =>
	set({ selectedApikey }),
    isApikeyModalOpen: false,
    setIsApikeyModalOpen: (isApikeyModalOpen: boolean) =>
	set({ isApikeyModalOpen }),
    defaultApikeyServiceName: "",
    setDefaultApikeyServiceName: (defaultApikeyServiceName: string | undefined) =>
	set({ defaultApikeyServiceName }),
    isSelectedApikeyModalOpen: false,
    setIsSelectedApikeyModalOpen: (isSelectedApikeyModalOpen: boolean) =>
	set({ isSelectedApikeyModalOpen }),
    showVisualize: false,
    setShowVisualize: (showVisualize: boolean) => set({ showVisualize }),
    openInviteModal: false,
    setOpenInviteModal: (openInviteModal: boolean) => set({ openInviteModal }),
    openReferralModal: false,
    setOpenReferralModal: (openReferralModal: boolean) => set({ openReferralModal }),
    openBindEmailModal: false,
    setOpenBindEmailModal: (openBindEmailModal: boolean) =>
	set({ openBindEmailModal }),
    openVerificationEmailModal: false,
    setOpenVerificationEmailModal: (openVerificationEmailModal: boolean) =>
	set({ openVerificationEmailModal }),
    openUploadAvatarModal: false,
    setOpenUploadAvatarModal: (openUploadAvatarModal: boolean) =>
	set({ openUploadAvatarModal }),
}));
