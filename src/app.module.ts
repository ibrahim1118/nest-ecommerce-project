import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { SubCategory } from './sub-category/entities/sub-category.entity';
import { BrandModule } from './brand/brand.module';
import { Brand } from './brand/entities/brand.entity';
import { CouponModule } from './coupon/coupon.module';
import { Coupon } from './coupon/entities/coupon.entity';
import { SuppliersModule } from './suppliers/suppliers.module';
import { Supplier } from './suppliers/entities/supplier.entity';
import { RequestProductModule } from './request-product/request-product.module';
import { RequestProduct } from './request-product/entities/request-product.entity';
import { TexModule } from './tex/tex.module';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { ReviewModule } from './review/review.module';
import { Review } from './review/entities/review.entity';
import { CartModule } from './cart/cart.module';
import { Cart } from './cart/entities/cart.entity';
import { ProductCart } from './cart/entities/productCart.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { Tex } from './tex/entities/tex.entity';
import { UploadFileModule } from './upload-file/upload-file.module';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(process.cwd(), 'src', 'i18n'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', '123'),
        database: configService.get('DB_DATABASE', 'Ecommerce_app'),
        synchronize: true,
        entities: [
          User, Category, SubCategory, Brand, 
          Coupon, Supplier, RequestProduct, 
          Product, Review, Cart, ProductCart,
          Order, Tex
        ],
        ssl: false,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '600000s' },
    }),
    AuthModule,
    CategoryModule,
    SubCategoryModule,
    BrandModule,
    CouponModule,
    SuppliersModule,
    RequestProductModule,
    TexModule,
    ProductModule,
    ReviewModule,
    CartModule,
    OrderModule,
    UploadFileModule,
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
