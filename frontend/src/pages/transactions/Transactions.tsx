import Layout from '../../components/Layout'
import Table from '../../components/table/Table'
import Toolbar from './components/Toolbar'
import useTransaction from './hooks/useTransaction'
import TransactionFormModal from './components/TransactionFormModal'
import useTransactionForm from './hooks/useTransactionForm'

export type Transaction = {
  id: number | string
  date: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

const getTodayDate = () => new Date().toISOString().split('T')[0]

const columnDefinitions = [
  { headerName: 'Id', field: 'id', dataType: 'text', readonly: true, isRequired: true },
  { headerName: 'Date', field: 'date', dataType: 'date', readonly: false, isRequired: true, defaultValue: getTodayDate() },
  { headerName: 'description', field: 'description', dataType: 'text', readonly: false, isRequired: false },
  { headerName: 'Unit price', field: 'unitPrice', dataType: 'number', readonly: false, isRequired: true },
  { headerName: 'Quantity', field: 'quantity', dataType: 'number', readonly: false, isRequired: true, defaultValue: 1 },
  { headerName: 'total', field: 'total', dataType: 'number', readonly: true, isRequired: true },
] as const

export default function Transactions() {

  const { saveTransaction, transactions } = useTransaction()
  const { isTransactionFormModalOpen, handleOpenTransactionFormModal, handleCloseTransactionFormModal } = useTransactionForm()

  const handleSave = (draftTransaction: Transaction) => {
    saveTransaction(draftTransaction)
  }

  return (
    <Layout title="Transactions">
      <Toolbar transactions={transactions} onOpenTransactionFormModal={handleOpenTransactionFormModal} />
      <Table
        data={transactions}
        columnDefinitions={columnDefinitions}
      />
      <TransactionFormModal isOpen={isTransactionFormModalOpen} onClose={handleCloseTransactionFormModal} onSave={handleSave} />
    </Layout>
  )
}
