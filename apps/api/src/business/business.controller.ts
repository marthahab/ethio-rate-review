import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';

@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

 @Get()
findAll(
  @Query('search') search?: string,
  @Query('city') city?: string,
  @Query('category') category?: string,
  @Query('page') page = '1',
 @Query('limit') limit = '10',
@Query('sort') sort = 'rating',
) {
  return this.businessService.findAll(
    search,
    city,
    category,
    Number(page),
    Number(limit),
    sort,
  );
}
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.businessService.findOne(id);
  }

  @Post()
create(@Body() dto: CreateBusinessDto) {
  return this.businessService.create(dto);
}
}