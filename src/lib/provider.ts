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
    private contractPFX: string;
    private contractUSDT: string;
    private contractUSDC: string;

	constructor() {
		this.provider = new ethers.JsonRpcProvider(currentConfig.nodeUrl);
        this.contractPFX = currentConfig.polfexContract;
        this.contractUSDT = currentConfig.usdtContract;
        this.contractUSDC = currentConfig.usdcContract;
	}

	async balanceNativeToken(address: string): Promise<string> {
		const balance = await this.provider.getBalance(address);
		return ethers.formatEther(balance)
	}


    async pfxToken(address: string): Promise< [string, string, ethers.BigNumberish] > {

		const pfxContract =  new ethers.Contract(this.contractPFX, TOKEN_ABI, this.provider);
        const name = await pfxContract.name();

        const symbol = await pfxContract.symbol();

        const balance = await pfxContract.balanceOf(address);

        return [ name, symbol, balance];
	}

    async usdtoken(address: string): Promise<[string, string, ethers.BigNumberish] > {

		const pfxContract =  new ethers.Contract(this.contractUSDT, TOKEN_ABI, this.provider);
        const name = await pfxContract.name();
        const symbol = await pfxContract.symbol();

        const balance = await pfxContract.balanceOf(address);
        return [ name, symbol, balance];
	}

    async usdcToken(address: string): Promise<[string, string, ethers.BigNumberish] > {

		const pfxContract =  new ethers.Contract(this.contractUSDC, TOKEN_ABI, this.provider);
        const name = await pfxContract.name();

        const symbol = await pfxContract.symbol();
 
        const balance = await pfxContract.balanceOf(address);
    
        return [ name, symbol, balance];
	}

	async recoverSigner(hash: string, signature: string): Promise<string> {
	
		return ethers.recoverAddress(hash, signature)
	}
}

// Usage example:
// const web3Provider = new Web3Provider();
// const balance = await web3Provider.balanceToken('0x...');
// const contract = await web3Provider.firmaAcuerdos('0x...', GameABI.abi, signer);

export const web3Provider = new Web3Provider();