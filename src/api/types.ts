
export interface BasicResponse {

  statusCode: number
  message: string
}

export interface BaseResponse<T> extends BasicResponse {
  data: T
}

export interface BaseResponseWithMeta<T> extends BaseResponse<T> {
  meta: {
    total: number
    offset: number
    nextOffset?: number
  }
}

export interface BasicObject {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface PagingData {
  currentPage: number
  pageSize: number
  totalPages: number
  totalRows: number
}

export interface CompactUser {
  _id: string;
  email: string;
  name: string;
}
