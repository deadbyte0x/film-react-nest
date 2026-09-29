import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppConfigModule, AppConfig, CONFIG } from './app.config.provider';
import { join } from 'path';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    AppConfigModule,

    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [CONFIG],
      useFactory: (config: AppConfig) => {
        if (config.database.driver !== 'mongodb') {
          throw new Error(
            `Unsupported database driver: ${config.database.driver}`,
          );
        }

        return { uri: config.database.url };
      },
    }),

    ServeStaticModule.forRoot(
      {
        rootPath: join(process.cwd(), 'public'),
        serveRoot: '/',
      },
      {
        rootPath: join(process.cwd(), 'public', 'content', 'afisha'),
        serveRoot: '/',
      },
    ),

    FilmsModule,
    OrderModule,
  ],
})
export class AppModule {}
