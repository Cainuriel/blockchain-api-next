'use client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'
import { web3Provider } from '../lib/provider'


export default function BlockchainViewer() {
  const [address, setAddress] = useState('')

  const [hash, setHash] = useState('')
  const [signature, setSignature] = useState('')
  const [result, setResult] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchBlockchainData = async () => {
    if (!ethers.isAddress(address)) {
      setError('Dirección inválida')
      return
    }

    try {
      setLoading(true);
      setError('');
      setResult( await web3Provider.recoverSigner(hash, signature));
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error: ${err.message}`)
      } else {
        setError('Error al comprobar la firma')
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Comprobar firmante</CardTitle>
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

        <div className="space-y-2">
          <label className="text-sm font-medium">hash</label>
          <Input
            placeholder="0x..."
            value={hash}
            onChange={(e) => setHash(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">signature</label>
          <Input
            placeholder="0x..."
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />
        </div>
        

        <Button 
          onClick={fetchBlockchainData}
          disabled={loading || !signature}
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

        {result && (
          <div className="space-y-2 pt-4">
       
              <>
                <p className="font-medium">Firmante: {result}</p>
 
            {result.toLowerCase() === address.toLowerCase() ? (
                <Alert variant="default">
                    <AlertDescription className="text-green-500">Firmante verificado</AlertDescription>
                </Alert>
            ) : (
                <Alert variant="destructive">
                    <AlertDescription className="text-red-500">No coincide el firmante</AlertDescription>
                </Alert>
            )}
              </>
      
          </div>
        )}
 
        
      </CardContent>
    </Card>
  )
}

