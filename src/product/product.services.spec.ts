import { getRepositoryToken } from "@nestjs/typeorm";
import { ProductService } from "./product.service";
import { Test, TestingModule } from "@nestjs/testing";
import { Product } from "./entities/product.entity";
import { SubCategoryService } from "../sub-category/sub-category.service";
import { BrandService } from "../brand/brand.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { NotFoundException } from "@nestjs/common";

describe('ProductService', () => {
    let productService: ProductService;
    let productRepository: any;
    let subCategoryService: SubCategoryService;
    let brandService: BrandService;
    let mockQueryBuilder: any;

    beforeEach(async () => {
        mockQueryBuilder = {
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn().mockResolvedValue([[
                {
                    id: 1,
                    name: "Test Product",
                    price: 100,
                    description: "Test Description"
                }
            ], 1])
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: getRepositoryToken(Product),
                    useValue: {
                        create: jest.fn(dto => ({
                            id: 1,
                            ...dto
                        })),
                        save: jest.fn(product => Promise.resolve({
                            id: 1,
                            ...product
                        })),
                        createQueryBuilder: jest.fn(() => mockQueryBuilder),
                        findOne: jest.fn(({ where: { id }, relations }) => {
                            if (id === 1) {
                                return Promise.resolve({
                                    id: 1,
                                    name: "Test Product",
                                    price: 100,
                                    description: "Test Description",
                                    subCategory: { id: 1, name: "Test SubCategory" },
                                    brand: { id: 1, name: "Test Brand" }
                                });
                            }
                            return Promise.resolve(null);
                        })
                    },
                },
                {
                    provide: SubCategoryService,
                    useValue: {
                        findOne: jest.fn(id => Promise.resolve({
                            id: 1,
                            name: "Test SubCategory",
                        })),
                    },
                },
                {
                    provide: BrandService,
                    useValue: {
                        findOne: jest.fn(id => Promise.resolve({
                            id: 1,
                            name: "Test Brand",
                        })),
                    },
                },
            ],
        }).compile();

        productService = module.get<ProductService>(ProductService);
        productRepository = module.get(getRepositoryToken(Product));
        subCategoryService = module.get<SubCategoryService>(SubCategoryService);
        brandService = module.get<BrandService>(BrandService);
    });

    it('should be defined', () => {
        expect(productService).toBeDefined();
    });

    describe('create', () => {
        it('should successfully create a product', async () => {
            const createProductDto: CreateProductDto = {
                name: "Test Product",
                price: 100,
                description: "Test Description",
                priceAfterDiscount: 90,
                quantity: 10,
                image: "test.jpg",
                sold: 0,
                color: ["red", "blue"],
                subCategoryId: 1,
                brandId: 1
            };

            const result = await productService.create(createProductDto);

            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(result.name).toBe(createProductDto.name);
            expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
            expect(productRepository.save).toHaveBeenCalled();
            expect(productRepository.save).toHaveBeenCalledTimes(1);
            expect(subCategoryService.findOne).toHaveBeenCalledWith(createProductDto.subCategoryId);
            expect(brandService.findOne).toHaveBeenCalledWith(createProductDto.brandId);
        });
    });

    describe('findAll', () => {
        it('should return all products with pagination', async () => {
            const query = {
                page: 1,
                limit: 10,
                sort: "ASC"
            };

            const result = await productService.findAll(query);

            expect(result).toBeDefined();
            expect(result.products).toBeInstanceOf(Array);
            expect(result.total).toBe(1);
            expect(productRepository.createQueryBuilder).toHaveBeenCalledWith("product");
            expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
            expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
            expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith("product.price", "ASC");
        });

        it('should handle search parameter', async () => {
            const searchTerm = "test";
            const query = {
                page: 1,
                limit: 10,
                sort: "ASC",
                search: searchTerm
            };

            await productService.findAll(query);

            expect(mockQueryBuilder.where).toHaveBeenCalledWith(
                "product.name LIKE :search",
                { search: `%${searchTerm}%` }
            );
        });
    });

    describe('findOne', () => {
        it('should return a product by id', async () => {
            const id = 1;
            const result = await productService.findOne(id);
            
            expect(result).toBeDefined();
            expect(result.id).toBe(id);
            expect(result.name).toBe("Test Product");
            expect(result.subCategory).toBeDefined();
            expect(result.brand).toBeDefined();
            expect(productRepository.findOne).toHaveBeenCalledWith({
                where: { id },
                relations: ["subCategory", "brand"]
            });
        });

        it('should throw NotFoundException when product not found', async () => {
            const id = 999;
            
            await expect(productService.findOne(id)).rejects.toThrow(NotFoundException);
            expect(productRepository.findOne).toHaveBeenCalledWith({
                where: { id },
                relations: ["subCategory", "brand"]
            });
        });
    });
});