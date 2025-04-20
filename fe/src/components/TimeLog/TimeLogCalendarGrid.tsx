import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Tooltip,
  useTheme,
} from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { format, isToday } from 'date-fns';
import { TimeLogCalendarGridProps } from '../../types/timeLog';

const TimeLogCalendarGrid: React.FC<TimeLogCalendarGridProps> = ({
  days,
  timeLogs,
  getTimeLogsForDate,
  getTotalHoursForDate,
  getDayColor,
  formatTime,
}) => {
  const theme = useTheme();

  return (
    <Grid container spacing={1}>
      {days.map(day => {
        const totalHours = getTotalHoursForDate(day, timeLogs);
        const logs = getTimeLogsForDate(day, timeLogs);
        
        return (
          <Grid item xs={12/7} key={day.toString()} role="gridcell">
            <Tooltip title={
              <Box data-testid="timelog-tooltip">
                <Typography variant="subtitle2">
                  {format(day, 'MMMM d, yyyy')}
                </Typography>
                {logs.map(log => (
                  <Typography key={log.id} variant="body2">
                    {log.task_name}: {formatTime(log.spent_time)}
                  </Typography>
                ))}
              </Box>
            }>
              <Paper
                data-testid="timelog-day-paper"
                elevation={isToday(day) ? 3 : 1}
                sx={{
                  p: 1,
                  height: '100px',
                  backgroundColor: getDayColor(totalHours),
                  border: isToday(day) ? `2px solid ${theme.palette.primary.main}` : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <Typography variant="caption">
                  {format(day, 'd')}
                </Typography>
                <Chip
                  size="small"
                  icon={<AccessTime />}
                  label={`${totalHours.toFixed(1)}h`}
                  sx={{ 
                    position: 'absolute',
                    bottom: 4,
                    right: 4,
                    backgroundColor: 'rgba(255,255,255,0.8)'
                  }}
                />
              </Paper>
            </Tooltip>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default TimeLogCalendarGrid;
