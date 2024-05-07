
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';
import { getAllTrainings } from '@/api/trainings';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  chartContainer: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginRight: 'auto',
    marginLeft: 20,
  },
  chart: {
    marginRight: 30,
    marginLeft: 20,
  },
});

const StatisticsPage = () => {
  const classes = useStyles();
  const [trainings, setTrainings] = useState([]);
  const [maxDuration, setMaxDuration] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [statisticsContainerWidth, setStatisticsContainerWidth] = useState(window.innerWidth - 50);
  const [statisticsContainerHeight, setStatisticsContainerHeight] = useState(window.innerHeight - 500);

  useEffect(() => {
    const fetchTrainings = async () => {
      const data = await getAllTrainings();
      if (data) {
        const groupedData = _(data)
          .groupBy('activity')
          .map((items, activity) => ({
            activity: activity,
            duration: _.sumBy(items, (item) => item.duration),
          })).value();
        setTrainings(groupedData);
        setMaxDuration(Math.max(...groupedData.map((training) => training.duration)));
        setTotalDuration(_.sumBy(groupedData, (training) => training.duration));
      }
    };
    fetchTrainings();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setStatisticsContainerWidth(window.innerWidth - 50);
      setStatisticsContainerHeight(window.innerHeight - 500);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <Paper>
      <div className={classes.container}>
          <h3 className={classes.header}>Statistics</h3>
          <p className={classes.header}>Total duration: {totalDuration} minutes</p>
        <div className={classes.chartContainer}>
          <BarChart width={statisticsContainerWidth} height={statisticsContainerHeight} data={trainings} className={classes.chart}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="activity" />
            <YAxis dataKey="duration" label={{ value: 'Duration (min)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: 'black' } }}
              tickCount={(maxDuration / 100) + 2} // Adjust this based on your data's range and desired interval
              domain={[0, (duration) => Math.ceil((duration + 1) / 100) * 100]} // Rounds up Y-axis labels to the nearest 100
            />
            <Bar dataKey="duration" fill="#8884d8">
              <LabelList dataKey="duration" position="top" style={{ fill: 'black', fontSize: 12 }} />
            </Bar>
          </BarChart>
        </div>
      </div>
    </Paper>
  );
};

export default StatisticsPage;
