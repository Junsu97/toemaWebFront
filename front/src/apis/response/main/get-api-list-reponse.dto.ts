import ResponseDto from "../response.dto";
import ApiListItemInterface from "../../../types/interface/api-list-item.interface";
import ApiListResponseDto from "./api-list-response.dto";

export default interface GetApiListResponseDTO extends ResponseDto{
    result : ApiListResponseDto
}