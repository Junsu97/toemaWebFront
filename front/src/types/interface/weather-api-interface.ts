import WeatherIconDescInterface from "./weather-icon-desc-interface";
import WeatherMainInterface from "./weather-main-interface";


export default interface WeatherAPIDTO {
    weather: WeatherIconDescInterface[],
    main: WeatherMainInterface,
    name: string,
    id: number
}