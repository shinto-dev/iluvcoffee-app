import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CoffeesModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'pass123',
      database: 'postgres',
      autoLoadEntities: true, // Automatically load entities from the entities folder. This is a convenience feature, but it's not recommended in production.
      synchronize: true, // Don't use this in production! This will drop and re-create your database every time the app is restarted.
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
