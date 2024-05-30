import React, {useRef, useEffect, useState} from 'react';
import * as faceapi from 'face-api.js';
import {postFaceIdRequest} from 'apis';
import {useCookies} from 'react-cookie';
import {PostFaceIdResponseDTO} from 'apis/response/faceId';
import {ResponseDto} from 'apis/response';
import {PostFaceIdRequestDTO} from 'apis/reqeust/FaceID';
import loginUserStore from "../../stores/login-user.store";
import {useNavigate} from "react-router-dom";
import {AUTH_PATH, USER_PATH} from "../../constant";

interface DetectionWithExpression extends faceapi.WithFaceExpressions<faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<{}>>> {
}

export default function FaceCapture() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [accumulatedDetections, setAccumulatedDetections] = useState<DetectionWithExpression[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalIdRef = useRef<number | null>(null);
    const [cookies] = useCookies(['accessToken']);
    const [startDetect, setStartDectect] = useState<boolean>(true);
    const {loginUser} = loginUserStore();
    // function : 네비게이트
    const navigate = useNavigate();
    const postFaceIdResponse = (responseBody: PostFaceIdResponseDTO | ResponseDto | null) => {
        setStartDectect(false);
        if (!loginUser || !cookies.accessToken) {
            alert('인증이 만료되었습니다.');
            navigate(AUTH_PATH());
            return;
        }
        if (!responseBody) return;
        const {code} = responseBody;
        if (code === 'DBE') {
            navigate(USER_PATH(loginUser.userId));
            alert('데이터베이스 오류입니다.');
            return;
        }
        if (code !== 'SU') {
            alert('오류가 발생했습니다.');
            navigate(USER_PATH(loginUser.userId));
            return;
        }


        alert('FaceID 저장에 성공했습니다.');
        stopVideoAndDetection();
        setStartDectect(false);
        navigate(USER_PATH(loginUser.userId));
        return;
    }
    // 여기에 처리 로직 추가


    useEffect(() => {
        let stream: MediaStream | null = null;

        const startVideo = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                    faceapi.nets.faceExpressionNet.loadFromUri('/models')
                ]);
                stream = await navigator.mediaDevices.getUserMedia({video: {}});
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                } else {
                    alert('비디오 혹은 카메라에 이상이 있습니다.');
                    return;
                }
                videoRef.current.onloadedmetadata = () => {
                    if (canvasRef.current && videoRef.current) {
                        canvasRef.current.width = videoRef.current.width;
                        canvasRef.current.height = videoRef.current.height;
                    }
                    // Assuming detectFace is defined somewhere
                    detectFace();
                };
            } catch (e) {
                console.error(e);
            }
        };
        if(startDetect){
            startVideo();
        }else{
            stopVideoAndDetection();
        }


        // Cleanup function to stop the video stream when the component unmounts
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
            }
        };
    }, [startDetect]);




    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (accumulatedDetections.length > 0 && accumulatedDetections.length < 5) {
            timeoutId = setTimeout(() => {
                alert("얼굴 인식 정확도가 낮습니다. 얼굴 인식을 다시 시작해주세요.");
                if (!loginUser) return;
                navigate(USER_PATH(loginUser.userId));
                setAccumulatedDetections([]);
                detectFace();
            }, 1000);
        } else if (accumulatedDetections.length >= 5) {
            if (!loginUser) return;
            // 정확도, 표정, 랜드마크의 평균을 계산합니다.
            const averageAccuracy = accumulatedDetections.reduce((acc, detection) => acc + detection.detection.score, 0) / accumulatedDetections.length;

            // 랜드마크 위치의 평균을 계산합니다.
            const numLandmarks = accumulatedDetections[0].landmarks.positions.length;
            const averageLandmarks = {
                positions: Array(numLandmarks).fill(0).map((_, index) => {
                    return accumulatedDetections.reduce((acc, detection) => {
                        acc.x += detection.landmarks.positions[index].x / accumulatedDetections.length;
                        acc.y += detection.landmarks.positions[index].y / accumulatedDetections.length;
                        return acc;
                    }, {x: 0, y: 0});
                })
            };

            // 평균값을 사용하여 requestBody를 생성합니다.
            const requestBody: PostFaceIdRequestDTO = {
                userId: loginUser.userId,
                accuracy: averageAccuracy,
                landMarks: averageLandmarks,
                userType: loginUser.userType
            };
            postFaceIdRequest(requestBody).then(postFaceIdResponse);
            alert('수집완료');
            console.log(requestBody);
            // 이제 requestBody를 API 요청에 사용할 수 있습니다.


            setAccumulatedDetections([]);
        }

        return () => clearTimeout(timeoutId);
    }, [accumulatedDetections]);
    const stopVideoAndDetection = () => {
        setStartDectect(false);
        // 비디오 스트리밍 종료
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            streamRef.current = null;
        }

        // 얼굴 인식 타이머 종료
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }

        // 비디오와 캔버스 초기화
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (canvasRef.current) {
            canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        // 검출된 얼굴 데이터 초기화
        setAccumulatedDetections([]);
    };
    const detectFace = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const displaySize = {width: videoRef.current.width, height: videoRef.current.height};
        faceapi.matchDimensions(canvasRef.current, displaySize);
        intervalIdRef.current = setInterval(async () => {
            if (!videoRef.current || !canvasRef.current) return;

            // 캔버스 초기화
            // 캔버스 초기화
            if(canvasRef) {


                canvasRef.current?.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);


                const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions();
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                const highAccuracyNeutralExpressions = resizedDetections.filter(detection =>
                    detection.detection.score >= 0.9 && detection.expressions.neutral >= 0.9) as DetectionWithExpression[];

                if (highAccuracyNeutralExpressions.length > 0) {
                    setAccumulatedDetections(prevDetections => [...prevDetections, ...highAccuracyNeutralExpressions]);
                }

                faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
                faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
                faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
            }
        }, 100) as unknown as number;
    };
    return (
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
    )


};