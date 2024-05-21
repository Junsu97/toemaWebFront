import ResponseDto from "../response.dto";

export default interface GetTeacherResponseDTO extends ResponseDto{
    userId: string,
    nickname: string,
    school: string,
    profileImage: string|null,
    korean: boolean,
    math: boolean,
    science: boolean,
    social: boolean,
    english: boolean,
    desc : string
}