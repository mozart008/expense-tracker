import { useRef, type MouseEvent, type ReactNode } from 'react'
import Button from './Button'

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    title?: string
    className?: string
    showCloseButton?: boolean
    closeOnBackdropClick?: boolean
}

export default function Modal({
    isOpen,
    onClose,
    children,
    title,
    className = '',
    showCloseButton = true,
    closeOnBackdropClick = true,
}: ModalProps) {
    const shouldCloseOnBackdropClickRef = useRef(false)

    if (!isOpen) {
        return null
    }

    const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
        shouldCloseOnBackdropClickRef.current = event.target === event.currentTarget
    }

    const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
        const isBackdropClick = event.target === event.currentTarget
        if (closeOnBackdropClick && isBackdropClick && shouldCloseOnBackdropClickRef.current) {
            onClose()
        }
        shouldCloseOnBackdropClickRef.current = false
    }

    const stopModalClick = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
    }

    const modalHeader = (title || showCloseButton) && (
        <div className="mb-4 flex items-center justify-between gap-2">
            {title ? <h2 className="text-lg font-semibold text-slate-900">{title}</h2> : <div />}
            {showCloseButton && (
                <Button variant="secondary" type="button" onClick={onClose} aria-label="Close modal">x</Button>
            )}
        </div>
    )

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
            onMouseDown={handleBackdropMouseDown}
            onClick={handleBackdropClick}
            role="presentation"
        >
            <div
                className={`w-full max-w-lg rounded-lg bg-white p-4 shadow-lg ${className}`.trim()}
                onClick={stopModalClick}
                role="dialog"
                aria-modal="true"
                aria-label={title ?? 'Modal'}
            >
                {modalHeader}
                <div>{children}</div>
            </div>
        </div>
    )
}
