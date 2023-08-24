module.exports = class Data1692106059829 {
    name = 'Data1692106059829'

    async up(db) {
        await db.query(`CREATE TABLE "contract" ("id" character varying NOT NULL, "deployment_height" integer NOT NULL, "deployment_txn" text NOT NULL, "address" text NOT NULL, "is_a_erc721_duck" boolean NOT NULL, CONSTRAINT "PK_17c3a89f58a2997276084e706e8" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_a7b1ff78eca9d3133d56e23cb6" ON "contract" ("deployment_height") `)
        await db.query(`CREATE INDEX "IDX_0c27ff4379e363a83d1f601ea8" ON "contract" ("deployment_txn") `)
        await db.query(`CREATE INDEX "IDX_4bbe5fb40812718baf74cc9a79" ON "contract" ("address") `)
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "contract_address" text NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "token_id" numeric NOT NULL, "block_signed_at" TIMESTAMP WITH TIME ZONE NOT NULL, "block_height" integer NOT NULL, "tx_hash" text NOT NULL, "successfull" boolean, "value" numeric, "gas_spent" text, "gas_price" text, "fees_paid" text, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "contract"`)
        await db.query(`DROP INDEX "public"."IDX_a7b1ff78eca9d3133d56e23cb6"`)
        await db.query(`DROP INDEX "public"."IDX_0c27ff4379e363a83d1f601ea8"`)
        await db.query(`DROP INDEX "public"."IDX_4bbe5fb40812718baf74cc9a79"`)
        await db.query(`DROP TABLE "transfer"`)
    }
}
