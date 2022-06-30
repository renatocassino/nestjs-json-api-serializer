import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class JsonApiInterceptor implements NestInterceptor {
  private context: ExecutionContext | undefined;

  getRelationsFromItem(item: any) {
    const { query } = this.context!.switchToHttp().getRequest();

    const fields = new Set((query['fields'] || '').split(','));
    fields.delete('');

    const response = Object.entries(item).reduce((accum, curr) => {
      const [fieldName, fieldValue] = curr;

      if (typeof fieldValue !== 'object' || Object.keys(fieldValue as object).length === 0) {
        return accum;
      }

      if (fields.size === 0 || fields.has(fieldName)) {
        return {
          ...accum,
          [fieldName]: this.buildItem(fieldValue),
        };
      }

      return accum;

    }, {});

    return Object.keys(response).length === 0 ? undefined : response;
  }

  getAttributesFromItem(item: any) {
    const { query } = this.context!.switchToHttp().getRequest();
    const fields = new Set((query['fields'] || '').split(','));
    fields.delete('');

    return Object.entries(item).reduce((accum, curr) => {
      if (curr[0] === 'id') {
        return accum;
      }

      const [fieldName, fieldValue] = curr;

      if (typeof fieldValue === 'object') {
        return accum;
      }

      if (fields.size === 0 || fields.has(fieldName)) {
        return {
          ...accum,
          [fieldName]: fieldValue,
        };
      }

      return accum;
    }, {});
  }

  buildItem(item: any) {
    return {
      id: item.id,
      attributes: this.getAttributesFromItem(item),
      relations: this.getRelationsFromItem(item),
    }
  }

  buildItems(items: any[]) {
    return items.map(this.buildItem.bind(this));
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.context = context;

    return next.handle().pipe(
      tap((data) => {
        data.data = this.buildItems(data.data);
      }),
    );
  }
}
