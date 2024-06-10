import {Dayjs} from "dayjs";
import HomeworkListItemInterface from "../../types/interface/homework-list-item.interface";
import TutoringListItemInterface from "../../types/interface/tutoring-list-item.interface";

export default interface DateInfo {
    date: Dayjs;
    homeworks: HomeworkListItemInterface[];
    tutorings: TutoringListItemInterface[];
}
