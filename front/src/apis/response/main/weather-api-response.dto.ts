import ResponseDto from "../response.dto";
import WeatherResponseDTO from "./weather-api-dto";


export default interface WeatherAPIResponseDTO extends ResponseDto{
    result: WeatherResponseDTO
}