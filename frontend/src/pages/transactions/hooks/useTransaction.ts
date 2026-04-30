
import React from 'react'
import { type Transaction } from '../Transactions'

const sampleTransactions: Transaction[] = [
  {
    id: 1,
    date: '2026-04-24',
    description: 'Coffee beans',
    quantity: 2,
    unitPrice: 12.5,
    total: 25,
  },
  {
    id: 2,
    date: '2026-04-24',
    description: 'Notebook',
    quantity: 3,
    unitPrice: 4,
    total: 12,
  },
  {
    id: 3,
    date: '2026-04-23',
    description: 'Taxi fare',
    quantity: 1,
    unitPrice: 18.75,
    total: 18.75,
  },
]

const isNewTransaction = (id: Transaction['id']) => id === ''

const useTransaction = () => {
  const [transactions, setTransactions] = React.useState<Transaction[]>(sampleTransactions)

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, { ...transaction, id: crypto.randomUUID() }])
  }

  const editTransaction = (transaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === transaction.id ? { ...transaction } : t)),
    )
  }

  const saveTransaction = (transaction: Transaction) => {
    const total = transaction.unitPrice * transaction.quantity
    if (isNewTransaction(transaction.id)) {
      addTransaction({ ...transaction, total })
      return
    }
    editTransaction({ ...transaction, total })
  }

  return { saveTransaction, transactions }
}
export default useTransaction;