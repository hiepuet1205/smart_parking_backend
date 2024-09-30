import { BaseQuery } from './baseQuery.concern';

export class ExampleQuery extends BaseQuery {
  orderByCreated() {
    return this.order({ createdAt: 'DESC' });
  }
}
