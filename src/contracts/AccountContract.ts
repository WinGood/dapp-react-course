import {
  Address,
  Cell,
  Contract,
  ContractProvider,
  SendMode,
  Sender,
  beginCell,
  contractAddress,
  toNano,
} from 'ton-core';

export interface Config {
  ownerAddress: Address;
}

export enum OperationCode {
  Deploy = 1,
  Deposit = 2,
  Withdraw = 3,
}

export class AccountContract implements Contract {
  static MIN_GAS_AMOUNT = toNano('0.02');

  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromConfig(config: Config, code: Cell) {
    const data = beginCell().storeAddress(config.ownerAddress).endCell();
    const init = {
      data,
      code,
    };

    return new AccountContract(contractAddress(0, init), init);
  }

  async sendDeploy(provider: ContractProvider, sender: Sender) {
    await provider.internal(sender, {
      value: AccountContract.MIN_GAS_AMOUNT,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(OperationCode.Deploy, 32).endCell(),
    });
  }

  async sendDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(OperationCode.Deposit, 32).endCell(),
    });
  }

  async sendWithdraw(provider: ContractProvider, sender: Sender, value: bigint) {
    await provider.internal(sender, {
      value: AccountContract.MIN_GAS_AMOUNT,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(OperationCode.Withdraw, 32).storeCoins(value).endCell(),
    });
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get('balance', []);
    return stack.readNumber();
  }

  async getContractData(provider: ContractProvider) {
    const { stack } = await provider.get('get_contract_storage_data', []);
    return {
      owner_address: stack.readAddress(),
    };
  }
}
