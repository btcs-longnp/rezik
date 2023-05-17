'use client'
import { RecoilRoot } from 'recoil'
import '@/services/initFirebase'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>
}
