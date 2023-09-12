import sdk from "./1-initialize-sdk.js";
import { ERCTokenAddress } from "./module.js";

const token = sdk.getContract(ERCTokenAddress, "token");

(async () => {
  try {
    // 設定したい最大供給量を設定
    const amount = 1000000;
    // デプロイされたERC20コントラクトを通して、トークンをミント
    await (await token).mint(amount);
    const totalSupply = await (await token).totalSupply();

    // 現在の総トークン量を表示
    console.log(
      "✅ There now is",
      totalSupply.displayValue,
      "$TSC in circulation"
    );
  } catch (err) {
    console.error("Failed to print money", err);
  }
})();
