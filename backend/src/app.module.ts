import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppConfigModule, AppConfig, CONFIG } from './app.config.provider';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { Film } from './repository/entities/film.entity';
import { Schedule } from './repository/entities/schedule.entity';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [CONFIG],
      useFactory: (config: AppConfig) => {
        const dbUrl = new URL(config.database.url);

        return {
          type: 'postgres' as const,
          host: dbUrl.hostname,
          port: Number(dbUrl.port || 5432),
          database: dbUrl.pathname.slice(1),
          username: config.database.username,
          password: config.database.password,
          entities: [Film, Schedule],
          synchronize: false,
        };
      },
    }),
    FilmsModule,
    OrderModule,
  ],
})
export class AppModule {}
