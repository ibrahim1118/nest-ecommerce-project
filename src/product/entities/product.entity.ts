import { Brand } from "src/brand/entities/brand.entity";
import { ProductCart } from "src/cart/entities/productCart.entity";
import { Review } from "src/review/entities/review.entity";
import { SubCategory } from "src/sub-category/entities/sub-category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("products")
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    priceAfterDiscount: number;
    @Column()
    quantity: number;

    @Column()
    image: string;

    @Column({ default: 0 })
    sold: number;

    @Column('text', { array: true })
    color: string[];

    @ManyToOne(() => SubCategory, (subCategories) => subCategories.products)
    @JoinColumn({name: "subCategoryId"})
    subCategory: SubCategory;

    @Column()
    subCategoryId: number;

    @ManyToOne(() => Brand, (brand) => brand.products)
    @JoinColumn({name: "brandId"})
    brand: Brand;

    @OneToMany(() => Review, (review) => review.product)
    reviews: Review[];

    @OneToMany(()=>ProductCart , (ProductCard)=>ProductCard.product)
    carts: ProductCart[];

    @Column()
    brandId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
