import { ResponseDto } from "apis/response";

export default interface PatchUserRequestDTO {
    addr: string,
    addrDetail: string,
    school : string,
    userType : string,
    korean: boolean,
    math: boolean,
    science: boolean,
    social: boolean,
    english: boolean,
    desc: string
}