import { BoardListDTO } from 'types/interface';
import ResponseDto from '../response.dto';

export default interface GetTop3BoardListResponseDTO extends ResponseDto{
    top3List: BoardListDTO[];
}
