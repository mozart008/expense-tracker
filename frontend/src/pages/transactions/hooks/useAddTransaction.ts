
import React from 'react'
import { type Transaction } from '../Transactions'

const defaultDraftTransaction: Transaction = {
  id: crypto.randomUUID(),
  date: '',
  description: '',
  amount: 0,
  unitPrice: 0,
  total: 0,
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

const useAddTransaction = () => {
  const [draftTransaction, setDraftTransaction] = React.useState<Transaction>(defaultDraftTransaction)
  const [transactions, setTransactions] = React.useState<Transaction[]>(sampleTransactions)

  const addTransaction = () => {
    setTransactions((prev) => [...prev, draftTransaction])
    resetDraftTransaction()
  }

  const resetDraftTransaction = () => {
    setDraftTransaction({ ...defaultDraftTransaction, id: crypto.randomUUID() })
  }

  return { addTransaction, resetDraftTransaction, transactions, draftTransaction, setDraftTransaction }
}
export default useAddTransaction;