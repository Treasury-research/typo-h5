import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useNftStore: any = create<any>()(
    persist(
        (set, get) => ({
            logList:[],
            purchaseType: 0, // 0 30day,1 90day
            showPurchaseModal: false,
            showTccModal: false,
            showRechargeSuccessModal: false,
            showPurchaseSuccessModal: false,
            showBack:true,
            redeemNftToken:'',
            setPurchaseType: (purchaseType: string) => {
                set({ purchaseType })
            },
            setShowPurchaseModal: (showPurchaseModal: boolean) => {
                set({ showPurchaseModal })
            },
            setShowTccModal: (showTccModal: boolean) => {
                set({ showTccModal })
            },
            setShowRechargeSuccessModal: (showRechargeSuccessModal: boolean) => {
                set({ showRechargeSuccessModal })
            },
            setShowPurchaseSuccessModal: (showPurchaseSuccessModal: boolean) => {
                set({ showPurchaseSuccessModal })
            },
            setShowBack: (showBack: boolean) => {
                set({ showBack })
            },
            setLogList: (logList: any) => {
                set({ logList })
            },
            setRedeemNftToken: (redeemNftToken: any) => {
                set({ redeemNftToken })
            }
        }),
        {
            name: 'useNftStore',
        }
    )
)
