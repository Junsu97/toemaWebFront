import ResponseDto from "../response.dto";
import {TeacherListItemInterface} from "../../../types/interface";

export default interface GetTeacherListResponseDTO extends ResponseDto{
    teacherList: TeacherListItemInterface[];
}