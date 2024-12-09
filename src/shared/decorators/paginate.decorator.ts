import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface PaginationParams {
  offset: number;
  limit: number;
}

export class Pagination implements PaginationParams {
  offset!: number;
  limit!: number;

  constructor(query: PaginationParams) {
    this.offset = this.getOffset(query.offset, query.limit);
    this.limit = this.getLimit(query.limit);
  }

  getOffset(offset?: number, limit?: number): number {
    if (!offset || !limit) {
      return 0;
    }

    return limit * offset;
  }

  getLimit(limit?: number): number {
    if (!limit) {
      return 10;
    }

    return limit;
  }
}

export const Paginate = createParamDecorator(
  (data: unknown, context: ExecutionContext): Pagination => {
    const http = context.switchToHttp() as { getRequest: () => unknown };
    const req = http.getRequest() as { query: PaginationParams };
    return new Pagination(req.query);
  },
);
