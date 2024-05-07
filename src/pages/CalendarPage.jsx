import { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import { makeStyles } from '@material-ui/core/styles';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import { getAllTrainings } from '@/api/trainings';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const localizer = dayjsLocalizer(dayjs);

const useStyles = makeStyles({
  eventCloseModal: {
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    backgroundColor: 
    'rgba(0,0,0,0.5)', 
    zIndex: 1000
  },
  eventModal: {
    position: 'fixed', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)', 
    backgroundColor: 'white', 
    padding: '20px', 
    zIndex: 1001 
  }
})

const CalendarPage = () => {
  const classes = useStyles();
  const [trainings, setTrainings] = useState([]);
  const [calendarWidth, setCalendarWidth] = useState(window.innerWidth - 50);
  const [calendarHeight, setCalendarHeight] = useState(window.innerHeight - 200);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchTrainings = async () => {
      const data = await getAllTrainings();
      if (data) {
        // Convert trainings to calendar format
        const calendarData = data.map((training) => {

          const startDate = new Date(training.date);
          const offset = startDate.getTimezoneOffset();
          startDate.setMinutes(startDate.getMinutes() + offset);
          const endDate = new Date(startDate);
          endDate.setMinutes(endDate.getMinutes() + training.duration);
          
          // check if the training goes over multiple days
          const allDay = !dayjs(startDate).isSame(dayjs(endDate), 'day');

          return {
            title: training.activity,
            start: startDate,
            end: endDate,
            allDay: allDay
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
      setCalendarHeight(window.innerHeight - 300);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  });

  const handleEventClick = (event) => setSelectedEvent(event); // Set the selected event to display in the modal

  const handleModalClose = () => setSelectedEvent(null); // Close the modal

  const handleDateFormatter = (date) => dayjs(date).format('ddd DD MMMM YYYY'); // Format date to 'ddd DD MMMM YYYY'

  const handleTimeFormatter = (date) => dayjs(date).format('hh:mm A'); // Format time to 'hh:mm AM/PM'


  return (
    <>
      <Calendar
        localizer={localizer}
        defaultView='month'
        events={trainings}
        startAccessor="start"
        endAccessor="end"
        style={{ height: calendarHeight, width: calendarWidth }}
        onSelectEvent={handleEventClick}
      />
      {/* This is the modal that will display the selected event details when an event is clicked. */}
      {selectedEvent && (
        <>
          <div className={classes.eventCloseModal} onClick={handleModalClose} />
          <div className={classes.eventModal}>
            <h2>{selectedEvent.title}</h2>
            <p>Start: {handleDateFormatter(selectedEvent.start)} at {handleTimeFormatter(selectedEvent.start)}</p>
            <p>End: {handleDateFormatter(selectedEvent.end)} at {handleTimeFormatter(selectedEvent.end)}</p>
            <p>Duration: {dayjs(selectedEvent.end).diff(selectedEvent.start, 'minutes')} minutes</p>
            <button onClick={handleModalClose}>Close</button>
          </div>
        </>
      )}
    </>
  )

};

export default CalendarPage;


