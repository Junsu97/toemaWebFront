import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { postFaceIdRequest } from 'apis';
import { useCookies } from 'react-cookie';
import { PostFaceIdResponseDTO } from 'apis/response/faceId';
import { ResponseDto } from 'apis/response';
import { PostFaceIdRequestDTO } from 'apis/reqeust/FaceID';

interface DetectionWithExpression extends faceapi.WithFaceExpressions<faceapi.WithFaceLandmarks<faceapi.WithFaceDetection<{}>>> { }

export default function FaceCapture() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [accumulatedDetections, setAccumulatedDetections] = useState<DetectionWithExpression[]>([]);

  const [cookies] = useCookies(['accessToken']);

  const postFaceIdResponse = (responseBody: PostFaceIdResponseDTO | ResponseDto | null) => {

  }
  // 여기에 처리 로직 추가


  useEffect(() => {
    const startVideo = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        if (!videoRef.current) {
          alert('비디오 혹은 카메라에 이상이 있습니다.');
          return;
        }
        videoRef.current.onloadedmetadata = () => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.width;
            canvasRef.current.height = videoRef.current.height;
          }
          detectFace();
        };
      } catch (e) {
        console.error(e);
      }
    };

    startVideo();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (accumulatedDetections.length > 0 && accumulatedDetections.length < 5) {
      timeoutId = setTimeout(() => {
        alert("얼굴 인식 정확도가 낮습니다. 얼굴 인식을 다시 시작해주세요.");
        setAccumulatedDetections([]);
        detectFace();
      }, 1000);
    } else if (accumulatedDetections.length >= 5) {
      const requestBody: PostFaceIdRequestDTO[] = accumulatedDetections.map(detection => ({
        accuracy: detection.detection.score,
        expressions: detection.expressions,
        landmarks: { positions: detection.landmarks.positions },
      }));
      // 또는 requestBody의 각 요소를 반복하여 출력할 수도 있습니다.
      // postFaceIdRequest(requestBody, cookies.accessToken).then(postFaceIdResponse);
      setAccumulatedDetections([]);
    }

    return () => clearTimeout(timeoutId);
  }, [accumulatedDetections, cookies.accessToken]);

  const detectFace = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
    faceapi.matchDimensions(canvasRef.current, displaySize);
    setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      // 캔버스 초기화
      // 캔버스 초기화
      canvasRef.current?.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);


      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const highAccuracyNeutralExpressions = resizedDetections.filter(detection =>
        detection.detection.score >= 0.8 && detection.expressions.neutral > 0.8) as DetectionWithExpression[];

      if (highAccuracyNeutralExpressions.length > 0) {
        setAccumulatedDetections(prevDetections => [...prevDetections, ...highAccuracyNeutralExpressions]);
      }

      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections);
    }, 100);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted width="720" height="560" />
      <canvas ref={canvasRef} style={{ position: "absolute", top: "0", left: "0" }} />
    </div>
  )

};