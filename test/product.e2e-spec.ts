import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Product } from '../src/product/entities/product.entity';
import { Review } from '../src/review/entities/review.entity';
import { Cart } from '../src/cart/entities/cart.entity';
import { ProductCart } from '../src/cart/entities/productCart.entity';
import { SubCategory } from '../src/sub-category/entities/sub-category.entity';
import { Brand } from '../src/brand/entities/brand.entity';
import { Category } from '../src/category/entities/category.entity';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  async function clearTables() {
    try {
      // Clear tables in correct order (children first, then parents)
      await dataSource.query('TRUNCATE TABLE "review" CASCADE');
      await dataSource.query('TRUNCATE TABLE "product_cart" CASCADE');
      await dataSource.query('TRUNCATE TABLE "cart" CASCADE');
      await dataSource.query('TRUNCATE TABLE "products" CASCADE');
      await dataSource.query('TRUNCATE TABLE "sub_category" CASCADE');
      await dataSource.query('TRUNCATE TABLE "category" CASCADE');
      await dataSource.query('TRUNCATE TABLE "brand" CASCADE');
    } catch (error) {
      console.warn('Error during table cleanup:', error.message);
    }
  }

  beforeAll(async () => {
    try {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
      
      dataSource = moduleFixture.get<DataSource>(DataSource);
      
      // Ensure database schema is created
      await dataSource.synchronize(true); // This will drop and recreate all tables
      
    } catch (error) {
      console.error('Test setup failed:', error);
      throw error;
    }
  });

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy(); // Close database connection
    }
    if (app) {
      await app.close();
    }
  });


  describe('GET /product', () => {
    beforeEach(async () => {
      // Create test data in correct order (parents first, then children)
      if (dataSource) {
        // Create Category first
        const category = await dataSource.getRepository(Category).save({
          name: 'Test Category',
          image: 'test-category.jpg'
        });

        // Create SubCategory with reference to Category
        const subCategory = await dataSource.getRepository(SubCategory).save({
          name: 'Test SubCategory',
          description: 'Test SubCategory Description',
          categoryId: category.id,
          image: 'test-subcategory.jpg'
        });

        // Create Brand
        const brand = await dataSource.getRepository(Brand).save({
          name: 'Test Brand',
          description: 'Test Brand Description',
          image: 'test-brand.jpg'
        });

        // Create Product with references to SubCategory and Brand
        await dataSource.getRepository(Product).save({
          name: 'Test Product',
          description: 'Test Description',
          price: 100,
          priceAfterDiscount: 90,
          quantity: 10,
          image: 'test-image.jpg',
          sold: 0,
          color: ['red', 'blue'],
          subCategoryId: subCategory.id,
          brandId: brand.id
        });
      }
    });

    afterEach(async () => {
      if (dataSource) {
        await clearTables();
      }
    });

    it('should return all products', async () => {
      const response = await request(app.getHttpServer()).get('/product');
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        products: expect.arrayContaining([
          expect.objectContaining({
            name: 'Test Product',
            description: 'Test Description',
            price: '100.00',
            priceAfterDiscount: '90.00',
            quantity: 10,
            image: 'test-image.jpg',
            sold: 0,
            color: ['red', 'blue']
          })
        ]),
        total: 1
      });
    });
  });
});

