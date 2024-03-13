import { useEffect, useState } from 'react';
import { Address, OpenedContract } from 'ton-core';
import { AccountContract } from '../contracts/AccountContract';
import { useAsyncInitialize } from './useAsyncInitialize';
import { useTonClient } from './useTonClient';
import { useTonConnect } from './useTonConnect';

export function useAccountContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();
  const [contractData, setContractData] = useState<null | {
    owner_address: Address;
    balance: number;
  }>();

  const accountContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new AccountContract(Address.parse('kQBslNZ9DUGXqXmenicj1_y9RMqXg6sYxPHVcsW-HcP2YhfK'));
    return client.open(contract) as OpenedContract<AccountContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!accountContract) return;
      setContractData(null);
      const data = await accountContract.getContractData();
      const balance = await accountContract.getBalance();
      setContractData({
        owner_address: data.owner_address,
        balance,
      });
    }
    getValue();
  }, [accountContract]);

  return {
    contract_address: accountContract?.address.toString(),
    sendDeposit: async (amount: bigint) => accountContract?.sendDeposit(sender, amount),
    ...contractData,
  };
}
