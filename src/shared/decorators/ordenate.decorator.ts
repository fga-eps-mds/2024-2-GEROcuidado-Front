import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { isJsonObject } from '../helpers/commons';

export interface OrderParams {
  column: string;
  dir: string;
}

export class Ordering implements OrderParams {
  column!: string;
  dir!: string;

  constructor(query: string) {
    const orderObj = this.buildOrderParams(query);
    this.column = orderObj.column;
    this.dir = orderObj.dir;
  }

  private buildOrderParams(order: string): OrderParams {
    if (isJsonObject(order)) {
      const orderObj = JSON.parse(order) as OrderParams;

      if (!orderObj.column || orderObj.column.length === 0) {
        orderObj.column = 'id';
      }

      if (!orderObj.dir || orderObj.dir.length === 0) {
        orderObj.dir = 'ASC';
      }

      return orderObj;
    }
    return {
      column: 'id',
      dir: 'ASC',
    } as OrderParams;
  }
}

export const Ordenate = createParamDecorator(
  (data: unknown, context: ExecutionContext): Ordering => {
    const http = context.switchToHttp() as { getRequest: () => unknown };
    const req = http.getRequest() as { query: { order: string } };
    return new Ordering(req.query.order);
  },
);
