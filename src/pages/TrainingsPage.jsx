import { useEffect, useState } from 'react';
import { getAllTrainings, deleteTraining } from '@/api/trainings';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, TableContainer, TextField, InputAdornment, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TablePagination } from '@material-ui/core';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
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
    '&:focus': { // Remove hover effect
      outline: 'none',
      border: 'none',
    },
    '&:hover': { // Remove hover effect
      backgroundColor: 'transparent',
    },
  },
  actionButton: {
    '&:focus': { // Remove hover effect
      outline: 'none',
      border: 'none',
    },
  },
  actionIcon: {
    color: 'black',
  }
});

const TrainingsPage = () => {
  const classes = useStyles();
  const [trainings, setTrainings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchInput, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  // Fetch all trainings
  useEffect(() => {
    const fetchTrainings = async () => {
      const data = await getAllTrainings();
      if (data) {
        setTrainings(data);
      }
    };
    fetchTrainings();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearch = (event) => setSearch(event.target.value);

  const handleClearSearch = () => setSearch('');

  // Sort trainings by field
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

  // Format date object to DD.MM.YYYY HH:MM AM/PM
  const handleDateObject = (date) => {
    return dayjs(date).format('DD.MM.YYYY HH:mm A');
  }  

  // Delete training by ID
  const handleDeleteTraining = async (training) => {
    if (!window.confirm(`Are you sure you want to delete ${training.activity} training?`)) {
      return;
    }
    const response = await deleteTraining(training.id);
    if (response) {
      const updatedTrainings = trainings.filter((t) => t.id !== training.id);
      setTrainings(updatedTrainings);

      // Check if page is out of bounds, if so, set page to previous page
      const numberOfPages = Math.ceil(updatedTrainings.length / rowsPerPage);
      if (page >= numberOfPages && page > 0) {
        setPage(numberOfPages - 1);  
      }
    }
  }
  
  const columnHeaders = () => (
      <TableHead>
        <TableRow>
          <TableCell>
            Actions
          </TableCell>
          <TableCell>
            <IconButton className={classes.sortingHeader} disableRipple onClick={() => handleColumnSort('activity')}>
              Activity{sortField === 'activity' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            <IconButton className={classes.sortingHeader} disableRipple onClick={() => handleColumnSort('date')}>
              Date{sortField === 'date' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            <IconButton className={classes.sortingHeader} disableRipple onClick={() => handleColumnSort('duration')}>
              Duration (min){sortField === 'duration' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            <IconButton className={classes.sortingHeader} disableRipple onClick={() => handleColumnSort('customer')}>
              Customer{sortField === 'customer' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
      </TableHead>
    )

  const TrainingsContent = (training, index) => (
    <TableRow key={index}>
      <TableCell>
        <IconButton onClick={() => handleDeleteTraining(training)} className={classes.actionButton}>
          <DeleteIcon className={classes.actionIcon} />
        </IconButton>
      </TableCell>
      <TableCell>{training.activity}</TableCell>
      <TableCell>{handleDateObject(training.date)}</TableCell>
      <TableCell>{training.duration}</TableCell>
      <TableCell>{training.customer.firstname} {training.customer.lastname}</TableCell>
    </TableRow>
  )
  
  // Display trainings
  const normalTrainingsContent = () => {
    return trainings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((training, index) => (
      TrainingsContent(training, index)
    ))
  }

  // Display search results
  const searchTrainingsContent = () => {
    return trainings.filter((training) => {
      return training.activity.toLowerCase().includes(searchInput.toLowerCase()) ||
        training.date.toLowerCase().includes(searchInput.toLowerCase()) ||
        training.duration.toString().toLowerCase().includes(searchInput.toLowerCase()) ||
        training.customer.firstname.toLowerCase().includes(searchInput.toLowerCase()) ||
        training.customer.lastname.toLowerCase().includes(searchInput.toLowerCase());
    }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((training, index) => (
      TrainingsContent(training, index)
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
            {searchInput === '' ? normalTrainingsContent() : searchTrainingsContent()}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
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