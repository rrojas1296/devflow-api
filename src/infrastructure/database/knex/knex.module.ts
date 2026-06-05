import { Global, Module } from '@nestjs/common';
import { KnexService } from './knex.service';
import { KNEX_SERVICE } from './knex.tokens';

@Global()
@Module({
  providers: [
    {
      provide: KNEX_SERVICE,
      useClass: KnexService,
    },
  ],
  exports: [KNEX_SERVICE],
})
export class KnexModule {}
