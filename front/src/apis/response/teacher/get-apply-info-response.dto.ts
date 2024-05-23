import ResponseDto from "../response.dto";

export default interface GetApplyInfoResponseDTO extends ResponseDto{
    teacherId:string,
    studentId:string,
    status:string,
    content:string,
    writeDatetime:string
}