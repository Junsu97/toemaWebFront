export default interface PostFaceIdRequestDTO{
    userId : string;
    accuracy: number;
  // expressions: {
  //   neutral: number;
  //   happy: number;
  //   sad: number;
  //   angry: number;
  //   fearful: number;
  //   disgusted: number;
  //   surprised: number;
  // };
  landMarks: { positions: Array<{ x: number; y: number; }> };
}