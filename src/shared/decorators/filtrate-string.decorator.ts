import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { isJsonObject } from '../helpers/commons';

export class FilteringString {
  filter: string;

  constructor(query: string) {
    this.filter = this.buildFilterParams(query);
  }

  private buildFilterParams(filter: string): string {
    if (!isJsonObject(filter) && filter.trim().length > 0) {
      return filter;
    }

    return '';
  }
}

export const FiltrateString = createParamDecorator(
  (data: unknown, context: ExecutionContext): FilteringString => {
    const http = context.switchToHttp() as { getRequest: () => unknown };
    const req = http.getRequest() as { query: { filter: string } };
    return new FilteringString(req.query.filter);
  },
);
