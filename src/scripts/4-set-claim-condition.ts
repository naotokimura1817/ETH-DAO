import { MaxUint256 } from "@ethersproject/constants";

import sdk from "./1-initialize-sdk.js";
import { editionDropAddress } from "./module.js";

const editionDrop = sdk.getContract(editionDropAddress, "edition-drop");

(async () => {
  try {
    const claimConditions = [
      {
        // いつになったらNFTのミントをできるようになるか？
        startTime: new Date(),
        // 上限となる最大供給量
        maxQuantity: 50_000,
        // NFTの価格
        price: 0,
        // 1回のトランザクションでミント出来るNFTの個数
        quantityLimitPerTransaction: 1,
        // トランザクション間の待ち時間
        // MaxUint256に設定して、1人1回しか請求できないように設定
        waitInSeconds: MaxUint256,
      },
    ];
    await (await editionDrop).claimConditions.set('0', claimConditions);
    console.log("✅ Successfully set claim condition!");
  } catch (err) {
    console.error("Failed to set claim condition", err);
  }
})();
