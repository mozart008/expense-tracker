import { useState } from "react";

const useTransactionForm = () => {
    const [isTransactionFormModalOpen, setIsTransactionFormModalOpen] = useState(false)

    const handleOpenTransactionFormModal = () => {
        setIsTransactionFormModalOpen(true)
    }

    const handleCloseTransactionFormModal = () => {
        setIsTransactionFormModalOpen(false)
    }

    return { isTransactionFormModalOpen, handleOpenTransactionFormModal, handleCloseTransactionFormModal }
}
export default useTransactionForm;