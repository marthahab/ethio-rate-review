import { Body, Controller, Get, Post } from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';

@Controller('businesses')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  findAll() {
    return this.businessService.findAll();
  }

  @Post()
  create(@Body() data: CreateBusinessDto) {
    return this.businessService.create(data);
  }
}
