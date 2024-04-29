import { useEffect, useState } from 'react';
import { getAllTrainings } from '../api/trainings';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, TableContainer, TextField, InputAdornment, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TablePagination } from '@material-ui/core';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import dayjs from 'dayjs';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  searchInput: {
    marginTop: 'auto',
    marginLeft: 'auto',
  },
  tableContainer: {
    verticalAlign: 'top'
  },
  sortingHeader: {
    padding: '0px',
    fontSize: '14px',
    color: 'black',
  },
});

const TrainingsPage = () => {
  const classes = useStyles();
  const [trainings, setTrainings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchInput, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchTrainings = async () => {
      const data = await getAllTrainings();
      setTrainings(data);
    };

    fetchTrainings();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  }

  const handleClearSearch = () => {
    setSearch('');
  }

  const handleColumnSort = (field) => {
    let order = 'asc';
    if (sortField === field && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortField(field);
    setSortOrder(order);

    trainings.sort((a, b) => {
      if (order === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
  };

  const handleDateObject = (date) => {
    // DD/MM/YYYY HH:MM AM/PM
    return dayjs(date).format('DD.MM.YYYY HH:mm A');
  }  
  
  const columnHeaders = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell onClick={() => handleColumnSort('activity')}>
            <IconButton className={classes.sortingHeader}>
              Activity{sortField === 'activity' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell onClick={() => handleColumnSort('date')}>
            <IconButton className={classes.sortingHeader}>
              Date{sortField === 'date' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell onClick={() => handleColumnSort('duration')}>
            <IconButton className={classes.sortingHeader}>
              Duration (min){sortField === 'duration' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell onClick={() => handleColumnSort('customer')}>
            <IconButton className={classes.sortingHeader}>
              Customer{sortField === 'customer' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
      </TableHead>
    )
  }

  const normalTrainingsOutput = () => {
    return trainings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((training, index) => (
      <TableRow key={index}>
        <TableCell>{training.activity}</TableCell>
        <TableCell>{handleDateObject(training.date)}</TableCell>
        <TableCell>{training.duration}</TableCell>
        <TableCell>{training.customer.firstname} {training.customer.lastname}</TableCell>
      </TableRow>
    ))
  }

  const searchTrainingsOutput = () => {
    return trainings.filter((training) => {
      return training.activity.toLowerCase().includes(searchInput.toLowerCase()) ||
        training.date.toLowerCase().includes(searchInput.toLowerCase()) ||
        training.duration.toString().toLowerCase().includes(searchInput.toLowerCase()) ||
        training.customer.firstname.toLowerCase().includes(searchInput.toLowerCase()) ||
        training.customer.lastname.toLowerCase().includes(searchInput.toLowerCase());
    }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((training, index) => (
      <TableRow key={index}>
        <TableCell>{training.activity}</TableCell>
        <TableCell>{handleDateObject(training.date)}</TableCell>
        <TableCell>{training.duration}</TableCell>
        <TableCell>{training.customer.firstname} {training.customer.lastname}</TableCell>
      </TableRow>
    ))
  }

  return (
    <Paper>
      <TableContainer className={classes.tableContainer}>
        <div style={{ display: 'flex', padding: '16px' }}>
          <h3>Trainings</h3>
          <TextField
            className={classes.searchInput}
            variant="standard"
            size="small"
            placeholder="Search"
            value={searchInput}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch} >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            />
        </div>
      <Table className={classes.table} aria-label="simple table">
          {columnHeaders()}
          <TableBody>
            {searchInput === '' ? normalTrainingsOutput() : searchTrainingsOutput()}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={trainings.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
};

export default TrainingsPage;