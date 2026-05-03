import type { ReactNode } from 'react'
import Button from '../Button'
import { toTitleCase } from '../../utils/string.utils'

type ColumnDefinition<T> = {
  headerName: string
  field: keyof T
  dataType: 'text' | 'number' | 'date'
  readonly: boolean
  isRequired: boolean
  defaultValue?: string | number
  /** When true, the column is omitted from the table (headers and cells). */
  hidden?: boolean
}

type TableProps<T> = {
  data: T[]
  columnDefinitions: readonly ColumnDefinition<T>[]
  extraRow?: ReactNode
  editable?: boolean
  editRow?: (row: T) => void
  deleteRow?: (id: string | number) => void
}

export default function Table<T extends Record<string, unknown>>({
  data,
  columnDefinitions,
  editRow,
  deleteRow,
}: TableProps<T>) {
  const showActions = editRow != null || deleteRow != null
  const visibleColumns = columnDefinitions.filter((column) => !column.hidden)
  const columnCount = visibleColumns.length + (showActions ? 1 : 0)
  const equalColumnWidth =
    columnCount > 0 ? { width: `${100 / columnCount}%` } : undefined

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="table-fixed min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-100">
          <tr>
            {visibleColumns.map((column) => (
              <th
                key={String(column.field)}
                className="px-4 py-3 font-medium text-slate-700"
                style={equalColumnWidth}
              >
                {toTitleCase(column.headerName)}
              </th>
            ))}
            {showActions && (
              <th className="px-4 py-3 font-medium text-slate-700" style={equalColumnWidth}>
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-slate-100">
              {visibleColumns.map((column) => (
                <td
                  key={String(column.field)}
                  className="px-4 py-3"
                  style={equalColumnWidth}
                >
                  {String(row[column.field])}
                </td>
              ))}
              {showActions && (
                <td className="px-4 py-3" style={equalColumnWidth}>
                  <div className="flex flex-wrap items-center gap-2">
                    {editRow && (
                      <Button variant="secondary" size="sm" onClick={() => editRow(row)}>
                        Edit
                      </Button>
                    )}
                    {deleteRow && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => deleteRow(row['id'] as string | number)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
