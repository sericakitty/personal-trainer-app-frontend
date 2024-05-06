import { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import { getAllTrainings } from '@/api/trainings';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const localizer = dayjsLocalizer(dayjs);

const CalendarPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [calendarWidth, setCalendarWidth] = useState(window.innerWidth - 50);
  const [calendarHeight, setCalendarHeight] = useState(window.innerHeight - 200);

  useEffect(() => {
    const fetchTrainings = async () => {
      const data = await getAllTrainings();
      if (data) {
        // Convert trainings to calendar format
        const calendarData = data.map((training) => {

          const startDate =  new Date(training.date);
          const offset = startDate.getTimezoneOffset();
          startDate.setMinutes(startDate.getMinutes() + offset);
          const endDate = new Date(startDate);
          endDate.setMinutes(endDate.getMinutes() + training.duration);
          
          return {
            title: training.activity,
            start: startDate,
            end: endDate,
            allDay: false,
          }
        })
        setTrainings(calendarData);
      }
    }
    fetchTrainings();
  }, []);

  // Update calendar width and height on window resize
  useEffect(() => {
    const handleResize = () => {
      setCalendarWidth(window.innerWidth - 50);
      setCalendarHeight(window.innerHeight - 200);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  });

  return (
    <Calendar
      localizer={localizer}
      defaultView='month'
      events={trainings}
      startAccessor="start"
      endAccessor="end"
      style={{ height: calendarHeight, width: calendarWidth }}
      />
  )
  
};

export default CalendarPage;


