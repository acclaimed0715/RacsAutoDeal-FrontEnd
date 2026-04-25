import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    isDestructive = false
}) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="admin-modal-overlay active" onClick={onCancel}></div>
            <div className="confirm-modal active">
                <div className="confirm-modal-icon">
                    <i className={`fa-solid ${isDestructive ? 'fa-triangle-exclamation' : 'fa-circle-question'}`}></i>
                </div>
                <div className="confirm-modal-content">
                    <h3>{title}</h3>
                    <p>{message}</p>
                </div>
                <div className="confirm-modal-footer">
                    <button className="confirm-cancel-btn" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button 
                        className={`confirm-submit-btn ${isDestructive ? 'destructive' : ''}`} 
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </>
    );
};

export default ConfirmModal;
