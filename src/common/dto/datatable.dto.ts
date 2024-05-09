import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class DatatableDTO {
  search: string = '';

  @IsOptional()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  per_page: number = 10;

  order_by: string = 'id';

  sort_by: string = 'desc';

  @IsOptional()
  @Type(() => Date)
  start_time: Date;

  @IsOptional()
  @Type(() => Date)
  end_time: Date;
}
