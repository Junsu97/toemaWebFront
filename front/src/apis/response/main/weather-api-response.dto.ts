import ResponseDto from "../response.dto";
import WeatherAPIDTO from "../../../types/interface/weather-api-interface";


export default interface WeatherAPIResponseDTO extends ResponseDto{
    result: WeatherAPIDTO
}