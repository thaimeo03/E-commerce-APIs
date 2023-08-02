export interface DateQuery {
  year?: string
  month?: string
  day?: string
}

export interface TransactionQuery {
  order_id?: string
  order_status?: string
  email?: string
  page?: string
  limit?: string
}

export interface ProductsReportQuery {
  min_date?: string
  max_date?: string
  name?: string
  sort_by?: string
  order?: string
  page?: string
  limit?: string
}
