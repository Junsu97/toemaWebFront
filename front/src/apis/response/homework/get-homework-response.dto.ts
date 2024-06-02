import ResponseDto from "../response.dto";
import HomeworkListItemInterface from "../../../types/interface/homework-list-item.interface";

export default interface GetHomeworkResponseDTO  extends ResponseDto{
    homeworkList: HomeworkListItemInterface[];
}