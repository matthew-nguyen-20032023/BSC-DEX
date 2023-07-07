import axios from "axios";
import {
  BACKEND_URL,
  CONFIG_STAKE,
  CREATE_NEW_NFT_TYPE,
  EXPORT_PRIVATE_KEY,
  GET_CONFIG_STAKE,
  GET_NFT_CREATED,
  GET_TRANSACTION,
  GET_WALLET_INFORMATION,
  LIST_NFT_COLLECTION,
  LOGIN_API,
  MINT_NFT,
  MY_NFT,
  RANDOM_IMAGE,
  REGISTER_API,
  REGISTER_NFT,
  STAKE_NFT,
  UN_STAKE_NFT,
  UPDATE_NFT,
} from "@/services/config";

export async function serviceLogin(email, password) {
  return axios.post(`${BACKEND_URL}/${LOGIN_API}`, {
    email: email,
    password: password,
  });
}

export async function serviceRegister(email, password, role) {
  return axios.post(`${BACKEND_URL}/${REGISTER_API}`, {
    email: email,
    password: password,
    role: role,
  });
}

export async function listNFTCollections(page, limit) {
  return axios.get(
    `${BACKEND_URL}/${LIST_NFT_COLLECTION}?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
}

export async function createNewNFTType(
  nftType,
  nftName,
  nftSymbol,
  tier,
  defaultBalance
) {
  return axios.post(
    `${BACKEND_URL}/${CREATE_NEW_NFT_TYPE}`,
    {
      nftType,
      nftName,
      nftSymbol,
      tier,
      defaultBalance,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
}

export async function mintNFT(
  receiverEmail,
  nftTypeId,
  ipfs,
  tier,
  balance,
  description
) {
  return axios.post(
    `${BACKEND_URL}/${MINT_NFT}`,
    {
      receiverEmail,
      nftTypeId,
      ipfs,
      tier,
      balance,
      description,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
}

export async function getTransaction(page, limit) {
  return axios.get(
    `${BACKEND_URL}/${GET_TRANSACTION}?page=${page}&limit=${limit}`
  );
}

export async function randomImage() {
  return axios.get(`${RANDOM_IMAGE}`);
}

export async function configStake(
  stakeType,
  duration,
  rewardBalance,
  penaltyBalance
) {
  return axios.post(
    `${BACKEND_URL}/${CONFIG_STAKE}`,
    {
      stakeType,
      duration,
      rewardBalance,
      penaltyBalance,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
}

export async function getConfigStakeRule(page, limit) {
  return axios.get(
    `${BACKEND_URL}/${GET_CONFIG_STAKE}?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
}

export async function getNftCreated(page, limit) {
  return axios.get(
    `${BACKEND_URL}/${GET_NFT_CREATED}?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
}

export async function getWalletInformation() {
  return axios.get(`${BACKEND_URL}/${GET_WALLET_INFORMATION}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export async function exportPrivateKey() {
  return axios.get(`${BACKEND_URL}/${EXPORT_PRIVATE_KEY}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export async function myNft(page, limit, nftTypes) {
  let query = `${BACKEND_URL}/${MY_NFT}?page=${page}&limit=${limit}`;
  for (const index in nftTypes) {
    if (!nftTypes[index]) continue;
    query += `&nftTypes[${index}]=${nftTypes[index]}`;
  }
  return axios.get(query, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
}

export async function stakeNFT(stakeType, nftId) {
  return axios.post(
    `${BACKEND_URL}/${STAKE_NFT}`,
    {
      stakeType,
      nftId,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
}

export async function unStakeNFT(nftId) {
  return axios.post(
    `${BACKEND_URL}/${UN_STAKE_NFT}`,
    {
      nftId,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
}

export async function registerNFTCollection(nftTypeId) {
  return axios.post(
    `${BACKEND_URL}/${REGISTER_NFT}`,
    {
      nftTypeId,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
}

export async function updateNFT(nftId, ipfs, tier, balance) {
  return axios.post(
    `${BACKEND_URL}/${UPDATE_NFT}`,
    {
      nftId,
      ipfs,
      tier,
      balance,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
}
