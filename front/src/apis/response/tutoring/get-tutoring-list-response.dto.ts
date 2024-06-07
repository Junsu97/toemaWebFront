import ResponseDto from "../response.dto";
import TutoringListItemInterface from "../../../types/interface/tutoring-list-item.interface";

export default interface GetTutoringListResponseDTO extends ResponseDto{
    tutoringList: TutoringListItemInterface[];
}