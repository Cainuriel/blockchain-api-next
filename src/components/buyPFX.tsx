'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'
import { web3Provider } from '../lib/provider'

// import RenderNFTs from './renderNFTs'

interface NFTINFO {

  rate?: number
  balance?: number


}

export default function BlockchainViewer() {

  const [data, setData] = useState<NFTINFO | null>(null) 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // const [metadata, setMetadata] = useState<string[]>([])

  const fetchBlockchainData = async () => {
   

    try {
      setLoading(true)
      setError('')



      let dataFromBlockchain = {}


        // const usdcContract = new ethers.Contract(CONTRACT_ADDRESSES.usdc, TOKEN_ABI, provider)
        
        const [ rate, balance] = await web3Provider.buyPFX();
        console.log(`rate, balance of pfx`, rate, balance);


        // if (tokenUris.length > 0) {
        //   setMetadata(tokenUris);
        // }

        dataFromBlockchain = {
            rate: rate,
            balance: balance,

        }


      setData({

        ...dataFromBlockchain
      })

    } catch (err) {
      if (err instanceof Error) {
        setError(`Error: ${err.message}`)
      } else {
        setError('Error al obtener datos de la blockchain')
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>VENTA DE PFX</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        
      <Button 
          onClick={fetchBlockchainData}
          disabled={loading }
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Consultar
        </Button>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {data && (
          <div className="space-y-2 pt-4">
      
            {data.rate && (
              <>
                <p className="font-medium">Ratio: {data.rate} PFX por USD</p>
                <p className="font-medium">Balance PFXs: {data.balance}</p>

              </>
            )}
            
          </div>
          
        )}
     
        
      </CardContent>


    </Card>
    
  )
}
