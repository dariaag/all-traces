import { TypeormDatabase } from "@subsquid/typeorm-store";
import { Contract, Transfer } from "./model";
import { processor } from "./processor";
import * as AWS from "aws-sdk";
import { ParquetReader } from "parquetjs";
import { isErc721 } from "./isErc721";
import * as erc721 from "./abi/erc721";
import { Database } from "@subsquid/file-store";
import { S3Dest } from "@subsquid/file-store-s3";
import {
  Column,
  Table,
  Compression,
  Types,
} from "@subsquid/file-store-parquet";

import axios from "axios";

// Create an S3 instance
// add file writer
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { ContractTransactionResponse } from "ethers";
import { create } from "domain";
var fs = require("fs");

const dbOptions = {
  tables: {
    CreateTracesTable: new Table(
      "createTraces.parquet",
      {
        blockHeight: Column(Types.Uint64()),
        txHash: Column(Types.String()),
        type: Column(Types.String()),
        subtraces: Column(Types.Uint64()),
        //create

        createFrom: Column(Types.String()),
        createValue: Column(Types.String()),
        createGas: Column(Types.String()),
        createInit: Column(Types.String()),
        createResultCode: Column(Types.String()),
        createResultAddress: Column(Types.String()),
      },
      {
        compression: "GZIP",
        rowGroupSize: 300000,
        pageSize: 1000,
      }
    ),
    CallTracesTable: new Table(
      "callTraces.parquet",
      {
        blockHeight: Column(Types.Uint64()),
        txHash: Column(Types.String()),
        type: Column(Types.String()),
        subtraces: Column(Types.Uint64()),
        callFrom: Column(Types.String()),
        callTo: Column(Types.String()),
        callValue: Column(Types.String()),
        callGas: Column(Types.String()),
        callSighash: Column(Types.String()),
        callInput: Column(Types.String()),
        callResultGasUsed: Column(Types.String()),
        callResultOutput: Column(Types.String()),
      },
      {
        compression: "GZIP",
        rowGroupSize: 300000,
        pageSize: 1000,
      }
    ),
    RewardTracesTable: new Table(
      "rewardTraces.parquet",
      {
        blockHeight: Column(Types.Uint64()),
        txHash: Column(Types.String()),
        type: Column(Types.String()),
        subtraces: Column(Types.Uint64()),
        rewardAuthor: Column(Types.String()),
        rewardValue: Column(Types.String()),
        rewardType: Column(Types.String()),
      },
      {
        compression: "GZIP",
        rowGroupSize: 300000,
        pageSize: 1000,
      }
    ),
    SuicideTracesTable: new Table(
      "suicideTraces.parquet",
      {
        blockHeight: Column(Types.Uint64()),
        txHash: Column(Types.String()),
        type: Column(Types.String()),
        subtraces: Column(Types.Uint64()),
        suicideAddress: Column(Types.String()),
        suicideRefundAddress: Column(Types.String()),
        suicideBalance: Column(Types.String()),
      },
      {
        compression: "GZIP",
        rowGroupSize: 300000,
        pageSize: 1000,
      }
    ),
  },
  dest: new S3Dest(
    "./",
    "benchmark-traces-v3", //assertNotNull(process.env.S3_BUCKET_NAME),
    {
      region: "us-east-1",

      endpoint: "",
      credentials: {
        accessKeyId: "", //accessKeyId: assertNotNull(process.env.S3_ACCESS_KEY_ID),
        secretAccessKey: "", // secretAccessKey: assertNotNull(process.env.S3_SECRET_ACCESS_KEY)
      },
    }
  ),
  chunkSizeMb: 10,
};

processor.run(new Database(dbOptions), async (ctx) => {
  let createTraceArray = [];
  let callTraceArray = [];
  let rewardTraceArray = [];
  let suicideTraceArray = [];
  for (let block of ctx.blocks) {
    const blockHeight = Number(block.header.height);

    for (let trc of block.traces) {
      if (!trc.transaction) {
        ctx.log.info("no transaction");
      } else {
        let txHash = trc.transaction.hash;
        let type = trc.type.toString();
        let subtraces = Number(trc.subtraces);

        if (trc.type === "create") {
          let createFrom = trc.action.from;
          let createValue = String(trc.action.value);
          let createGas = String(trc.action.gas);
          let createInit = trc.action.init;
          let createResultCode = "";
          let createResultAddress = "";
          if (trc.result) {
            createResultCode = trc.result.code;
            createResultAddress = trc.result.address || "";
          }
          createTraceArray.push({
            blockHeight: blockHeight,
            txHash: txHash,
            type: type,
            subtraces: subtraces,

            createFrom: createFrom,
            createValue: createValue,
            createGas: createGas,
            createInit: createInit,
            createResultCode: createResultCode,
            createResultAddress: createResultAddress,
          });
        }
        if (trc.type === "call") {
          let callFrom = trc.action.from;
          let callTo = trc.action.to;
          let callValue = String(trc.action.value);
          let callGas = String(trc.action.gas);
          let callSighash = trc.action.sighash || "";
          let callInput = trc.action.input;
          let gas_used = "";
          let call_output = "";
          if (trc.result) {
            gas_used = String(trc.result.gasUsed);
            call_output = trc.result.output;
          }
          callTraceArray.push({
            blockHeight: blockHeight,
            txHash: txHash,
            type: type,
            subtraces: subtraces,
            callFrom: callFrom,
            callTo: callTo,
            callValue: callValue,
            callGas: callGas,
            callSighash: callSighash,
            callInput: callInput,
            callResultGasUsed: gas_used,
            callResultOutput: call_output,
          });
        }
        if (trc.type === "reward") {
          let rewardAuthor = trc.action.author;
          let rewardValue = String(trc.action.value);
          let rewardType = trc.action.type;
          rewardTraceArray.push({
            blockHeight: blockHeight,
            txHash: txHash,
            type: type,
            subtraces: subtraces,
            rewardAuthor: rewardAuthor,
            rewardValue: rewardValue,
            rewardType: rewardType,
          });
        }
        if (trc.type === "suicide") {
          let suicideAddress = trc.action.address;
          let suicideRefundAddress = trc.action.refundAddress;
          let suicideBalance = String(trc.action.balance);
          suicideTraceArray.push({
            blockHeight: blockHeight,
            txHash: txHash,
            type: type,
            subtraces: subtraces,
            suicideAddress: suicideAddress,
            suicideRefundAddress: suicideRefundAddress,
            suicideBalance: suicideBalance,
          });
        }
      }
    }
  }
  ctx.store.CreateTracesTable.writeMany(createTraceArray);
  ctx.store.CallTracesTable.writeMany(callTraceArray);
  ctx.store.RewardTracesTable.writeMany(rewardTraceArray);
  ctx.store.SuicideTracesTable.writeMany(suicideTraceArray);
});
