// style.js
import styled from 'styled-components';
import Calendar from 'react-calendar';

export const StyledCalendarWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const StyledCalendar = styled(Calendar)`
    width: 100%;
    .react-calendar__tile {
        max-width: initial !important;
    }
`;
