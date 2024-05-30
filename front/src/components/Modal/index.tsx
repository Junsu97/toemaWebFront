import React, { useRef,useState, useEffect } from 'react';
import './style.css';
import ReactModal from "react-modal"; // 모달에 대한 스타일을 정의한 CSS 파일

interface ModalProps{
    onOpen?: () => void;
    onClose? : () => void;
    open: boolean;
    videoRef: React.RefObject<HTMLVideoElement>;
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

const Modal: React.FC<ModalProps> = ({onOpen,onClose,open,videoRef, canvasRef}) => {
    const [modalOpen, setModalOpen] = useState<boolean>(open);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalIdRef = useRef<number | null>(null);

    useEffect(() => {
        setModalOpen(open);
    }, [open]);
    useEffect(() => {
        if(modalOpen && onOpen){
            onOpen();
        }
    }, [modalOpen, onOpen]);
    // 컴포넌트가 언마운트될 때 실행될 정리 작업
    useEffect(() => {
        return () => {
            // 스트림 종료
            if (streamRef.current) {
                const tracks = streamRef.current.getTracks();
                tracks.forEach(track => track.stop());
            }
            // 인터벌 정리
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [onClose]);

    const customModalStyles: ReactModal.Styles = {
        overlay: {
            backgroundColor: " rgba(0, 0, 0, 0.4)",
            width: "100%",
            height: "100vh",
            zIndex: "10",
            position: "fixed",
            top: "0",
            left: "0",
        }
    }

    return(
        <ReactModal
        isOpen={modalOpen}
        onRequestClose={onClose}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={true}
        style={customModalStyles}
        >
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                position: "relative"
            }}>
                <video ref={videoRef} autoPlay muted width="720" height="560"/>
                <canvas ref={canvasRef} style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }}/>
            </div>
        </ReactModal>
    )
}

export default Modal;