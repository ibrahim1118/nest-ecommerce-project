import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("request_products")
export class RequestProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    titleNeed: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    description: string;

    @Column()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    quantity: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    category: string;

    @Column({ name: "user_id" })
    userId: string;

    @ManyToOne(() => User, (user) => user.requestProducts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "user_id" })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

