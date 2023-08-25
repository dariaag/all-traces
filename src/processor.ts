import { lookupArchive } from "@subsquid/archive-registry";
import {
  BlockHeader,
  DataHandlerContext,
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  Log as _Log,
  Transaction as _Transaction,
} from "@subsquid/evm-processor";
import * as erc721 from "./abi/erc721";

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive("eth-mainnet"),
    chain: "https://rpc.ankr.com/eth",
  })

  .addTrace({
    type: ["create", "call", "suicide", "reward"],
    transaction: true,
  })
  .setFinalityConfirmation(75)
  //.setBlockRange({ from: 11020125 })

  .setFields({
    trace: {
      subtraces: true,
      //create

      createFrom: true,
      createValue: true,
      createGas: true,
      createInit: true,
      createResultCode: true,
      createResultAddress: true,
      //call
      callFrom: true,
      callTo: true,
      callValue: true,
      callGas: true,
      callSighash: true,
      callInput: true,
      callResultGasUsed: true,
      callResultOutput: true,
      //suicide
      suicideAddress: true,
      suicideRefundAddress: true,
      suicideBalance: true,
      //reward
      rewardAuthor: true,
      rewardValue: true,
      rewardType: true,
    },
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
