import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums/role.enum';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface';
import { ConcertsService } from '@/concerts/concerts.service';
import { CreateConcertDto } from '@/concerts/dto/create-concert.dto';
import { ListConcertsQueryDto } from '@/concerts/dto/list-concerts-query.dto';
import {
  ConcertResponseDto,
  ConcertStatsResponseDto,
} from '@/concerts/dto/concert-response.dto';
import { PaginatedConcertsResponseDto } from '@/concerts/dto/paginated-concerts-response.dto';

@ApiTags('concerts')
@ApiBearerAuth()
@Controller('concerts')
@UseGuards(JwtAuthGuard)
export class ConcertsController {
  constructor(private readonly concertsService: ConcertsService) {}

  @Get()
  @ApiOperation({ summary: 'List concerts with pagination' })
  findPaginated(
    @Query() query: ListConcertsQueryDto,
  ): Promise<PaginatedConcertsResponseDto> {
    return this.concertsService.findPaginated(query.page, query.limit);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Aggregate stats for admin dashboard' })
  getStats(): Promise<ConcertStatsResponseDto> {
    return this.concertsService.getStats();
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new concert (admin only)' })
  create(@Body() dto: CreateConcertDto): Promise<ConcertResponseDto> {
    return this.concertsService.create(dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a concert (admin only)' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.concertsService.delete(id, user.username);
  }
}
