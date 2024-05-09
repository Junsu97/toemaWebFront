export default interface PostFaceIdSignInRequestDTO {
    userType: string;
    accuracy: number;
    landMarks: { positions: Array<{ x: number; y: number; }> };
}