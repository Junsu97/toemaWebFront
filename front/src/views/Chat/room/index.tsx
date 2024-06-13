import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import {useLoginUserStore} from "../../../stores";
import './style.css';
import loginUserStore from "../../../stores/login-user.store";
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

    useEffect(() => {
        if (!roomName || !cookies.accessToken) {
            alert('비정상적인 접근입니다.');
            return;
        }
        if (!loginUser) {
            return;
        }

        const token = cookies.accessToken;

        const wsUrl = `ws://localhost:11000/ws/${encodeURIComponent(roomName)}/${encodeURIComponent(loginUser.userId)}?token=${token}`;

        const websocket = new WebSocket(wsUrl);
        setWs(websocket);

        websocket.onopen = () => {
            console.log("WebSocket Connected");
        };

        websocket.onmessage = (event) => {
            const message: ChatMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        websocket.onclose = () => {
            console.log("WebSocket Disconnected");
        };

        websocket.onerror = (error) => {
            console.error("WebSocket Error:", error);
        };

        return () => {
            websocket.close();
        };
    }, [roomName, cookies.accessToken, loginUser]);

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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="chat-room">
            <h1>Chat Room: {roomName}</h1>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.userId === loginUser?.userId ? 'my-message' : 'other-message'}`}>
                        <strong>{msg.userId}</strong>: {msg.message} <span>{msg.timestamp}</span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="메시지를 입력하세요..."
                />
                <button onClick={sendMessage}>전송</button>
            </div>
        </div>
    );
}
