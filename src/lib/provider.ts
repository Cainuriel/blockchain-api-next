import { ethers } from 'ethers'
import currentConfig from './config/currentConfig.json'

const TOKEN_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint)",
  
  ]

  const NFT_ABI = [
    "function name() view returns (string)",
    "function priceContainer() view returns (uint)",
    "function priceCierre() view returns (uint)",
    "function balanceOf(address) view returns (uint)",
    "function tokenURI(uint) view returns (string)",
    "function getNFTsOfOwner(address) view returns (uint[])",
  
  ]

  const STAKING_ABI = [

    "function staked(address) view returns (uint)",
    "function stakedFromTs(address) view returns (uint)",
  
  ]


  const BUYPFX_ABI = [

    "function getTokenBalance() view returns (uint)",
    "function rate() view returns (uint)",
  
  ]

class Web3Provider {
	private provider: ethers.JsonRpcProvider;
  private buyPFXContract: string

	constructor() {
		this.provider = new ethers.JsonRpcProvider(currentConfig.nodeUrl);
    this.buyPFXContract = currentConfig.buyPFXContract;

	}

	async balanceNativeToken(address: string): Promise<string> {
		const balance = await this.provider.getBalance(address);
		return parseFloat(ethers.formatEther(balance)).toFixed(2);
	}

      /**
     * Retrieves the name, symbol, and balance of a specified token for a given address.
     * @param address - The address to query the token balance for.
     * @param contractToken - The contract address of the token. Defaults to the PFX token contract address.
     * @returns A promise that resolves to a tuple containing the token name, symbol, and balance.
     */
    async token(address: string, contractToken: string = currentConfig.polfexContract): Promise<[string, string, string]> {
        // console.log(`address, contractToken, `, address, contractToken, );
        const contract = new ethers.Contract(contractToken, TOKEN_ABI, this.provider);
        const name = await contract.name();
        const symbol = await contract.symbol();
        const balance = await contract.balanceOf(address);
        // console.log(`name, symbol, balance`, name, symbol, balance);
        if (contractToken === currentConfig.polfexContract) {
            return [name, symbol, parseFloat(ethers.formatUnits(balance, 'gwei')).toFixed(3)];
        }
        return [name, symbol, parseFloat(ethers.formatEther(balance)).toFixed(2)];
    }

         /**
     * Retrieves the name, price, and balance of polfex nfts collections.
     * @param address - The address to query the nft balance for.
     * @returns A promise that resolves to a tuple containing the token name, price, and balance of both nfts collections.
     */
       async nft(address: string): Promise<[string, ethers.BigNumberish, ethers.BigNumberish, string, ethers.BigNumberish,ethers.BigNumberish, ]> {
        
            const containerContract = new ethers.Contract(currentConfig.containerNFTContract, NFT_ABI, this.provider);
            const nameContainer = await containerContract.name();
            const balanceContainer = await containerContract.balanceOf(address);
            const priceContainer = await containerContract.priceContainer();
            const sealContract = new ethers.Contract(currentConfig.sealNFTContract, NFT_ABI, this.provider);
            const nameSeal = await sealContract.name();
            const balanceSeal = await sealContract.balanceOf(address);
            const priceSeal = await sealContract.priceCierre();
            console.log(`nameContainer, balanceContainer, priceContainer, nameSeal, balanceSeal, priceSeal`, nameContainer, balanceContainer, priceContainer, nameSeal, balanceSeal, priceSeal);
            return [nameContainer, balanceContainer, priceContainer, nameSeal, balanceSeal, priceSeal];
        }

            /**
     * Returns all metadatas of an user by NFT contract or the last purchased NFT metadata
     * @param address - The address to query the NFTs token URIs
     * @param contractNFT - The contract address of the NFT with a default value: container NFT contract.
     * @param lastNFT - Flag that determines if we only want the last purchased NFT
     * @returns An array with all the tokenURIs of the user's NFTs or the last tokenURI
     */
       async metadataNFTs(address: string, contractNFT: string = currentConfig.containerNFTContract, lastNFT:boolean = false): Promise<[ ]> {
        
        const contract = new ethers.Contract(contractNFT, NFT_ABI, this.provider);
        const nfts = await contract.getNFTsOfOwner(address);
        if(nfts.length === 0) return [];
        if(lastNFT){
            
            const tokenURI = await contract.tokenURI(nfts[nfts.length - 1]);
            console.log(`last nft: `, tokenURI);
            return tokenURI as [];
        } else {
      
            const tokenURIs = await Promise.all(nfts.map(async (nft:number) => await contract.tokenURI(nft)));
            console.log(`tokenURIs:`, tokenURIs);
            return tokenURIs as [];
        }

    }

    /**
     * Retrieves the address of a specified signature for a given hash.
     * @param hash - The signed hash.
     * @param signature - The signature that will be used to recover the signer against the transmitted hash.
     * @returns The signer address.
     */
	async recoverSigner(hash: string, signature: string): Promise<string> {
	
		return ethers.recoverAddress(hash, signature)
	}

        /**
           * Retrieves the rate and balance of the sender's Polfex contract.
           * @returns A promise that resolves to a tuple containing the rate and balance of PFX in the contract. The rate is the number of tokens per unit of stablecoin.
           */
        async buyPFX(): Promise<[ethers.BigNumberish, string]> {

          const contract = new ethers.Contract(this.buyPFXContract, BUYPFX_ABI, this.provider);
          const rate = await contract.rate();
          const balance = await contract.getTokenBalance();
          // console.log(`rate, balance`,rate, balance);
          return [rate, parseFloat(ethers.formatUnits(balance, 'gwei')).toFixed(3)];
      }

             /**
             * Retrieves the data from two differents contracts of staking.
             * @param address - The address to query the balance for user situation.
             * @param contractStaking - The contract address of the staking contract. Defaults the sixMonth contract.
             * @returns A promise that resolves to a tuple containing the amount staked by user: stakedUser, it is blocked the unstaking a boolean time: isTimePending, it is possible recharge, the time: rechargeTime, and the pending time to unstaking: stakingTime.
             */
            async staking(address: string, contractStaking: string = currentConfig.sixMonthContract): Promise<[string, boolean, number,  number]> {
            // tiempos para la recarga de los contratos de staking
              const timeToRecharge = [
              currentConfig.timetoRechargeSixMonth,
              currentConfig.timeToRechargeOneYear
            ]; // el tiempo pasará a dias en mainnet y serán mintuos en testnet

            const stakingContract = new ethers.Contract(contractStaking, STAKING_ABI, this.provider);
            let rechargeTime = 0
            const stakedUser = await stakingContract.staked(address);
            let stakingTime: number = 0;
            let isTimePending = false;
            

            if (stakedUser > 0) {
              const timeStamp:ethers.BigNumberish = await stakingContract.stakedFromTs(address);
              const now = Date.now();
              // Si el tiempo de recarga es de 5 minutos estamos en testnet. En caso contrario estamos en mainnet y la espera es en días.
              if(currentConfig.timetoRechargeSixMonth === 5) {
                stakingTime = Math.floor((Number(timeStamp) * 1000 - now) / 60000); // Convert BigNumber to number, then milliseconds to minutes
              } else {
                stakingTime = Math.floor((Number(timeStamp)  * 1000 - now) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
              }
           
              isTimePending = stakingTime > 0 ? true : false;
              rechargeTime = stakingTime - timeToRecharge[contractStaking === currentConfig.sixMonthContract ? 0 : 1];
              
            }
           
     
            console.log(`stakedUser, isTimePending, rechargeTime, stakingTime`, stakedUser, isTimePending, rechargeTime, stakingTime);
            return [parseFloat(ethers.formatUnits(stakedUser, 'gwei')).toFixed(3), isTimePending, rechargeTime, stakingTime];
        }
}


export const web3Provider = new Web3Provider();