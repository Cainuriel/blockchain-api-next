import BlockchainViewer from '@/components/tokenBalance'
import RecoverSigner from '@/components/recoverSigner'
import  NFTBalance   from '@/components/nftBalance'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <BlockchainViewer />
      <RecoverSigner />
      <NFTBalance />  
    </main>
  )
}