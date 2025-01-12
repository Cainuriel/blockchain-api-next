import { ethers } from 'ethers'
import currentConfig from './config/currentConfig.json'

// Initialize provider outside component
// export const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/')
const TOKEN_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function balanceOf(address) view returns (uint)",
  
  ]
class Web3Provider {
	private provider: ethers.JsonRpcProvider;


	constructor() {
		this.provider = new ethers.JsonRpcProvider(currentConfig.nodeUrl);

	}

	async balanceNativeToken(address: string): Promise<string> {
		const balance = await this.provider.getBalance(address);
		return ethers.formatEther(balance)
	}

      /**
     * Retrieves the name, symbol, and balance of a specified token for a given address.
     * @param address - The address to query the token balance for.
     * @param contractToken - The contract address of the token. Defaults to the PFX token contract address.
     * @returns A promise that resolves to a tuple containing the token name, symbol, and balance.
     */
    async token(address: string, contractToken: string = currentConfig.polfexContract): Promise<[string, string, ethers.BigNumberish]> {
        // console.log(`address, contractToken, `, address, contractToken, );
        const contract = new ethers.Contract(contractToken, TOKEN_ABI, this.provider);
        const name = await contract.name();
        const symbol = await contract.symbol();
        const balance = await contract.balanceOf(address);
        // console.log(`name, symbol, balance`, name, symbol, balance);
        return [name, symbol, balance];
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
}

// Usage example:
// const web3Provider = new Web3Provider();
// const balance = await web3Provider.balanceToken('0x...');
// const contract = await web3Provider.firmaAcuerdos('0x...', GameABI.abi, signer);

export const web3Provider = new Web3Provider();