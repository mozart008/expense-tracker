import { useState } from 'react'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'
import type { Transaction } from '../Transactions'

type TransactionFormModalProps = {
    isOpen: boolean
    onClose: () => void
    onSave?: (transaction: Transaction) => void
    draftTransaction?: Transaction | null
}

const getTodayDate = () => new Date().toISOString().split('T')[0]

const defaultDraft = (): Transaction => ({
    date: getTodayDate(),
    description: '',
    unitPrice: 0,
    quantity: 1,
    total: 0,
    id: '',
})

export default function TransactionFormModal({ isOpen, onClose, onSave, draftTransaction }: TransactionFormModalProps) {
    const [draft, setDraft] = useState<Transaction>(draftTransaction ?? defaultDraft())

    const handleChange = (field: keyof Transaction, value: string) => {
        if (field === 'unitPrice' || field === 'quantity') {
            setDraft((prev) => ({ ...prev, [field]: Number(value) }))
            return
        }

        setDraft((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = () => {
        onSave?.(draft)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
            <form
                className="space-y-4"
                onSubmit={(event) => {
                    event.preventDefault()
                    handleSave()
                }}
            >
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="transaction-date">
                        Date
                    </label>
                    <input
                        id="transaction-date"
                        type="date"
                        className="w-full rounded border border-slate-300 px-3 py-2"
                        value={draft.date}
                        onChange={(event) => handleChange('date', event.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="transaction-description">
                        Description
                    </label>
                    <input
                        id="transaction-description"
                        type="text"
                        className="w-full rounded border border-slate-300 px-3 py-2"
                        value={draft.description}
                        onChange={(event) => handleChange('description', event.target.value)}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="transaction-unit-price">
                        Unit Price
                    </label>
                    <input
                        id="transaction-unit-price"
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full rounded border border-slate-300 px-3 py-2"
                        value={draft.unitPrice}
                        onChange={(event) => handleChange('unitPrice', event.target.value)}
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="transaction-quantity">
                        Quantity
                    </label>
                    <input
                        id="transaction-quantity"
                        type="number"
                        min="1"
                        className="w-full rounded border border-slate-300 px-3 py-2"
                        value={draft.quantity}
                        onChange={(event) => handleChange('quantity', event.target.value)}
                        required
                    />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="secondary" type="button" onClick={onClose}>
                        Close
                    </Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Modal>
    )
}
