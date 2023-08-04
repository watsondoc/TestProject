export const ITEMS_PER_PAGE = 4;

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export type Options = {
  limit: number,
  offset: number,
  sortBy?: string,
  sortDir?: SortDirection,
  query?: string,
}
