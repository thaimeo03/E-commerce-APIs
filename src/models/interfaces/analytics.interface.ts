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
