import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from 'src/app.constant';

export class BaseQuery {
  protected queryOptions: { [key: string]: any } = {};

  applyQuery() {
    return this.queryOptions;
  }

  // where conditions groups
  where(cond_options) {
    if (this.queryOptions.where === undefined) {
      this.queryOptions.where = {};
    }

    Object.assign(this.queryOptions.where, cond_options);

    return this;
  }

  or(cond_options?) {
    if (this.queryOptions.where === undefined) {
      this.queryOptions.where = cond_options ? [cond_options] : [];
    } else if (Array.isArray(this.queryOptions.where)) {
      cond_options && this.queryOptions.where.push(cond_options);
    } else {
      this.queryOptions.where = [this.queryOptions.where, cond_options];
    }

    return this;
  }

  order(order_options) {
    if (this.queryOptions.order === undefined) {
      this.queryOptions.order = {};
    }

    Object.assign(this.queryOptions.order, order_options);
    return this;
  }

  // select conditions groups
  select(select_options) {
    if (this.queryOptions.select === undefined) {
      this.queryOptions.select = {};
    }

    Object.assign(this.queryOptions.select, select_options);
    return this;
  }

  // relations conditions groups
  relations(...relations_options) {
    if (this.queryOptions.relations === undefined) {
      this.queryOptions.relations = [];
    }

    this.queryOptions.relations.push(...relations_options);
    return this;
  }

  // pagination
  pagy(pagyOptions) {
    if (!pagyOptions) return this;

    const pageNumber = pagyOptions.page || DEFAULT_PAGE;
    const itemsPerPage = pagyOptions.items || DEFAULT_PER_PAGE;
    this.queryOptions.skip = (pageNumber - 1) * itemsPerPage;
    this.queryOptions.take = itemsPerPage;
    return this;
  }
}
