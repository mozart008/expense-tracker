import useDraftRow from '../hooks/useDraftRow'
import React from 'react'
import Button from '../../Button'
import Input from '../../Input'

export type TableRowColumn<TData extends Record<string, unknown>> = {
    headerName: string
    field: keyof TData
    dataType: 'text' | 'number' | 'date'
    readonly: boolean
    isRequired: boolean
    defaultValue?: string | number
}


type TableRowProps<TData extends Record<string, unknown>, TColumn extends TableRowColumn<TData>> = {
    columnDefinitions: readonly TColumn[]
    editable?: boolean
    onSave: (draftRow: TData) => void
}

export default function DraftTableRow<TData extends Record<string, unknown>, TColumn extends TableRowColumn<TData>>({
    columnDefinitions,
    editable = false,
    onSave,
}: TableRowProps<TData, TColumn>) {
    const { draftRow, setDraftRow, resetDraftRow } = useDraftRow<TData>(columnDefinitions)
    const [validationErrors, setValidationErrors] = React.useState<Record<string, string | undefined>>({})

    const handleNumberInputChange = (field: 'quantity' | 'unitPrice', value: string) => {
        setDraftRow((prev) => {
            const normalizedValue = value.trim() === '' ? (field === 'quantity' ? 1 : 0) : Number(value)
            const quantity = field === 'quantity' ? normalizedValue : Number(prev.quantity)
            const unitPrice = field === 'unitPrice' ? normalizedValue : Number(prev.unitPrice)

            return {
                ...prev,
                [field]: normalizedValue,
                total: quantity * unitPrice,
            }
        })
    }

    const handleDraftFieldChange = (column: TColumn, rawValue: string) => {
        if (column.readonly) {
            return
        }

        if (column.field === 'unitPrice' || column.field === 'quantity') {
            handleNumberInputChange(column.field, rawValue)
            return
        }

        setDraftRow((prev) => ({
            ...prev,
            [column.field]: rawValue,
        }))
    }

    const handleCancel = () => {
        setValidationErrors({})
        resetDraftRow()
    }

    const handleSave = () => {
        const errors = columnDefinitions.reduce<Record<string, string | undefined>>((acc, column) => {
            if (!column.isRequired || column.readonly) {
                return acc
            }

            const value = draftRow[column.field]
            const isInvalidNumber = column.dataType === 'number' && Number(value) <= 0
            const isInvalidText = column.dataType !== 'number' && String(value).trim() === ''

            if (isInvalidNumber || isInvalidText) {
                acc[String(column.field)] = `${column.headerName} is required`
            }

            return acc
        }, {})

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors)
            return
        }

        setValidationErrors({})
        onSave(draftRow)
        resetDraftRow()
    }

    return (
        <tr>
            {columnDefinitions.map((column) => (
                <td key={String(column.field)} className="px-4 py-3">
                    {column.readonly ? (
                        <span className="py-2 px-3">{String(draftRow[column.field as keyof TData])}</span>
                    ) : (
                        <>
                            <Input
                                type={column.dataType}
                                value={String(draftRow[column.field as keyof TData])}
                                required={column.isRequired}
                                onChange={(event) => handleDraftFieldChange(column, event.target.value)}
                                onBlur={(event) => {
                                    if (column.field === 'quantity' && event.target.value.trim() === '') {
                                        handleNumberInputChange('quantity', String(column.defaultValue ?? 1))
                                    }
                                }}
                            />
                            {validationErrors?.[String(column.field)] ? (
                                <p className="mt-1 text-xs text-red-600">{validationErrors[String(column.field)]}</p>
                            ) : null}
                        </>
                    )}
                </td>
            ))}
            {editable ? (
                <td className="px-4 py-3">
                    <div className="flex gap-2">
                        <Button onClick={handleSave} size="sm">
                            Save
                        </Button>
                        <Button onClick={handleCancel} size="sm" variant="secondary">
                            Clear
                        </Button>
                    </div>
                </td>
            ) : null}
        </tr>
    )
}
