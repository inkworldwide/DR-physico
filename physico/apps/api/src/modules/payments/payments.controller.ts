import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { RoleName } from '@prisma/client';

@ApiTags('Razorpay Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Razorpay payment order server-side' })
  async createOrder(@Req() req: any, @Body() body: { amountINR: number; description?: string }) {
    return this.paymentsService.createOrder(req.user.id, body.amountINR, body.description);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Razorpay payment signature server-side' })
  async verifySignature(
    @Req() req: any,
    @Body() body: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }
  ) {
    return this.paymentsService.verifySignature(
      req.user.id,
      body.razorpayOrderId,
      body.razorpayPaymentId,
      body.razorpaySignature
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Get payment transactions log' })
  async getAllPayments() {
    return this.paymentsService.getAllPayments();
  }
}
