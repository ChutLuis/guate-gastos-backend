import { Controller, Get } from '@nestjs/common';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  getApiInfo() {
    return {
      name: 'GuateGastos API',
      version: '1.0.0',
      description: 'Backend API for GuateGastos - Personal Finance Management',
      endpoints: {
        auth: {
          register: 'POST /api/v1/auth/register',
          login: 'POST /api/v1/auth/login',
          refresh: 'POST /api/v1/auth/refresh',
          profile: 'GET /api/v1/auth/me',
        },
        resources: [
          'salaries',
          'expenses',
          'credit-cards',
          'transactions',
          'installments',
          'loans',
          'loan-payments',
          'remittances',
          'cash-flow-events',
          'budgets',
          'payment-reminders',
          'monthly-snapshots',
        ],
        operations: 'All resources support: GET (all & by id), POST, PATCH, DELETE',
      },
      documentation: 'All endpoints require JWT authentication except auth endpoints',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
