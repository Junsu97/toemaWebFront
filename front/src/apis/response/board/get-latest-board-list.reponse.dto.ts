import { BoardListDTO } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetLatesttBoardListResponseDTO extends ResponseDto{
    latestList : BoardListDTO[];
}