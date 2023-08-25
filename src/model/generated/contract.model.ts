import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class Contract {
    constructor(props?: Partial<Contract>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    deploymentHeight!: number

    @Index_()
    @Column_("text", {nullable: false})
    deploymentTxn!: string

    @Index_()
    @Column_("text", {nullable: false})
    address!: string

    @Column_("bool", {nullable: false})
    isAErc721Duck!: boolean
}
