import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("tex")
export class Tex {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    texPrice: number;

    @Column()
    shippingPrice: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
