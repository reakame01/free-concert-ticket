import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@/common/enums/role.enum';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { AuthenticatedUser } from '@/common/interfaces/authenticated-user.interface';
import { ReservationsService } from './reservations.service';

@ApiTags('reservations')
@ApiBearerAuth()
@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('me')
  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @ApiOperation({ summary: 'List concert IDs the current user has reserved' })
  getMyReservations(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<string[]> {
    return this.reservationsService.getActiveReservationConcertIds(user.id);
  }

  @Post('concert/:concertId')
  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reserve a concert seat' })
  reserve(
    @Param('concertId', ParseUUIDPipe) concertId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.reservationsService.reserveConcert(
      user.id,
      user.username,
      concertId,
    );
  }

  @Delete('concert/:concertId')
  @UseGuards(RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancel an active reservation' })
  cancel(
    @Param('concertId', ParseUUIDPipe) concertId: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.reservationsService.cancelReservation(
      user.id,
      user.username,
      concertId,
    );
  }
}
