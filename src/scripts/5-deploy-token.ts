import { AddressZero } from "@ethersproject/constants";

import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    // ERC20のコントラクトをデプロイする
    const tokenAddress = await sdk.deployer.deployToken({
      name: "Tokyo Rock Collective Governance Token",
      symbol: "TRC",
      primary_sale_recipient: AddressZero,
    });
    console.log(
      "✅ Successfully deployed token module, address:",
      tokenAddress
    );
  } catch (err) {
    console.error("Failed to deploy token module", err);
  }
})();
