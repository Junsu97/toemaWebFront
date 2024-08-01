import React, {useEffect, useRef, useState} from "react";
import { useCookies } from "react-cookie";
import {useNavigate, useParams} from "react-router-dom";
import {useLoginUserStore} from "../../../stores";
import {TextareaAutosize} from "@mui/material";
import './style.css';
import loginUserStore from "../../../stores/login-user.store";
import {AUTH_PATH} from "../../../constant";
interface ChatMessage {
    userId: string;
    message: string;
    timestamp: string;
}

export default function ChatRoom() {
    const { roomName } = useParams<{ roomName: string }>();
    const [cookies] = useCookies(["accessToken"]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<string>("");
    const {loginUser} = loginUserStore();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const navigate = useNavigate();
    useEffect(() => {
        if (!roomName || !cookies.accessToken) {
            alert('비정상적인 접근입니다.'); // roomName이나 accessToken이 없으면 경고 메시지 표시
        }

        if (!cookies.accessToken || !loginUser) {
            navigate(AUTH_PATH()); // accessToken이나 loginUser가 없으면 로그인 페이지로 이동
            return;
        }

        if (!loginUser || !roomName) {
            return; // loginUser나 roomName이 없으면 함수 종료
        }

        const token = cookies.accessToken; // accessToken 가져오기

        const wsUrl = `wss://api.test-poly.shop/ws/${encodeURIComponent(roomName)}/${encodeURIComponent(loginUser.userId)}?token=${token}`;
        // WebSocket URL 생성

        const websocket = new WebSocket(wsUrl); // WebSocket 연결 생성
        setWs(websocket); // WebSocket 상태 설정

        websocket.onopen = () => {
            console.log("WebSocket Connected"); // WebSocket 연결이 열리면 로그 출력
        };

        websocket.onmessage = (event) => {
            const message: ChatMessage = JSON.parse(event.data); // 수신된 메시지를 파싱
            setMessages((prevMessages) => [...prevMessages, message]); // 메시지를 상태에 추가
        };

        websocket.onclose = () => {
            console.log("WebSocket Disconnected"); // WebSocket 연결이 닫히면 로그 출력
        };

        websocket.onerror = (error) => {
            console.error("WebSocket Error:", error); // WebSocket 오류 발생 시 로그 출력
        };

        return () => {
            websocket.close(); // 컴포넌트 언마운트 시 WebSocket 연결 닫기
        };
    }, [roomName, cookies.accessToken, loginUser]); // 의존성 배열: roomName, cookies.accessToken, loginUser


    const sendMessage = () => {
        if (ws && message.trim()) {
            if(!loginUser) return;
            const chatMessage: ChatMessage = {
                userId: loginUser.userId,
                message: message,
                timestamp: new Date().toISOString(),
            };
            ws.send(JSON.stringify(chatMessage));
            setMessage("");
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevents newline character
            sendMessage();
        }
    };

    return (
        <div className="chat-room">
            <h1>Chat Room: {roomName}</h1>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat-message ${
                            msg.userId === loginUser?.userId
                                ? 'my-message'
                                : msg.userId === '관리자'
                                    ? 'admin-message'
                                    : 'other-message'
                        }`}
                    >
                        <strong>{msg.userId}</strong>: {msg.message} <span>{msg.timestamp}</span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <TextareaAutosize
                    minRows={3}
                    maxRows={3}
                    aria-valuetext={'메시지를 입력하세요'}
                    placeholder={'메시지를 입력하세요...'}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    value={message}
                    style={{ width: '100%', resize: 'none', overflow:'auto' }}
                    ref={textareaRef}
                />
                <button onClick={sendMessage}>전송</button>
            </div>
        </div>
    );
}
