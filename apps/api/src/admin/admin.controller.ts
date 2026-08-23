import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  getUsers() {
    return this.adminService.getUsers();
  }

  @Patch('users/:id/role')
  updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
    @GetUser() admin: { id: number },
  ) {
    if (id === admin.id) {
      throw new BadRequestException('You cannot change your own role.');
    }
    return this.adminService.updateUserRole(id, dto.role);
  }

  @Delete('users/:id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() admin: { id: number },
  ) {
    if (id === admin.id) {
      throw new BadRequestException('You cannot delete your own account.');
    }
    return this.adminService.deleteUser(id);
  }

  @Get('businesses')
  getBusinesses() {
    return this.adminService.getBusinesses();
  }

  @Delete('businesses/:id')
  deleteBusiness(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteBusiness(id);
  }

  @Get('reviews')
  getReviews() {
    return this.adminService.getReviews();
  }

  @Delete('reviews/:id')
  deleteReview(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deleteReview(id);
  }
}