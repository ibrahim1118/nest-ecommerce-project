import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { find } from 'rxjs';

describe('CategoryService', () => {
    let service: CategoryService;
    let mockCategoryRepository = {
        findOne: jest.fn( (id)=> Promise.resolve({
            id: 1,
            name: 'Test Category',
            description: 'Test Description',
            createdAt: new Date(),
            updatedAt: new Date(),
        })),
        find: jest.fn( ()=> Promise.resolve([{
            id: 1,
            name: 'Test Category',
            description: 'Test Description',
            
        }])),
        save: jest.fn(),
        

    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoryService ,
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockCategoryRepository,
                },
            ],
        }).compile();

        service = module.get<CategoryService>(CategoryService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

     describe('findAll', () => {
        it('should return all categories', async () => {
            const result = await service.findAll();
            expect(mockCategoryRepository.find).toHaveBeenCalled();
            expect(mockCategoryRepository.find).toHaveBeenCalledTimes(1);
            expect(result).toMatchObject([{
                id: 1,
                name: 'Test Category',
                description: 'Test Description',
            }]);
        });
     });

     describe('findOne', () => {
        it('should return a category', async () => {
            const result = await service.findOne(1);
            expect(mockCategoryRepository.findOne).toHaveBeenCalled();
            expect(mockCategoryRepository.findOne).toHaveBeenCalledTimes(1);
            expect(result).toMatchObject({
                id: 1,
                name: 'Test Category',
                description: 'Test Description',
            });
        });
     });
});
