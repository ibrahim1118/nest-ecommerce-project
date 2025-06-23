import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("coupons")
export class Coupon {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    discount: number;

    @Column()
    expiryDate: Date;

    @CreateDateColumn()
    CreatedAt :Date

    @UpdateDateColumn()
    updateAt: Date
    
    
}
