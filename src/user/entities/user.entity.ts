import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { RequestProduct } from 'src/request-product/entities/request-product.entity';
import { Review } from 'src/review/entities/review.entity';
import { Cart } from 'src/cart/entities/cart.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  address?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RequestProduct, (requestProduct) => requestProduct.user)
  requestProducts: RequestProduct[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

   @OneToMany(()=>Cart , (cart)=>cart.user)
   carts : Cart[]
}
