import fs from "fs";
import {
  createSignerFromKeypair,
  keypairIdentity,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createV1,
  mplTokenMetadata,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";

const RPC_URL = "https://api.mainnet-beta.solana.com";
const MINT = publicKey("B8kjzrZJkwNryARFBEKmUEHWCywwgnzZF2NJdTgZuyqf");
const URI = "https://drslushii3-ops.github.io/assets/grind-token-metadata.json";

// Uses your Solana CLI wallet file.
// Change this path only if your wallet json lives somewhere else.
const keypairPath = `${process.env.HOME}/.config/solana/id.json`;
const secretKey = new Uint8Array(
  JSON.parse(fs.readFileSync(keypairPath, "utf8"))
);

const umi = createUmi(RPC_URL).use(mplTokenMetadata());

const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
const signer = createSignerFromKeypair(umi, keypair);
umi.use(keypairIdentity(signer));

async function main() {
  const tx = await createV1(umi, {
    mint: MINT,
    authority: signer,
    payer: signer,
    updateAuthority: signer,
    name: "GRIND",
    symbol: "GRIND",
    uri: URI,
    sellerFeeBasisPoints: percentAmount(0),
    tokenStandard: TokenStandard.Fungible,
  }).sendAndConfirm(umi);

  console.log("Metadata attached.");
  console.log(
    `Explorer tx: https://explorer.solana.com/tx/${tx.signature}?cluster=mainnet-beta`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
