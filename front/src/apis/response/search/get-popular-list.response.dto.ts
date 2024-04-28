import ResponseDto from '../response.dto';

export default interface GetPopularListResponseDTO extends ResponseDto{
    popularWordList : string[];
}