import Calendar from "react-calendar";
import {DatePicker} from "@mui/x-date-pickers";
import {DateCalendar, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
export default function CalenderItem() {
    return(
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar></DateCalendar>
                <DatePicker/>
            </LocalizationProvider>
        </>
    )
}
