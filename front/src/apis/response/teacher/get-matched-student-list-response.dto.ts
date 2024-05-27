import ResponseDto from "../response.dto";
import MatchedStudentListItemInterface from "../../../types/interface/matched-student-list-item.interface";

export default interface GetMatchedStudentListResponseDto extends ResponseDto{
    studentList: MatchedStudentListItemInterface[];
}