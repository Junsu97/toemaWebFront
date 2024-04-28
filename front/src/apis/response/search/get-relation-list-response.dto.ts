import ResponseDto from '../response.dto';

export default interface GetRelationListResponseDTO extends ResponseDto{
    relativeWordList: string[];
}