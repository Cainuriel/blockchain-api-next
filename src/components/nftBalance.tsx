'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'
import { web3Provider } from '../lib/provider'
import currentConfig from '../lib/config/currentConfig.json'
// import RenderNFTs from './renderNFTs'

interface NFTINFO {

  containerBalance?: number
  sealBalance?: number
  containerName?: string
  sealName?: string
  priceContainer?: number
  priceSeal?: number

}

export default function BlockchainViewer() {
  const [address, setAddress] = useState('')
  const [data, setData] = useState<NFTINFO | null>(null) 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // const [metadata, setMetadata] = useState<string[]>([])

  const fetchBlockchainData = async () => {
    if (!ethers.isAddress(address)) {
      setError('Dirección inválida')
      return
    }

    try {
      setLoading(true)
      setError('')



      let nftData = {}


        // const usdcContract = new ethers.Contract(CONTRACT_ADDRESSES.usdc, TOKEN_ABI, provider)
        
        const [ nameContainer, balanceContainer, priceContainer, nameSeal, balanceSeal, priceSeal] = await web3Provider.nft(address);

        const tokenUris = await web3Provider.metadataNFTs(address); // all containers
        console.log(`tokenUris in component:`, tokenUris);
        const lastNFT = await web3Provider.metadataNFTs(address, currentConfig.sealNFTContract, true); // last seal
        console.log(`lastNFT in component:`, lastNFT);

        // if (tokenUris.length > 0) {
        //   setMetadata(tokenUris);
        // }

        nftData = {
            containerName: nameContainer,
            sealName: nameSeal,
            containerBalance: balanceContainer,
            sealBalance: balanceSeal,
            priceContainer:  parseFloat(ethers.formatUnits(priceContainer)).toFixed(3),
            priceSeal:  parseFloat(ethers.formatUnits(priceSeal)).toFixed(3)
        }


      setData({

        ...nftData
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
        <CardTitle>Consulta de Balances de NFTs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Dirección a consultar</label>
          <Input
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* <div className="space-y-2">
          <label className="text-sm font-medium">Dirección del Token (opcional)</label>
          <Input
            placeholder="0x..."
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
          />
        </div> */}
        

        <Button 
          onClick={fetchBlockchainData}
          disabled={loading || !address}
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
      
            {data.containerName && (
              <>
                <p className="font-medium">Nombre: {data.containerName}</p>
                <p className="font-medium">Precio en BNBs: {data.priceContainer}</p>
                <p className="font-medium">Saldo Usuario: {data.containerBalance}</p>
                <p className="font-medium">Nombre: {data.sealName}</p>
                <p className="font-medium">Saldo Usuario: {data.sealBalance}</p>
                <p className="font-medium">Precio en BNBs: {data.priceSeal}</p>
              </>
            )}
            
          </div>
          
        )}
     
        
      </CardContent>

      {/* {metadata.length > 0 && (

      <RenderNFTs tokensUris={metadata} />

      )} */}

    </Card>
    
  )
}

