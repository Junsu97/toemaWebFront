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
            alert("로그인 후 이용해주세요."); // accessToken이 없으면 경고 메시지 표시
            navigate(AUTH_PATH()); // 로그인 페이지로 이동
            return; // 함수 종료
        }
        try {
            const token = cookies.accessToken; // accessToken 가져오기
            const response = await axios.get<string[]>(
                "https://api.test-poly.shop/roomList",
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Authorization 헤더에 accessToken 추가
                    },
                }
            );
            const chatRooms = response.data.map((roomName) => ({roomName})); // 응답 데이터를 roomName 객체 배열로 변환
            console.log(chatRooms); // 변환된 데이터를 콘솔에 출력
            setRooms(chatRooms); // 변환된 데이터를 rooms 상태로 설정
        } catch (error) {
            console.error("Error fetching room list", error); // 에러 발생 시 콘솔에 출력
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
                if(value.length > 16){
                    return "채팅방 이름은 16글자 이하로 입력해주세요.";
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
            <div className="chat-black-button" onClick={createRoomClickHandler}>
                새로운 채팅방 만들기
            </div>
        </div>
    );
}
