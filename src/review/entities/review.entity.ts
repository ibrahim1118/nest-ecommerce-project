import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Product } from "src/product/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  comment: string;

  @Column()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @Column()
  @IsNumber()
  productId: number;

  @Column()
  @IsString()
  userId: string;

  @ManyToOne(() => Product, (product) => product.reviews)
  @JoinColumn({ name: "productId" })
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: "userId" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
