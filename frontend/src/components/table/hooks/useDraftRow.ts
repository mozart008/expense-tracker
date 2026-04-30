import { useCallback, useMemo, useState } from 'react'

type DraftColumnDefinition<TData extends Record<string, unknown>> = {
  field: keyof TData
  dataType: 'text' | 'number' | 'date'
  defaultValue?: string | number
}

const getFallbackValue = (dataType: DraftColumnDefinition<Record<string, unknown>>['dataType']) =>
  dataType === 'number' ? 0 : ''

const createDraftRowFromColumns = <TData extends Record<string, unknown>>(
  columnDefinitions: readonly DraftColumnDefinition<TData>[]
) =>
  columnDefinitions.reduce((acc, column) => {
    const value = column.defaultValue ?? getFallbackValue(column.dataType)
    acc[column.field] = value as TData[keyof TData]
    return acc
  }, {} as TData)

const useDraftRow = <TData extends Record<string, unknown>>(
  columnDefinitions: readonly DraftColumnDefinition<TData>[]
) => {
  const initialDraftRow = useMemo(() => createDraftRowFromColumns(columnDefinitions), [columnDefinitions])
  const [draftRow, setDraftRow] = useState<TData>(initialDraftRow)

  const resetDraftRow = useCallback(() => {
    setDraftRow(createDraftRowFromColumns(columnDefinitions))
  }, [columnDefinitions])

  return { draftRow, setDraftRow, resetDraftRow }
}

export default useDraftRow