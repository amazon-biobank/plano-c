import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";


@Entity({name: "users"})
export class User extends BaseEntity {
    @Column({ name: "entry_state" })
    entryState: string

    @Column({ name: "created_at" })
    createdAt: Date;

    @Column({ name: "updated_at"})
    updatedAt: Date

    @PrimaryColumn({ name: "id"})
    id: string;

    @Column({ name: "username"})
    username: string;

    @Column({ name: "balance"})
    balance: number;

    @Column({ name: "public_key"})
    publicKey: string;
}