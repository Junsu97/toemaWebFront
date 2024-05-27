import React from "react";

interface ConfirmModalProps{
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({message, onConfirm, onCancel}) => {
    return(
        <div className="confirm-dialog">
            <p>{message}</p>
            <button className={'black-button'} onClick={onConfirm}>확인</button>
            <button className={'black-button'} onClick={onCancel}>취소</button>
        </div>
    );
};

export default ConfirmModal;