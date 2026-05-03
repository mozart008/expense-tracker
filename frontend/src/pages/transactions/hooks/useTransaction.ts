
import React from 'react'
import { type Transaction } from '../Transactions'

const isNewTransaction = (id: Transaction['id']) => id === ''

const useTransaction = () => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([] as Transaction[])

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

  const deleteTransaction = (id: Transaction['id']) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return { deleteTransaction, saveTransaction, transactions }
}
export default useTransaction;