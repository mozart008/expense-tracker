import Button from '../../../components/Button'
import type { Transaction } from '../Transactions'

type ToolbarProps = {
    transactions: Transaction[]
    onOpenTransactionFormModal: () => void
}

export default function Toolbar({ transactions, onOpenTransactionFormModal }: ToolbarProps) {
    const grandTotal = transactions.reduce((sum, transaction) => sum + transaction.total, 0)

    return (
        <div className="flex items-end justify-end gap-2 mb-2">
            <p className="text-sm font-semibold leading-none">
                Total: <span>{grandTotal.toFixed(2)}</span>
            </p>
            <Button onClick={onOpenTransactionFormModal}>Add</Button>
        </div>
    )
}
