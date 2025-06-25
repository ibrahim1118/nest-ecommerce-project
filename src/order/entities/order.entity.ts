import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { PaymentMethod } from '../enums/payment.method.enum';
import { Cart } from 'src/cart/entities/cart.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPriceAfterDiscount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  shippingPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column()
  shippingAddress: string;

  @Column({ type: 'enum', enum: PaymentMethod, default: PaymentMethod.CASH })
  paymentMethod: PaymentMethod;

  @Column({ nullable: true })
  trackingNumber: string;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Cart, cart => cart.orders)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @Column()
  cartId: number;

  @Column()
  userId: string;

  @Column()
  isPaid: boolean;

  @Column()
  isShipped: boolean;
  

  @Column()
  isDelivered: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
