import { ResponseDto } from "apis/response";

export default interface PatchUserRequestDTO {
    addr: string,
    addrDetail: string,
    school : string,
    userType : string
}