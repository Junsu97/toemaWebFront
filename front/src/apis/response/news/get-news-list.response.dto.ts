import ResponseDto from "../response.dto";
import NewsListDTO from "../../../types/interface/news-list-item.interface";

export default interface GetNewsListResponseDTO extends ResponseDto{
    crawlingList : NewsListDTO[];
}