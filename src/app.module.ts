import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CoffeesModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: '.env', // this is the default path
      ignoreEnvFile: process.env.NODE_ENV === 'production', // ignore the .env file in production
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true, // Automatically load entities from the entities folder. This is a convenience feature, but it's not recommended in production.
        synchronize: true, // Don't use this in production! This will drop and re-create your database every time the app is restarted.
        logging: ['query'],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
