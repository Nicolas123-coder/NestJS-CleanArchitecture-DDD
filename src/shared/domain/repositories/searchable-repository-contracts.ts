import { Entity } from '../entities/entity'
import { RepositoryInterface } from './repository-contracts'

export type SortDirection = 'asc' | 'desc'

export type SearchProps<Filter = string> = {
  page?: number
  perPage?: number
  sortBy?: string | null
  sortDir?: SortDirection | null
  filter?: Filter | null
}

export class SearchParams {
  protected _page: number
  protected _perPage = 15
  protected _sortBy: string | null
  protected _sortDir: SortDirection | null
  protected _filter: string | null

  constructor(props: SearchProps) {
    this.page = props.page
    this.perPage = props.perPage
    this.sortBy = props.sortBy
    this.sortDir = props.sortDir
    this.filter = props.filter
  }

  get page() {
    return this._page
  }

  private set page(value: number) {
    let _page = +value

    // [INFO] esse as any é pro método não reclamar que não recebe uma string
    if (Number.isNaN(_page) || _page <= 0 || parseInt(_page as any) !== _page) {
      _page = 1
    }

    this._page = _page
  }

  get perPage() {
    return this._perPage
  }

  private set perPage(value: number) {
    let _perPage = +value

    // [INFO] esse as any é pro método não reclamar que não recebe uma string
    if (
      Number.isNaN(_perPage) ||
      _perPage <= 0 ||
      parseInt(_perPage as any) !== _perPage
    ) {
      _perPage = this._perPage
    }

    this._perPage = _perPage
  }

  get sortBy() {
    return this._sortBy
  }

  private set sortBy(value: string | null) {
    this._sortBy =
      value === null || value === undefined || value === '' ? null : `${value}`
  }

  get sortDir() {
    return this._sortDir
  }

  private set sortDir(value: string | null) {
    if (!this.sortBy) {
      this._sortDir = null
      return
    }

    const dir = `${value}`.toLocaleLowerCase()
    this._sortDir = dir !== 'asc' && dir !== 'desc' ? 'desc' : dir
  }

  get filter() {
    return this._filter
  }

  private set filter(value: string | null) {
    this._filter =
      value === null || value === undefined || value === '' ? null : `${value}`
  }
}

export interface SearcableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchParams): Promise<SearchOutput>
}
