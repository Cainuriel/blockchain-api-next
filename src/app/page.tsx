import BlockchainViewer from '@/components/tokenBalance'
import RecoverSigner from '@/components/recoverSigner'
export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <BlockchainViewer />
      <RecoverSigner />
    </main>
  )
}