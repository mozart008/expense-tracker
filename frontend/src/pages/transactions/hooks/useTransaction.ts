
import React from 'react'
import { type Transaction } from '../Transactions'
import {
  createTransaction,
  deleteTransaction as deleteTransactionRequest,
  getTransactions,
  updateTransaction,
} from '../../../services/transaction-service'

const isNewTransaction = (id: Transaction['id']) => id === ''

const useTransaction = () => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([] as Transaction[])

  React.useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const transactions = await getTransactions()
      setTransactions(transactions)
    } catch (err) {
      console.error(err)
    }
  }

  const saveTransaction = async (transaction: Transaction) => {
    const total = transaction.unitPrice * transaction.quantity
    if (isNewTransaction(transaction.id)) {
      await createTransaction({
        date: transaction.date,
        description: transaction.description,
        unitPrice: transaction.unitPrice,
        quantity: transaction.quantity,
      })

    } else {
      await updateTransaction({ ...transaction, total })
    }

    await fetchTransactions()
  }

  const deleteTransaction = async (id: Transaction['id']) => {
    if (id === '') return
    try {
      await deleteTransactionRequest(id)
      await fetchTransactions()
    } catch (err) {
      console.error(err)
    }
  }

  return { deleteTransaction, saveTransaction, transactions }
}
export default useTransaction;