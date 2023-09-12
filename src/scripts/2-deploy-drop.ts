import { AddressZero } from '@ethersproject/constants';
import { readFileSync } from 'fs';

import sdk from './1-initialize-sdk.js';

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      // NFTコレクションの名前（DAOの名前）
      name: "Tokyo Rock Collective",
      // NFTコレクションの説明
      description: "A DAO for rock collecters in Tokyo",
      // NFTコレクションのアイコン画像
      image: readFileSync("src/assets/rock.jpg"),
      // NFTの販売による収益を受け取るアドレス
      primary_sale_recipient: AddressZero,
    });

    // 初期化し、返ってきた editionDrop コントラクトのアドレスから editionDrop を取得
    const editionDrop = sdk.getContract(editionDropAddress, 'edition-drop');

    // メタデータを取得
    const metadata = await (await editionDrop).metadata.get();

    // editionDrop コントラクトのアドレスを出力
    console.log(
      '✅ Successfully deployed editionDrop contract, address:',
      editionDropAddress
    );

    // editionDrop コントラクトのメタデータを出力
    console.log('✅ editionDrop metadata:', metadata);
  } catch (error) {
    // エラーをキャッチしたら出力
    console.log('failed to deploy editionDrop contract', error);
  }
})();