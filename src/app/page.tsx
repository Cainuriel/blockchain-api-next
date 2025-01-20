import TokensBalance from '@/components/tokenBalance'
import RecoverSigner from '@/components/recoverSigner'
import  NFTBalance   from '@/components/nftBalance'
import  BUYpfx   from '@/components/buyPFX'
import  Staking   from '@/components/staking'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      < BUYpfx />
      <Staking />
      <TokensBalance />
      <RecoverSigner />
      <NFTBalance />  
    </main>
  )
}