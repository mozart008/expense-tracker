import type { ReactNode } from 'react'

type ColumnDefinition<T> = {
  headerName: string
  field: keyof T
}

type TableProps<T> = {
  data: T[]
  columnDefinitions: readonly ColumnDefinition<T>[]
  extraRow?: ReactNode
}

export default function Table<T extends Record<string, unknown>>({
  data,
  columnDefinitions,
  extraRow,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columnDefinitions.map((column) => (
              <th key={String(column.field)} className="px-4 py-3 font-medium text-slate-700">
                {column.headerName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columnDefinitions.map((column) => (
                <td key={String(column.field)} className="px-4 py-3">
                  {String(row[column.field])}
                </td>
              ))}
            </tr>
          ))}
          {extraRow}
        </tbody>
      </table>
    </div>
  )
}
