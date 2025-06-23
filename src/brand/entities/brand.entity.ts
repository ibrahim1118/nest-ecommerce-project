import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { Product } from "src/product/entities/product.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("brands")
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    name: string;

    @Column()

    image: string;

    @OneToMany(() => Product, (product) => product.brand)
    products: Product[];
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
