import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useBindEmailStore: any = create<any>()(
  persist(
    (set, get) => ({
      openBindEmail: false,
      type:'wallet', // wallet or github 
      third_party_type: '',
      third_party_id: '',
      setOpenBindEmail: (openBindEmail: boolean) => {
        set({ openBindEmail })
      },
      setPartyType: (third_party_type: any) => {
        set({ third_party_type })
      },
      setPartyId: (third_party_id: any) => {
        set({ third_party_id })
      },
      setType: (type: any) => {
        set({ type })
      },
      clearGitHubInfo: () => {
        set({
          third_party_type: '',
          third_party_id: '',
        })
      },
    }),
    {
      name: 'useBindEmailStore',
    }
  )
)

export const useConnectModalStore: any = create<any>()(
  persist(
    (set, get) => ({
      openConnectModal: false,
      setOpenConnectModal: (openConnectModal: boolean) => {
        set({ openConnectModal })
      },
      openRemindModal: false,
      opened: false,
      setOpend: (opened: boolean) => {
        set({ opened })
      },
      setOpenRemindModal: (openRemindModal: boolean) => {
        set({ openRemindModal })
      },
      clearConnectModalStore: () => {
				set({
					openConnectModal: false,
					openRemindModal: false,
					opened: false
				});
			},
    }),
    {
      name: 'useConnectModalStore',
    }
  )
)