import { Controller, Get, Post, Body, Patch, Put, Param, Delete, UseGuards, Query, ValidationPipe, UsePipes, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PutEmployeeSelfDto } from './dto/put-employee-self.dto';
import { PatchEmployeeSelfDto } from './dto/patch-employee-self.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ListUserDto } from './dto/list-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.Admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.Recruiter)
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() listUserDto: ListUserDto) {
    return this.usersService.findAll(listUserDto);
  }

  @Get(':id')
  @Roles(UserRole.Admin, UserRole.Recruiter)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('employee/me')
  @Roles(UserRole.Employee)
  patchEmployeeSelf(@Request() req, @Body() patchEmployeeSelfDto: PatchEmployeeSelfDto) {
    return this.usersService.patchEmployeeSelf(req.user.id, patchEmployeeSelfDto);
  }

  @Put('employee/me')
  @Roles(UserRole.Employee)
  putEmployeeSelf(@Request() req, @Body() putEmployeeSelfDto: PutEmployeeSelfDto) {
    return this.usersService.putEmployeeSelf(req.user.id, putEmployeeSelfDto);
  }

  @Patch(':id')
  @Roles(UserRole.Admin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id')
  @Roles(UserRole.Admin)
  replace(@Param('id') id: string, @Body() replaceUserDto: CreateUserDto) {
    return this.usersService.replace(id, replaceUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
