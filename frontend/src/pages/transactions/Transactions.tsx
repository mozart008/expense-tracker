import Button from '../../components/Button'
import Input from '../../components/Input'
import Layout from '../../components/Layout'
import Table from '../../components/table/Table'
import useAddTransaction from './hooks/useAddTransaction'

export type Transaction = {
  id: number | string
  date: string
  description: string
  amount: number
  unitPrice: number
  total: number
}

const columnDefinitions = [
  { headerName: 'Id', field: 'id' },
  { headerName: 'Date', field: 'date' },
  { headerName: 'description', field: 'description' },
  { headerName: 'Amount', field: 'amount' },
  { headerName: 'Unit price', field: 'unitPrice' },
  { headerName: 'total', field: 'total' },
] as const

export default function Transactions() {
  const { addTransaction, resetDraftTransaction, transactions, draftTransaction, setDraftTransaction } =
    useAddTransaction()

  const handleNumberInputChange = (
    field: 'amount' | 'unitPrice' | 'total',
    value: string
  ) => {
    setDraftTransaction((prev) => ({
      ...prev,
      [field]: Number(value),
    }))
  }


  const extraRow = (
    <tr>
      <td className="px-4 py-3">{draftTransaction.id}</td>
      <td className="px-4 py-3">
        <Input
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
        <Input
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
        <Input
          type="number"
          value={draftTransaction.amount}
          onChange={(event) => handleNumberInputChange('amount', event.target.value)}
        />
      </td>
      <td className="px-4 py-3">
        <Input
          type="number"
          value={draftTransaction.unitPrice}
          onChange={(event) => handleNumberInputChange('unitPrice', event.target.value)}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <Input
            type="number"
            value={draftTransaction.total}
            onChange={(event) => handleNumberInputChange('total', event.target.value)}
          />
          <Button onClick={addTransaction} size="sm">
            Save
          </Button>
          <Button onClick={resetDraftTransaction} size="sm" variant="secondary">
            Cancel
          </Button>
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
