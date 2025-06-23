import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';
import { Roles } from 'src/user/decorators/role.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles(['user','admin'])
  create(@Body() createReviewDto: CreateReviewDto , @Req() req: Request) {
    return this.reviewService.create(createReviewDto, req["user"].id);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Roles(['user','admin'])
  findAll(@Query() query: any) {
    return this.reviewService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles(['user','admin'])
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(['user','admin'])
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto , @Req() req: Request) {
    return this.reviewService.update(+id, updateReviewDto, req["user"].id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(['user','admin'])
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.reviewService.remove(+id, req["user"].id);
  }
}
