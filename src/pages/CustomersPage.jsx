import { useEffect, useState } from 'react';
import { getAllCustomers } from "@/api/customers";
import { addNewCustomer } from "@/api/customers";
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, Grid } from '@material-ui/core';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddBoxIcon from '@mui/icons-material/AddBox';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  searchInput: {
    marginTop: 'auto !important',
    marginLeft: 'auto !important',
  },
  tableContainer: {
    verticalAlign: 'top'
  },
  sortingHeader: {
    padding: '0px',
    fontSize: '14px !important',
    color: 'black !important',
    '&:focus': { // Remove hover effect
      outline: 'none',
      border: 'none',
    },
    '&:hover': { // Remove hover effect
      backgroundColor: 'transparent',
    },
  },
  diaglogAddCustomerButton: {
    marginTop: 'auto !important',
    paddingBottom: '5px !important',
    paddingLeft: '5px !important',
  },
  dialogCloseButton: {
    color: 'red',
    marginRight: 'auto',
    border: '1px solid red !important',
    borderRadius: '5px !important',
    marginRight: '5px',
  },
  addCustomerButton: {
    color: 'blue',
    marginLeft: 'auto',
    border: '1px solid blue !important',
    borderRadius: '5px !important',
  },
  dialogButtons: {
    marginTop: '10px',
  },
  dialogTextFieldContainer: {
    marginTop: 12, // Adjust the top margin for spacing between text fields
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
  const [dialogOpen, setDialogOpen] = useState(false);

  const [newCustomer, setNewCustomer] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    streetaddress: '',
    postcode: '',
    city: ''
  });

  // Fetch all customers
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

  // Sort customers by field
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

  // Handle adding a new customer
  const handleAddCustomer = async (event) => {
    event.preventDefault();

    // Validate new customer fields
    if (newCustomer.firstname !== '' && newCustomer.lastname !== '' && newCustomer.email !== '' && newCustomer.phone !== '' && newCustomer.streetaddress !== '' && newCustomer.postcode !== '' && newCustomer.city !== '') {
      return;
      await addNewCustomer(newCustomer);
      resetDialog();
      const data = await getAllCustomers();
      setCustomers(data);
    }
  };

  // Reset dialog fields and errors
  const resetDialog = () => {
    setDialogOpen(false);
    setNewCustomer({
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      streetaddress: '',
      postcode: '',
      city: ''
    });
  }


  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const handleDialogOpen = () => {
    setDialogOpen(true);
  }


  const handleChange = (e) => {
    const { id, value } = e.target;
    setNewCustomer(prevState => ({
      ...prevState,
      [id]: value
    }));
  }



  // Table column headers
  const columnHeadersContent = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell>
            <IconButton
              className={classes.sortingHeader} disableRipple onClick={() => handleColumnSort('firstname')}>
              First name{sortField === 'firstname' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            <IconButton className={classes.sortingHeader} disableRipple onClick={() => handleColumnSort('lastname')}>
              Last name{sortField === 'lastname' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            <IconButton className={classes.sortingHeader} disableRipple onClick={() => handleColumnSort('email')}>
              Email{sortField === 'email' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            <IconButton className={classes.sortingHeader} disableRipple onClick={() => handleColumnSort('phone')}>
              Phone{sortField === 'phone' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            <IconButton className={classes.sortingHeader} disableRipple onClick={() => handleColumnSort('streetaddress')}>
              Street address{sortField === 'streetaddress' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            <IconButton className={classes.sortingHeader} disableRipple onClick={() => handleColumnSort('postcode')}>
              Postcode{sortField === 'postcode' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>
            <IconButton className={classes.sortingHeader} disableRipple onClick={() => handleColumnSort('city')}>
              City{sortField === 'city' && sortOrder === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
      </TableHead>
    );
  }

  // Table rows
  const normalCustomersContent = () => {
    return customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer, index) => ( // Slice the array to display only the current page
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

  // Table rows with search filter
  const searchCustomersContent = () => {
    return customers.filter((customer) => { // Filter customers based on search input
      return customer.firstname.toLowerCase().includes(searchInput.toLowerCase()) ||
        customer.lastname.toLowerCase().includes(searchInput.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchInput.toLowerCase()) ||
        customer.phone.toLowerCase().includes(searchInput.toLowerCase()) ||
        customer.streetaddress.toLowerCase().includes(searchInput.toLowerCase()) ||
        customer.postcode.toLowerCase().includes(searchInput.toLowerCase()) ||
        customer.city.toLowerCase().includes(searchInput.toLowerCase());
    }).map((customer, index) => ( // Map through filtered customers
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

  // Dialog content
  const dialogContent = () => {
    return (
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <form onSubmit={handleAddCustomer}>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogContent>
            <Grid container direction="column" spacing={2}>
              {[{ field: 'firstname', type: 'text' },
              { field: 'lastname', type: 'text' },
              { field: 'email', type: 'email' },
              { field: 'phone', type: 'text' },
              { field: 'streetaddress', type: 'text' },
              { field: 'postcode', type: 'text' },
              { field: 'city', type: 'text' }]
                .map(({ field, type }) => (
                  <Grid item key={field} className={classes.dialogTextFieldContainer}>
                    <TextField
                      id={field}
                      label={field.replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase())} // Converts camelCase to words with first letter capitalized
                      type={type}
                      required
                      value={newCustomer[field]}
                      onChange={handleChange}
                      fullWidth
                    />
                  </Grid>
                ))
              }
            </Grid>
            <div className={classes.dialogButtons}>
              <IconButton className={classes.dialogCloseButton} onClick={handleDialogClose}>
                Close
              </IconButton>
              <IconButton className={classes.addCustomerButton} type="submit">
                Add customer
              </IconButton>
            </div>
          </DialogContent>
        </form>
      </Dialog>
    )
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
          <IconButton className={classes.diaglogAddCustomerButton} onClick={handleDialogOpen}>
            <AddBoxIcon />
          </IconButton>
          {dialogContent()}
        </div>
        <Table className={classes.table} aria-label="simple table">
          {columnHeadersContent()}
          <TableBody>
            {searchInput === '' ? normalCustomersContent() : searchCustomersContent()}
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