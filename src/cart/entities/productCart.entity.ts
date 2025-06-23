import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "src/product/entities/product.entity";

@Entity("product_cart")
export class ProductCart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.products, {
    onDelete: 'CASCADE'
  })
  cart: Cart;

  @Column()
  cartId: number;

  @ManyToOne(() => Product, (product) => product.carts)
  product: Product;

  @Column()
  productId: number;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceAfterDiscount: number;
}