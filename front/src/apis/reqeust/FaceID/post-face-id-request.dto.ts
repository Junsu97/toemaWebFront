export default interface PostFaceIdRequestDTO{
    accuracy: number;
  expressions: {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  };
  landmarks: { positions: Array<{ x: number; y: number; }> };
}