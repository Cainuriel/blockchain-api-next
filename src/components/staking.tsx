'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from 'lucide-react'
import { web3Provider } from '../lib/provider'
import { ethers } from 'ethers'
import { Input } from "@/components/ui/input"
import currentConfig from '../lib/config/currentConfig.json'
interface STAKINGINFO {

    stakedUser?: string
    isTimePending?: boolean
    rechargeTime?: number
    stakingTime?: number


}

export default function BlockchainViewer() {

  const [data, setData] = useState<STAKINGINFO | null>({

  }) 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [address, setAddress] = useState('')
  const [profits] = useState([currentConfig.profitPercentageSixMonth, currentConfig.profitPercentageOneYear])
  // const [metadata, setMetadata] = useState<string[]>([])

  const fetchBlockchainData = async () => {
   
    if (!ethers.isAddress(address)) {
          setError('Dirección inválida')
          return
        }
    try {
      setLoading(true)
      setError('')



      let dataFromBlockchain: STAKINGINFO = {
        stakedUser: "0",
        isTimePending: false,
        rechargeTime: 0,
        stakingTime: 0
      }


        // contrato por defecto de staking: seis meses.    
        const [stakedUser, isTimePending, rechargeTime, stakingTime] = await web3Provider.staking(address);
        console.log(`stakedUser, isTimePending, rechargeTime, stakingTime`, stakedUser, isTimePending, rechargeTime, stakingTime);


        // if (tokenUris.length > 0) {
        //   setMetadata(tokenUris);
        // }

        dataFromBlockchain = {
            stakedUser: stakedUser,
            isTimePending: isTimePending,
            rechargeTime: rechargeTime,
            stakingTime: stakingTime

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
        <CardTitle>Staking Info</CardTitle>
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
            {data.stakingTime && (
              <>
                {data.isTimePending ? (
                    <div>
                        <p className="font-medium text-green-500">Tiene Stakeada la cantidad de </p>
                        <p className="font-medium"> {data.stakedUser} PFX</p>
                        <p className="font-medium text-red-500">Podrá retirar sus PFX dentro de: {data.stakingTime} minutos</p>
                        <p className="font-medium">Su beneficio: {Number(data.stakedUser) * profits[0]} PFX</p>
                        <p className="font-medium">Recibirá: {Number(data.stakedUser) + Number(data.stakedUser) * profits[0]} PFX</p>
                    </div>
                ) : (
                    <div>
                        <p className="font-medium text-yellow-500">Es posible desbloquear sus PFX:</p>
                        <p className="font-medium">Su beneficio: {Number(data.stakedUser) * profits[0]} PFX</p>
                        <p className="font-medium">Recibirá: {Number(data.stakedUser) + Number(data.stakedUser) * profits[0]} PFX</p>
               
                    </div>
                )}

                {(data.rechargeTime ?? 0) > 0 ? (
                    <div>
                        <p className="font-medium text-green-500">Aun puede recargar más PFX</p>
                        <p className="font-medium text-red-500">Tiempo restante para recargar: {data.rechargeTime} minutos</p>
                    </div>
                ) : (
                    <div>
                        <p className="font-medium text-red-500">Su tiempo de recarga ha expirado</p>
                    </div>
                )}
              </>
            )}
          </div>
          
        )}
     
        
      </CardContent>

    </Card>
    
  )
}
