import { Injectable } from '@nestjs/common';
import knex, { Knex } from 'knex';
import { environments } from 'src/config/env';

@Injectable()
export class KnexService {
  db: Knex;
  constructor() {
    this.db = knex({
      client: 'pg',
      connection: environments.DATABASE_URL,
    });
  }
}
