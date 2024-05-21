import ResponseDto from "../response.dto";
import ApplyListItemInterface from "../../../types/interface/apply-list-item.interface";

export default interface PostApplyListResponseDto extends ResponseDto{
    applyList:ApplyListItemInterface[];
}