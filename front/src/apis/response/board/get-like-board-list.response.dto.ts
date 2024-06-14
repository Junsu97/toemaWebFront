import ResponseDto from "../response.dto";
import {BoardListDTO} from "../../../types/interface";

export default interface GetLikeBoardListResponseDTO extends ResponseDto{
    likeList : BoardListDTO[];
}