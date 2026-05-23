import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums/role.enum';
import { Roles } from '@/common/decorators/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { ListHistoryQueryDto } from '@/history/dto/list-history-query.dto';
import { PaginatedHistoryResponseDto } from '@/history/dto/paginated-history-response.dto';
import { HistoryService } from '@/history/history.service';

@ApiTags('history')
@ApiBearerAuth()
@Controller('history')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get()
  @ApiOperation({ summary: 'List reservation history with pagination (admin only)' })
  findPaginated(
    @Query() query: ListHistoryQueryDto,
  ): Promise<PaginatedHistoryResponseDto> {
    return this.historyService.findPaginated(query.page, query.limit);
  }
}
