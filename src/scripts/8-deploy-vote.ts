import sdk from "./1-initialize-sdk.js";
import { ERCTokenAddress } from "./module.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      // ガバナンス用のコントラクト名
      name: "Rock Collecters DAO",
      // ERC20トークンコントラクトのアドレスを設定
      voting_token_address: ERCTokenAddress,
      // 以下の 2 つのパラメータはブロックチェーンのブロック数を指定します（Ethereum の場合、ブロックタイムを 13-14 秒と仮定）
      // 提案が作成された後、メンバーがすぐに投票できるよう 0 ブロックを設定する
      voting_delay_in_blocks: 0,
      // 提案が作成された後、メンバーが投票できる期間を1日（6570ブロック）に設定
      voting_period_in_blocks: 6570,
      // 提案が作成された後、提案が有効となるために投票する必要のあるトークンの総供給量の最小値を0%に設定
      voting_quorum_fraction: 0,
      // ユーザが提案するために必要なトークンの最小値を0に設定
      proposal_token_threshold: 0,
    });

    console.log(
      "✅ Successfully deployed vote contract, address:",
      voteContractAddress
    );
  } catch (err) {
    console.error("Failed to deploy vote contract", err);
  }
})();
