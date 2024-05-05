import { useEffect, useState } from 'react';
import { getAllCustomers, addNewCustomer, updateCustomer, deleteCustomer } from "@/api/customers";
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, IconButton, InputAdornment, Dialog, DialogTitle, DialogContent, Grid } from '@material-ui/core';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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
  actionIcon: {
    color: 'black',
  }
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

  // Dialog state, if true, the edit dialog will be opened
  const [isEditMode, setIsEditMode] = useState(false);
  // Current customer state for editing
  const [currentCustomer, setCurrentCustomer] = useState(null);

  // New customer state for adding or updating
  const [newCustomer, setNewCustomer] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    streetaddress: '',
    postcode: '',
    city: ''
  });

  const handleGetAllCustomers = async () => {
    try {
      const data = await getAllCustomers();
      if (data) {
        data.forEach((customer) => {
          customer.id = parseInt(customer._links.customer.href.split('/').pop());
        });
        setCustomers(data);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      alert('Failed to load customer data');
    }
  }

  // Fetch all customers
  useEffect(() => {
    const fetchCustomers = async () => {
      await handleGetAllCustomers();
    }

    fetchCustomers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleSearchInput = (event) => {
    setSearch(event.target.value);
  };

  const handleClearSearchInput = () => {
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

  // Add a new customer
  const handleAddCustomer = async (event) => {
    event.preventDefault();
    if (newCustomer.firstname === '' || newCustomer.lastname === '' || newCustomer.email === '' || newCustomer.phone === '' || newCustomer.streetaddress === '' || newCustomer.postcode === '' || newCustomer.city === '') {
      alert('Please fill in all fields');
      return;
    }
    const response = await addNewCustomer(newCustomer);

    if (response) {
      await handleGetAllCustomers();
    } else {
      alert('Failed to add new customer');
    }
    resetDialog();
  }

  // Update an existing customer
  const handleUpdateCustomer = async (event) => {
    event.preventDefault();

    if (newCustomer.firstname === '' || newCustomer.lastname === '' || newCustomer.email === '' || newCustomer.phone === '' || newCustomer.streetaddress === '' || newCustomer.postcode === '' || newCustomer.city === '') {
      alert('Please fill in all fields');
      return;
    }

    const response = await updateCustomer(currentCustomer.id, newCustomer);
    if (response) {
      await handleGetAllCustomers();
    } else {
      alert('Failed to update customer');
    }
    resetDialog();
  }

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
    setCurrentCustomer(null);
    setIsEditMode(false);
  };


  const handleDialogAddCustomerOpen = () => {
    setIsEditMode(false);
    setDialogOpen(true);
  }

  const handleDialogEditCustomerOpen = (customer) => {
    setIsEditMode(true);
    setCurrentCustomer(customer);
    setNewCustomer(customer);
    setDialogOpen(true);
  }


  const handleDialogTextfieldChange = (e) => {
    const { id, value } = e.target;
    setNewCustomer(prevState => ({
      ...prevState,
      [id]: value
    }));
  }

  // Handle deleting a customer
  const handleDeleteCustomer = async (customer) => {
    if (!customer.id) return;
    if (window.confirm(`Are you sure you want to delete ${customer.firstname} ${customer.lastname}?`)) {
      const response = await deleteCustomer(customer.id);
      if (response) {

        const updatedCustomers = customers.filter(c => c.id !== customer.id);
        setCustomers(updatedCustomers);

        // calculate the number of pages after deleting a customer
        const numberOfPages = Math.ceil(updatedCustomers.length / rowsPerPage);
        if (page >= numberOfPages && page > 0) {
          setPage(numberOfPages - 1);  // update the page number if the current page is greater than the number of pages
        }
      } else {
        alert('Failed to delete customer');
      }
    }
  }

  // Table column headers
  const columnHeadersContent = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell>
            Actions
          </TableCell>
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

  // Table row content
  const customerContent = (customer, index) => {
    return (
      <TableRow key={index}>
        <TableCell>
          <IconButton onClick={() => handleDeleteCustomer(customer)}>
            <DeleteIcon className={classes.actionIcon} />
          </IconButton>
          <IconButton onClick={() => handleDialogEditCustomerOpen(customer)}>
            <EditIcon className={classes.actionIcon} />
          </IconButton>
        </TableCell>
        <TableCell>{customer.firstname}</TableCell>
        <TableCell>{customer.lastname}</TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell>{customer.phone}</TableCell>
        <TableCell>{customer.streetaddress}</TableCell>
        <TableCell>{customer.postcode}</TableCell>
        <TableCell>{customer.city}</TableCell>
      </TableRow>
    );
  }

  // Table rows without search filter
  const normalCustomersContent = () => {
    return customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer, index) => (
      customerContent(customer, index)
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
    }).map((customer, index) => (
      customerContent(customer, index)
    ))
  }

  // Dialog content for adding a new customer
  const dialogAddCustomerContent = () => (
    <Dialog open={dialogOpen} onClose={handleDialogClose}>
      <form onSubmit={handleAddCustomer}>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={2}>
            {Object.keys(newCustomer).map((field) => (
              <Grid item key={field} className={classes.dialogTextFieldContainer}>
                <TextField
                  id={field}
                  label={field.replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase())}
                  type={field === 'email' ? 'email' : 'text'}
                  required
                  value={newCustomer[field]}
                  onChange={handleDialogTextfieldChange}
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
          <div className={classes.dialogButtons}>
            <IconButton className={classes.dialogCloseButton} onClick={handleDialogClose}>
              Close
            </IconButton>
            <IconButton className={classes.addCustomerButton} type="submit">
              Add Customer
            </IconButton>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );

  // Dialog content for editing an existing customer
  const dialogEditCustomerContent = () => (
    <Dialog open={dialogOpen} onClose={handleDialogClose}>
      <form onSubmit={handleUpdateCustomer}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={2}>
            {Object.keys(currentCustomer).filter(field => field !== 'id' && field !== '_links').map((field) => (
              <Grid item key={field} className={classes.dialogTextFieldContainer}>
                <TextField
                  id={field}
                  label={field.replace(/([A-Z])/g, ' $1').replace(/^\w/, (c) => c.toUpperCase())}
                  type={field === 'email' ? 'email' : 'text'}
                  required
                  value={newCustomer[field]}
                  onChange={handleDialogTextfieldChange}
                  fullWidth
                />
              </Grid>
            ))}
          </Grid>
          <div className={classes.dialogButtons}>
            <IconButton className={classes.dialogCloseButton} onClick={handleDialogClose}>
              Close
            </IconButton>
            <IconButton className={classes.addCustomerButton} type="submit">
              Update Customer
            </IconButton>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  );


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
            onChange={handleSearchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearchInput} >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <IconButton className={classes.diaglogAddCustomerButton} onClick={() => handleDialogAddCustomerOpen()}>
            <AddBoxIcon />
          </IconButton>
          {isEditMode ? dialogEditCustomerContent() : dialogAddCustomerContent()}
        </div>
        <Table className={classes.table} aria-label="simple table">
          {columnHeadersContent()}
          <TableBody>
            {searchInput === '' ? normalCustomersContent() : searchCustomersContent()}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
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


