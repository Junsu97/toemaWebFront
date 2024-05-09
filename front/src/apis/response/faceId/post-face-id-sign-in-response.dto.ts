import ResponseDto from "../response.dto";

export default interface PostFaceIdSignInResponseDto extends ResponseDto{
    token : string;
    expirationTime: number;
}