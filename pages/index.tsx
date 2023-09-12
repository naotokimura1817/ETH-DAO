import {
  ConnectWallet,
  useNetwork,
  useAddress,
  useContract,
} from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useEffect, useState, useMemo } from "react";

import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const address = useAddress();
  console.log("👋Wallet Address: ", address);

  const [network, switchNetwork] = useNetwork();

  // editionDropコントラクト（ERC-1155）を初期化
  const editionDrop = useContract(
    "0xD9A1C7BBfbd4b9ba5e4a53D799762c1F2EaDb913",
    "edition-drop"
  ).contract;

  // ERC20 トークンコントラクトの初期化
  const token = useContract(
    "0x7978E88f92190404c4708A97Ab036225226855f3",
    "token"
  ).contract;

  // ユーザがメンバーシップNFTを持っているか確認するためのStateを定義
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  // NFT をミンティングしている間を表すステートを定義
  const [isClaiming, setIsClaiming] = useState(false);

  // メンバーごとの保有しているトークン数をステートとして宣言
  const [memberTokenAmounts, setMemberTokenAmounts] = useState<any>([]);

  // DAOメンバーのアドレスをステートで宣言
  const [memberAddresses, setMemberAddresses] = useState<string[] | undefined>(
    []
  );

  // アドレスの長さを省略してくれる便利な関数
  const shortenAddress = (str: string) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // メンバーシップを保持しているメンバーの全アドレスを取得する
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // エアドロップ先のユーザを取得する
    const getAllAddress = async () => {
      try {
        const memberAddresses =
          await editionDrop?.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("🚀 Members addresses", memberAddresses);
      } catch (err) {
        console.error("Failed to get member list", err);
      }
    };
    getAllAddress();
  }, [hasClaimedNFT, editionDrop?.history]);

  // 各メンバーが保持するトークン数を取得する
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token?.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜 Amounts", amounts);
      } catch (err) {
        console.error("Failed to get member balances", err);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token?.history]);

  // memberAddressとmemberTokenAmountsを1つの配列に結合する
  const memberList = useMemo(() => {
    return memberAddresses?.map((address) => {
      const member = memberTokenAmounts?.find(
        ({ holder }: { holder: string }) => holder === address
      );

      return {
        address,
        // メンバーが見つからない場合はデフォルトで0を返す
        tokenAmount: member?.balance.displayValue || "0",
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // Walletに接続されていないなら処理しない
    if (!address) {
      return;
    }

    // ユーザがメンバーシップNFTを持っているかどうかを確認する関数を定義
    const checkBalance = async () => {
      try {
        const balance = await editionDrop!.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (err) {
        setHasClaimedNFT(false);
        console.error("Failed to get balance", err);
      }
    };

    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop!.claim("0", 1);
      console.log(
        `🌊 Successfully Minted! Check it out on etherscan: https://sepolia.etherscan.io/address/${editionDrop!.getAddress()}`
      );
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  // ウォレットと接続していなかったら接続を促す
  if (!address) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Welcome to Tokyo Sauna Collective !!</h1>
          <div className={styles.connect}>
            <ConnectWallet />
          </div>
        </main>
      </div>
    );
  }
  // テストネットが Sepolia ではなかった場合に警告を表示
  else if (address && network && network?.data?.chain?.id !== 11155111) {
    console.log("wallet address: ", address);
    console.log("network: ", network?.data?.chain?.id);

    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Sepolia に切り替えてください⚠️</h1>
          <p>この dApp は Sepolia テストネットのみで動作します。</p>
          <p>ウォレットから接続中のネットワークを切り替えてください。</p>
        </main>
      </div>
    );
  }
  // DAO ダッシュボード画面を表示
  else if (hasClaimedNFT) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>🍪DAO Member Page</h1>
          <p>Congratulations on being a member</p>
          <div>
            <div>
              <h2>Member List</h2>
              <table className="card">
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Token Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {memberList!.map((member) => {
                    return (
                      <tr key={member.address}>
                        <td>{shortenAddress(member.address)}</td>
                        <td>{member.tokenAmount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }
  // ウォレットと接続されていたら Mint ボタンを表示
  else {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>Mint your free 🍪DAO Membership NFT</h1>
          <button disabled={isClaiming} onClick={mintNft}>
            {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
          </button>
        </main>
      </div>
    );
  }
};

export default Home;
