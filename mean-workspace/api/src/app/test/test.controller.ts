import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  getTest() {
    return {
      message: 'NestJS API is running successfully!',
      timestamp: new Date().toISOString(),
      status: 'healthy'
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
  }
}