import {
  Entity as Entity_,
  Column as Column_,
  PrimaryGeneratedColumn,
} from "typeorm";
import * as marshal from "./marshal";

@Entity_()
export class Transfer {
  constructor(props?: Partial<Transfer>) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn()
  id!: string;

  @Column_("text", { nullable: false })
  contractAddress!: string;

  @Column_("numeric", {
    transformer: marshal.bigintTransformer,
    nullable: false,
  })
  tokenId!: bigint;

  @Column_("timestamp with time zone", { nullable: false })
  blockSignedAt!: Date;

  @Column_("int4", { nullable: false })
  blockHeight!: number;

  @Column_("text", { nullable: false })
  txHash!: string;

  @Column_("bool", { nullable: true })
  successfull!: boolean | undefined | null;

  @Column_("numeric", {
    transformer: marshal.bigintTransformer,
    nullable: true,
  })
  value!: bigint | undefined | null;

  @Column_("text", { nullable: true })
  gasSpent!: string | undefined | null;

  @Column_("text", { nullable: true })
  gasPrice!: string | undefined | null;

  @Column_("text", { nullable: true })
  feesPaid!: string | undefined | null;
}
