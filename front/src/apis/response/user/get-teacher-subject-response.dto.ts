import ResponseDto from "../response.dto";

export default interface GetTeacherSubjectResponseDto extends ResponseDto{
    korean: boolean,
    math: boolean,
    science: boolean,
    social: boolean,
    english: boolean,
    desc: string
}