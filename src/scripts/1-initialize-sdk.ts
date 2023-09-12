import nextEnv from "@next/env";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers";

const { loadEnvConfig } = nextEnv;
// 環境変数を読み込む
const { PRIVATE_KEY, ALCHEMY_API_URL, WALLET_ADDRESS, THIRDWEB_SECRET_KEY, THIRDWEB_CLIENT_ID } = loadEnvConfig(
  process.cwd()
).combinedEnv;

// 環境変数を取得で来ていることの確認
if (!PRIVATE_KEY || PRIVATE_KEY === "") {
  console.log("🛑 Private key not found.");
}
if (!ALCHEMY_API_URL || ALCHEMY_API_URL === "") {
  console.log("🛑 Alchemy API URL not found.");
}
if (!WALLET_ADDRESS || WALLET_ADDRESS === "") {
  console.log("🛑 Wallet Address not found.");
}

const sdk = ThirdwebSDK.fromPrivateKey(
    PRIVATE_KEY!,
    "sepolia",
    {
        clientId: THIRDWEB_CLIENT_ID,
        secretKey: THIRDWEB_SECRET_KEY
    },
);

// script実行
(async () => {
  try {
    if (!sdk || !("getSigner" in sdk)) return;
    const address = await sdk.getSigner()?.getAddress();
    console.log("SDK initialized by address: ", address);
  } catch (err) {
    console.error("Failed to get apps from the sdk", err);
    process.exit(1);
  }
})();

// 初期化した sdk を他のスクリプトで再利用できるように export
export default sdk;
