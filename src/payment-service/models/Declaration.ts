import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

export class EntryStateEnum {
    active='active'
    deleted='deleted'
}

@Entity({name: "declarations"})
export class Declaration extends BaseEntity {
    @Column({ name: "entry_state" })
    entryState: string

    @Column({ name: "created_at" })
    createdAt: Date;

    @Column({ name: "updated_at"})
    updatedAt: Date

    @Column({ name: "expiration_date"})
    expirationDate: Date

    @PrimaryColumn({ name: "id"})
    id: string;

    @Column({ name: "magnetic_link"})
    magneticLink: string;

    @Column({ name: "payer_fingerprint"})
    payerFingerprint: string;

    @Column({ name: "value_frozen"})
    valueFrozen: number;

    @Column({ name: "available_funds"})
    availableFunds: number;
}