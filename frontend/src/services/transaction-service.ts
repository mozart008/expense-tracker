import type { Transaction } from '../pages/transactions/Transactions'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

type TransactionDto = {
  id: number
  date: string
  description: string
  unitPrice: number
  quantity: number
  total: number
}

const toTransaction = (dto: TransactionDto): Transaction => ({
  ...dto,
  date: dto.date.slice(0, 10),
})

const toTransactionWritePayload = (
  id: number,
  input: Pick<Transaction, 'date' | 'description' | 'unitPrice' | 'quantity'>,
): TransactionDto => {
  const total = input.unitPrice * input.quantity
  return {
    id,
    date: new Date(input.date).toISOString(),
    description: input.description,
    unitPrice: input.unitPrice,
    quantity: input.quantity,
    total,
  }
}

export const getTransactions = async (signal?: AbortSignal): Promise<Transaction[]> => {
  try {
    const res = await axios.get<TransactionDto[]>(`${BASE_URL}/api/Transaction`, { signal })
    return res.data.map(toTransaction) ?? []
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      throw new Error(`GET /api/Transaction failed${status ? `: ${status}` : ''}`)
    }
    throw err
  }
}

export const createTransaction = async (
  input: Pick<Transaction, 'date' | 'description' | 'unitPrice' | 'quantity'>,
): Promise<number> => {
  const payload = toTransactionWritePayload(0, input)
  try {
    const res = await axios.post<number>(`${BASE_URL}/api/Transaction`, payload)
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      throw new Error(`POST /api/Transaction failed${status ? `: ${status}` : ''}`)
    }
    throw err
  }
}

export const updateTransaction = async (transaction: Transaction): Promise<void> => {
  const payload = toTransactionWritePayload(Number(transaction.id), transaction)
  try {
    await axios.put(`${BASE_URL}/api/Transaction`, payload)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      throw new Error(`PUT /api/Transaction failed${status ? `: ${status}` : ''}`)
    }
    throw err
  }
}

export const deleteTransaction = async (id: number | string): Promise<void> => {
  if (id === '') return
  try {
    await axios.delete(`${BASE_URL}/api/Transaction/${Number(id)}`)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      throw new Error(`DELETE /api/Transaction/${Number(id)} failed${status ? `: ${status}` : ''}`)
    }
    throw err
  }
}
