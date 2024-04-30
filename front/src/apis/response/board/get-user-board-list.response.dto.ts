import { BoardListDTO } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetUserBoardListResponseDTO extends ResponseDto{
    userBoardList: BoardListDTO[];
}