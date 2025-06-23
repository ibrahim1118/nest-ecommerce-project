import { Coupon } from "src/coupon/entities/coupon.entity";
import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProductCart } from "./productCart.entity";

@Entity("carts")
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.carts)
    user: User;

    @Column()
    userId: string;
    @Column()
    totalprice : number

    @Column()
    totalPriceAfterDiscount : number

    @OneToMany(() => ProductCart, (productCart) => productCart.cart, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    products: ProductCart[];

    @ManyToMany(() => Coupon)
    @JoinTable({
        name: "cart_coupons",
        joinColumn: {
            name: "cartId",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "couponId",
            referencedColumnName: "id"
        }
    })
    coupons: Coupon[];
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

