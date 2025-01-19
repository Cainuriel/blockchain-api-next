import React, { useEffect, useState } from 'react';

interface NFTMetadata {
    name: string;
    image: string;
    attributes: { trait_type: string; value: string }[];
}

interface RenderNFTsProps {
    tokensUris: string[];
}

const RenderNFTs: React.FC<RenderNFTsProps> = ({ tokensUris }) => {
    const [nfts, setNfts] = useState<NFTMetadata[]>([]);

    useEffect(() => {
        const fetchNFTs = async () => {
            const fetchedNFTs = await Promise.all(
                tokensUris.map(async (uri) => {
                    const response = await fetch(uri);
                    const metadata = await response.json();
                    return metadata;
                })
            );
            setNfts(fetchedNFTs);
        };

        fetchNFTs();
    }, [tokensUris]);

    return (
        <div>
            {nfts.map((nft, index) => (
                <div key={index} className="nft-card">
                    <img src={nft.image} alt={nft.name} className="nft-image" />
                    <h2>{nft.name}</h2>
                    <ul>
                        {nft.attributes.map((attribute, idx) => (
                            <li key={idx}>
                                {attribute.trait_type}: {attribute.value}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default RenderNFTs;