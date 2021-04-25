export interface IFilter {
  id?: number
  groupName?: string
  groupTag?: string
  language?: string
  filters: Filter[]
}

export interface Filter {
  id?: number
  title?: string
  groupTag?: string
  queryField?: string
  queryType?: string
  filterOptions: FilterOption[]
}

export interface FilterOption {
  subline: string
  value: string
  label: string
  type: string
  queryField: string
  tags: string
}