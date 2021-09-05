import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";


@Entity({name: "redeems"})
export class Redeem extends BaseEntity {
    @Column({ name: "entry_state" })
    entryState: string

    @Column({ name: "redeemed_at" })
    redeemedAt: Date;

    @Column({ name: "updated_at" })
    updatedAt: Date;

    @PrimaryColumn({ name: "id"})
    id: string;

    @Column({ name: "declaration_id"})
    declarationId: string;

    @Column({ name: "redeemer"})
    redeemer: string;

    @Column({ name: "last_hash_index"})
    lastHashIndex: number;

    @Column({ name: "last_hash"})
    lastHash: string;
}