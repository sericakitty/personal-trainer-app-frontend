import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Divider, makeStyles } from '@material-ui/core';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ContactsIcon from '@mui/icons-material/Contacts';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import EventIcon from '@mui/icons-material/Event';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { Link as RouterLink } from 'react-router-dom';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    zIndex: theme.zIndex.drawer + 1,
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-start',
    ...theme.mixins.toolbar,
  },
  listItemText: {
    paddingLeft: theme.spacing(3),
  },
  routerlink: {
    textDecoration: 'none',
    color: 'gray',
  },
  routerDiv: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const TheNavbar = () => {
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // This function toggles the drawer open and closed
  const handleDrawerToggle = () => {
    setDrawerOpen(prevDrawerOpen => !prevDrawerOpen);
  };

  // This effect closes the drawer when clicking outside of it
  useEffect(() => {
    const closeDrawerOnClickOutside = (event) => {
      if (!document.getElementById('drawer').contains(event.target) && drawerOpen) {
        setDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', closeDrawerOnClickOutside);

    return () => {
      document.removeEventListener('mousedown', closeDrawerOnClickOutside);
    };
  }, [drawerOpen]);

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={`${classes.appBar} ${drawerOpen ? classes.appBarShift : ''}`}
      >
        <Toolbar> 
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            className={`${classes.menuButton} ${drawerOpen ? 'hide' : ''}`}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Personal Trainer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        id="drawer" // Lisätty id Drawer-elementtiin referenssiä varten
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {[
            {
              text: 'Customers',
              icon: <ContactsIcon />,
              link: '/'
            },
            {
              text: 'Trainings',
              icon: <DirectionsRunIcon />,
              link: '/trainings'
            },
            {
              text: 'Calendar',
              icon: <EventIcon />,
              link: '/calendar'
            },
            {
              text: 'Statistics',
              icon: <EqualizerIcon />,
              link: '/statistics'
            }
          ].map((item) => (
            <ListItem button key={item.text}>
              <RouterLink to={item.link} className={classes.routerlink} onClick={handleDrawerToggle}>
                <div className={classes.routerDiv}>
                  {item.icon}
                  <ListItemText className={classes.listItemText} primary={item.text} />
                </div>
              </RouterLink>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
}

export default TheNavbar;