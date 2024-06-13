import {useEffect, useState} from "react";
import axios from "axios";
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {AUTH_PATH, CHAT_ROOM} from "../../../constant";
import {PostChatRoomRequestDTO} from "../../../apis/reqeust/chat";
import {postChatRoomRequest} from "../../../apis";
import "./style.css"; // CSS 파일 임포트

interface ChatRoom {
    roomName: string;
}

export default function ChatList() {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [cookies] = useCookies();
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoomList();
    }, [cookies.accessToken, navigate]);

    const fetchRoomList = async () => {
        if (!cookies.accessToken) {
            alert("로그인 후 이용해주세요.");
            navigate(AUTH_PATH());
            return;
        }
        try {
            const token = cookies.accessToken;
            const response = await axios.get<string[]>(
                "http://localhost:11000/roomList",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const chatRooms = response.data.map((roomName) => ({roomName}));
            console.log(chatRooms);
            setRooms(chatRooms);
        } catch (error) {
            console.error("Error fetching room list", error);
        }
    };

    const createRoomClickHandler = async () => {
        const {value: roomName} = await Swal.fire({
            title: "새로운 채팅방 이름을 입력하세요",
            input: "text",
            inputPlaceholder: "채팅방 이름",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return "채팅방 이름을 입력하세요!";
                }
                const regex = /^[\p{L}\p{N} ]+$/u;
                if (!regex.test(value)) {
                    return "특수 문자는 사용할 수 없습니다!";
                }
                return null;
            },
        });

        if (roomName) {
            try {
                const token = cookies.accessToken;
                const requestBody: PostChatRoomRequestDTO = {
                    roomName: roomName,
                };

                await postChatRoomRequest(requestBody, token);
                Swal.fire("성공", "새로운 채팅방이 생성되었습니다!", "success");
                fetchRoomList();
                navigate(CHAT_ROOM(roomName));
            } catch (error) {
                console.error("Error creating chat room", error);
                Swal.fire("오류", "채팅방 생성에 실패했습니다.", "error");
            }
        }
    };

    const handleRoomClick = (roomName: string) => {
        navigate(CHAT_ROOM(roomName));
    };

    return (
        <div className="chat-list">
            <h1>Chat Rooms</h1>
            {rooms.length > 0 ? (
                <ul>
                    {rooms.map((room, index) => (
                        <li key={index} onClick={() => handleRoomClick(room.roomName)}>
                            {room.roomName}
                        </li>
                    ))}
                </ul>
            ) : (
                <div>
                    <p>개설된 채팅방이 없습니다.</p>
                </div>
            )}
            <div className="black-button" onClick={createRoomClickHandler}>
                새로운 채팅방 만들기
            </div>
        </div>
    );
}
