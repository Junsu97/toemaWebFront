import ResponseDto from "../response.dto";
import HomeworkListItemInterface from "../../../types/interface/homework-list-item.interface";

export default interface GetHomeworkListResponseDto extends ResponseDto{
    homeworkList: HomeworkListItemInterface[];
}