import { ForbiddenException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private productService: ProductService,
    private userService: UserService,
  ) {}

  async create(createReviewDto: CreateReviewDto, userId: string) {
    try {
      const product = await this.productService.findOne(createReviewDto.productId);
      if (!product) {
        throw new NotFoundException("Product not found");
      }

      const user = await this.userService.findOne(userId);
      if (!user) {
        throw new NotFoundException("User not found");
      }

      const review = this.reviewRepository.create({
        ...createReviewDto,
        userId: userId,
        productId: createReviewDto.productId,
        user: user,
        product: product
      });
      
      return await this.reviewRepository.save(review);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error creating review:', error);
      throw new InternalServerErrorException('Failed to create review');
    }
  }

  async findAll(query: any) {
    const {page=1, limit=10, productId} = query;
    const queryBuilder = this.reviewRepository.createQueryBuilder("review");
    if(productId){
      queryBuilder.where("review.productId = :productId", {productId});
    }
    const [reviews, total] = await queryBuilder.skip((page - 1) * limit).take(limit).getManyAndCount();
    return {reviews, total};
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({where: {id}, relations: ["product", "user"]});
    if(!review){
      throw new NotFoundException("Review not found");
    }
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, userId: string) {
    const review = await this.reviewRepository.findOne({where: {id}, relations: ["product", "user"]});
    if(!review){
      throw new NotFoundException("Review not found");
    }
    if(review.user.id !== userId){
      throw new ForbiddenException("You are not allowed to update this review");
    }
    const updatedReview = this.reviewRepository.merge(review, updateReviewDto);
    return this.reviewRepository.save(updatedReview);
  }

  async remove(id: number, userId: string) {
    const review = await this.reviewRepository.findOne({where: {id}, relations: ["product", "user"]});
    if(!review){
      throw new NotFoundException("Review not found");
    }
    if(review.user.id !== userId){
      throw new ForbiddenException("You are not allowed to delete this review");
    }
    return this.reviewRepository.delete(id);
  }
}
