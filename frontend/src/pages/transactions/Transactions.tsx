import { useState } from 'react'
import Layout from '../../components/layout/Layout'
import Table from '../../components/table/Table'

type Transaction = {
  id: number | string
  date: string
  description: string
  amount: number
  unitPrice: number
  total: number
}

const sampleTransactions: Transaction[] = [
  {
    id: 1,
    date: '2026-04-24',
    description: 'Coffee beans',
    amount: 2,
    unitPrice: 12.5,
    total: 25,
  },
  {
    id: 2,
    date: '2026-04-24',
    description: 'Notebook',
    amount: 3,
    unitPrice: 4,
    total: 12,
  },
  {
    id: 3,
    date: '2026-04-23',
    description: 'Taxi fare',
    amount: 1,
    unitPrice: 18.75,
    total: 18.75,
  },
]

const columnDefinitions = [
  { headerName: 'Id', field: 'id' },
  { headerName: 'Date', field: 'date' },
  { headerName: 'description', field: 'description' },
  { headerName: 'Amount', field: 'amount' },
  { headerName: 'Unit price', field: 'unitPrice' },
  { headerName: 'total', field: 'total' },
] as const

const defaultDraftTransaction: Transaction = {
  id: crypto.randomUUID(),
  date: '',
  description: '',
  amount: 0,
  unitPrice: 0,
  total: 0,
}

export default function Transactions() {
  const [transactions, setTransactions] = useState(sampleTransactions)
  const [draftTransaction, setDraftTransaction] = useState<Transaction>(defaultDraftTransaction)

  const handleNumberInputChange = (
    field: 'amount' | 'unitPrice' | 'total',
    value: string
  ) => {
    setDraftTransaction((prev) => ({
      ...prev,
      [field]: Number(value),
    }))
  }

  const addTransaction = () => {
    setTransactions((prev) => [...prev, draftTransaction])
    resetDraftTransaction()
  }

  const resetDraftTransaction = () => {
    setDraftTransaction({...defaultDraftTransaction, id: crypto.randomUUID()})
  }

  const extraRow = (
    <tr>
      <td className="px-4 py-3">{draftTransaction.id}</td>
      <td className="px-4 py-3">
        <input
          className="w-full rounded border border-slate-300 px-2 py-1"
          type="date"
          value={draftTransaction.date}
          onChange={(event) =>
            setDraftTransaction((prev) => ({
              ...prev,
              date: event.target.value,
            }))
          }
        />
      </td>
      <td className="px-4 py-3">
        <input
          className="w-full rounded border border-slate-300 px-2 py-1"
          type="text"
          placeholder="Description"
          value={draftTransaction.description}
          onChange={(event) =>
            setDraftTransaction((prev) => ({
              ...prev,
              description: event.target.value,
            }))
          }
        />
      </td>
      <td className="px-4 py-3">
        <input
          className="w-full rounded border border-slate-300 px-2 py-1"
          type="number"
          value={draftTransaction.amount}
          onChange={(event) => handleNumberInputChange('amount', event.target.value)}
        />
      </td>
      <td className="px-4 py-3">
        <input
          className="w-full rounded border border-slate-300 px-2 py-1"
          type="number"
          value={draftTransaction.unitPrice}
          onChange={(event) => handleNumberInputChange('unitPrice', event.target.value)}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <input
            className="w-full rounded border border-slate-300 px-2 py-1"
            type="number"
            value={draftTransaction.total}
            onChange={(event) => handleNumberInputChange('total', event.target.value)}
          />
          <button
            className="rounded bg-emerald-600 px-2 py-1 text-white hover:bg-emerald-500"
            onClick={addTransaction}
            type="button"
          >
            Save
          </button>
          <button
            className="rounded bg-slate-500 px-2 py-1 text-white hover:bg-slate-400"
            onClick={resetDraftTransaction}
            type="button"
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  )

  return (
    <Layout title="Transactions">
      <Table data={transactions} columnDefinitions={columnDefinitions} extraRow={extraRow} />
    </Layout>
  )
}
