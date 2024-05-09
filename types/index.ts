export interface DatatableParams {
  search: string;
  page: number;
  per_page: number;
  sort_by: string;
  order_by: string;
  start_time: Date | null;
  end_time: Date | null;
}

export type DatatableResponse = {
  data: any;
  meta: {
    total: number;
  } & DatatableParams;
};
