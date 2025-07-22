import { Test, TestingModule } from "@nestjs/testing";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";

describe('ProductController', () => {
    let controller: ProductController;
    let service: ProductService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [{
                provide: ProductService,
                useValue: {
                    findAll: jest.fn().mockImplementation(() => ({
                        products: [],
                        total: 0
                    })),
                    findOne: jest.fn(id => 
                        
                        Promise.resolve({
                        id: 1,
                        name: "Test Product",
                        price: 100,
                        description: "Test Description",
                        subCategory: { id: 1, name: "Test SubCategory" },
                        brand: { id: 1, name: "Test Brand" }
                    })),
                    create: jest.fn().mockImplementation((product) => ({
                        id: 1,
                        ...product
                    })),
                    update: jest.fn(),
                    remove: jest.fn()
                }
            }]
        }).compile();

        controller = module.get<ProductController>(ProductController);
        service = module.get<ProductService>(ProductService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of products', async () => {
            const result = await controller.findAll({});
            expect(result).toEqual({ products: [], total: 0 });
            expect(service.findAll).toHaveBeenCalled();
            expect(service.findAll).toHaveBeenCalledWith({});
            expect(service.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('findOne', () => {
        it('should return a product by id', async () => {
            const result = await controller.findOne('1');
            expect(result).toEqual({ 
                id: 1, 
                name: "Test Product", 
                price: 100, 
                description: "Test Description", 
                subCategory: { id: 1, name: "Test SubCategory" },
                brand: { id: 1, name: "Test Brand" }
            });
            expect(service.findOne).toHaveBeenCalledWith(1);
            expect(service.findOne).toHaveBeenCalledTimes(1);
        });
    });

    describe('create', () => {
        it('should create a product', async () => {
            const createProductDto: CreateProductDto = {
                name: "Test Product",
                price: 100,
                description: "Test Description",
                priceAfterDiscount: 90,
                quantity: 10,
                image: "test.jpg",
                sold: 0,
                color: ["red"],
                subCategoryId: 1,
                brandId: 1
            };
            
            const result = await controller.create(createProductDto);
            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(service.create).toHaveBeenCalled();
            expect(service.create).toHaveBeenCalledWith(createProductDto);
            expect(service.create).toHaveBeenCalledTimes(1);
        });
    });
});