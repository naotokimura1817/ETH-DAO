import { readFileSync } from "fs";

import sdk from "./1-initialize-sdk.js";
import { editionDropAddress } from "./module.js";

const editionDrop = sdk.getContract(editionDropAddress, "edition-drop");

(async () => {
  try {
    await (
      await editionDrop
    ).createBatch([
      {
        name: "Member's symbol",
        description: "Rock Collectioners にアクセスできる限定アイテムです",
        image: readFileSync('src/assets/NFT.png'),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (err) {
    console.error("failed to create the new NFT", err);
  }
})();