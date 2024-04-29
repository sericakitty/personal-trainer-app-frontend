import { useEffect, useState } from 'react';
import { getAllCustomers } from "@/api/customers";
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, IconButton, InputAdornment } from '@material-ui/core';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  searchInput: {
    marginTop: 'auto',
    marginLeft: 'auto',
  },
  actionCell: {
    display: 'flex',
    alignItems: 'center',
  },
  addTrainingButton: {
    fontSize: '12px',
    color: 'blue',
  },
  tableContainer: {
    verticalAlign: 'top'
  },
  addCustomerForm: {
    maxWidth: '300px',
  },
  sortingHeader: {
    padding: '0px',
    fontSize: '14px',
    color: 'black',
  },

});

const CustomersPage = () => {
  const classes = useStyles();
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchInput, setSearch] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchCustomers = async () => {
      const data = await getAllCustomers();
      setCustomers(data);
    };

    fetchCustomers();
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
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  const handleColumnSort = (field) => {
    let order = 'asc';
    if (sortField === field && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortField(field);
    setSortOrder(order);

    customers.sort((a, b) => {
      if (order === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
  };

  const columnHeaders = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell onClick={() => handleColumnSort('firstname')}>
            <IconButton className={classes.sortingHeader}>
              First name{sortField === 'firstname' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell onClick={() => handleColumnSort('lastname')}>
            <IconButton className={classes.sortingHeader}>
              Last name{sortField === 'lastname' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell onClick={() => handleColumnSort('email')}>
            <IconButton className={classes.sortingHeader}>
              Email{sortField === 'email' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell onClick={() => handleColumnSort('phone')}>
            <IconButton className={classes.sortingHeader}>
              Phone{sortField === 'phone' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell onClick={() => handleColumnSort('streetaddress')}>
            <IconButton className={classes.sortingHeader}>
              Street address{sortField === 'streetaddress' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell onClick={() => handleColumnSort('postcode')}>
            <IconButton className={classes.sortingHeader}>
              Postcode{sortField === 'postcode' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell onClick={() => handleColumnSort('city')}>
            <IconButton className={classes.sortingHeader}>
              City{sortField === 'city' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }

  const normalCustomersOutput = () => {
    return customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer, index) => (
      <TableRow key={index}>
        <TableCell>{customer.firstname}</TableCell>
        <TableCell>{customer.lastname}</TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell>{customer.phone}</TableCell>
        <TableCell>{customer.streetaddress}</TableCell>
        <TableCell>{customer.postcode}</TableCell>
        <TableCell>{customer.city}</TableCell>
      </TableRow>
    ))
  }

  const searchCustomersOutput = () => {
    return customers.filter((customer) => {
      return customer.firstname.toLowerCase().includes(searchInput.toLowerCase()) ||
        customer.lastname.toLowerCase().includes(searchInput.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchInput.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchInput.toLowerCase()) ||
        customer.streetaddress.toLowerCase().includes(searchInput.toLowerCase()) ||
        customer.postcode.toLowerCase().includes(searchInput.toLowerCase()) ||
        customer.city.toLowerCase().includes(searchInput.toLowerCase());
    }).map((customer, index) => (
      <TableRow key={index}>
        <TableCell>{customer.firstname}</TableCell>
        <TableCell>{customer.lastname}</TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell>{customer.phone}</TableCell>
        <TableCell>{customer.streetaddress}</TableCell>
        <TableCell>{customer.postcode}</TableCell>
        <TableCell>{customer.city}</TableCell>
      </TableRow>
    ))
  }


  return (
    <Paper>
      <TableContainer className={classes.tableContainer}>
        <div style={{ display: 'flex', padding: '16px' }}>
          

          <h3>Customers</h3>
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
            {searchInput === '' ? normalCustomersOutput() : searchCustomersOutput()}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={customers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default CustomersPage;