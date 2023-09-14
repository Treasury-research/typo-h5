import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useJwtStore:any = create<any>()(
  persist(
    (set:any, get:any) => ({
      jwt: '',
      setJwt: (jwt:string) => {
        set({ jwt })
      }
    }),
    {
      name: 'useJwtStore',
    }
  )
)