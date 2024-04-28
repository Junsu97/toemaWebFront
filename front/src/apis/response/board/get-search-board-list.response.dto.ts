import { BoardListDTO } from "types/interface";
import ResponseDto from "../response.dto";

export default interface GetSearchBoardListResonseDTO extends ResponseDto{
    searchList: BoardListDTO[];
}