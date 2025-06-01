import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TestController } from './test/test.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/penny-auth',
      {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false, // Disable mongoose buffering
        // bufferMaxEntries option is deprecated, using bufferCommands: false is sufficient
        lazyConnection: true, // Don't connect on startup
      }
    ),
    AuthModule,
  ],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}
