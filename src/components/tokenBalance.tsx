'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'
import { provider } from '../lib/provider'

// ABI simplificado para ejemplo
const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",

]

interface TOKENINFO {

  tokenBalance?: string
  tokenName?: string
  tokenSymbol?: string

}

const CONTRACT_ADDRESSES = {
    polfex: '0x3ebb53EAe7c499362055eaA65E6456193d0921Db',
    usdt: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    usdc: '0x64544969ed7EBf5f083679233325356EbE738930',

}

export default function BlockchainViewer() {
  const [address, setAddress] = useState('')
//   const [tokenAddress, setTokenAddress] = useState('')
  const [data, setData] = useState<TOKENINFO | null>(null)
  const [data2, setData2] = useState<TOKENINFO | null>(null)
  const [data3, setData3] = useState<TOKENINFO | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formattedBalanceBNB, setFormattedBalanceBNB] = useState('')
  const fetchBlockchainData = async () => {
    if (!ethers.isAddress(address)) {
      setError('Dirección inválida')
      return
    }

    try {
      setLoading(true)
      setError('')

      // Obtener saldo nativo (BNB)
      const balance = await provider.getBalance(address)
      setFormattedBalanceBNB(ethers.formatEther(balance));

      let tokenData = {}
      let tokenData2 = {}
      let tokenData3 = {}

        const pfxContract = new ethers.Contract(CONTRACT_ADDRESSES.polfex, TOKEN_ABI, provider)
        const usdtContract = new ethers.Contract(CONTRACT_ADDRESSES.usdt, TOKEN_ABI, provider)
        const usdcContract = new ethers.Contract(CONTRACT_ADDRESSES.usdc, TOKEN_ABI, provider)
        
        const [name, symbol, tokenBalance] = await Promise.all([
            pfxContract.name(),
            pfxContract.symbol(),
            pfxContract.balanceOf(address)
        ])
        const [name2, symbol2, tokenBalance2] = await Promise.all([
            usdtContract.name(),
            usdtContract.symbol(),
            usdtContract.balanceOf(address)
        ])
        const [name3, symbol3, tokenBalance3] = await Promise.all([
            usdcContract.name(),
            usdcContract.symbol(),
            usdcContract.balanceOf(address)
        ])

        tokenData = {
          tokenName: name,
          tokenSymbol: symbol,
          tokenBalance: ethers.formatUnits(tokenBalance, 'gwei')
        }
        tokenData2 = {
          tokenName: name2,
          tokenSymbol: symbol2,
          tokenBalance: ethers.formatEther(tokenBalance2)
        }
        tokenData3 = {
          tokenName: name3,
          tokenSymbol: symbol3,
          tokenBalance: ethers.formatEther(tokenBalance3)
        }
      

      setData({

        ...tokenData
      })
      setData2({

        ...tokenData2
      })
      setData3({

        ...tokenData3
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
        <CardTitle>Consulta de Saldos</CardTitle>
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
            <p className="font-medium">Saldo en BNB: {formattedBalanceBNB}</p>
            {data.tokenName && (
              <>
                <p className="font-medium">Nombre Token: {data.tokenName}</p>
                <p className="font-medium">Símbolo: {data.tokenSymbol}</p>
                <p className="font-medium">Saldo Token: {data.tokenBalance}</p>
              </>
            )}
          </div>
        )}
        {data2 && (
          <div className="space-y-2 pt-4">

            {data2.tokenName && (
              <>
                <p className="font-medium">Nombre Token: {data2.tokenName}</p>
                <p className="font-medium">Símbolo: {data2.tokenSymbol}</p>
                <p className="font-medium">Saldo Token: {data2.tokenBalance}</p>
              </>
            )}
          </div>
        )}
        {data3 && (
          <div className="space-y-2 pt-4">

            {data3.tokenName && (
              <>
                <p className="font-medium">Nombre Token: {data3.tokenName}</p>
                <p className="font-medium">Símbolo: {data3.tokenSymbol}</p>
                <p className="font-medium">Saldo Token: {data3.tokenBalance}</p>
              </>
            )}
          </div>
        )}
        
      </CardContent>
    </Card>
  )
}

