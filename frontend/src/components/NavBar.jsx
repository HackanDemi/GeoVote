import * as React from 'react';
import * as Mui from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import ReactImg from '../assets/croccat.png';
import LogoImg from '../assets/GeoVote.png';
import { logOut } from '../utilities';

const pages = [
  { name: 'Home', path: '/home' },
  { name: 'Map', path: '/map' },
  { name: 'Poll', path: '/poll' },
];
const settings = [
  { name: 'Profile', path: '/profile' },
  { name: 'Logout', path: '/login' },
];

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogOut = async() => {
    try {
      await logOut();
      navigate('/login')
      console.log('User successfully logged out')
    } catch(err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <Mui.AppBar position="static" sx={{ backgroundColor: '#7100AE' }}>
      <Mui.Container maxWidth="xl">
        <Mui.Toolbar disableGutters>
          <img src={LogoImg} alt="Logo" style={{ display: { xs: 'none', md: 'flex' }, marginRight: '8px', height: '40px' }} />
          <Mui.Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#FFFFFF',
              textDecoration: 'none',
            }}>
            GEOVOTE
          </Mui.Typography>

          <Mui.Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <Mui.IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: '#FFFFFF' }}>

              <MenuIcon />
            </Mui.IconButton>
            <Mui.Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}>

              {pages.map((page) => (
                <Mui.MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Mui.Typography sx={{ textAlign: 'center', color: '#7100AE' }}>
                    <Link to={page.path} style={{ textDecoration: 'none', color: '#7100AE' }}>
                      {page.name}
                    </Link>
                  </Mui.Typography>
                </Mui.MenuItem>
              ))}
            </Mui.Menu>
          </Mui.Box>
          <Mui.Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#FFFFFF',
              textDecoration: 'none',
            }}
          >
            GEOVOTE
          </Mui.Typography>
          <Mui.Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Mui.Button
                key={page.name}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: '#FFFFFF', display: 'block' }}
                component={Link}
                to={page.path}
              >
                {page.name}
              </Mui.Button>
            ))}
          </Mui.Box>
          <Mui.Box sx={{ flexGrow: 0 }}>
            <Mui.Tooltip title="Open settings">
              <Mui.IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Mui.Avatar alt="Mr. Geo Vote" src={ReactImg} />
              </Mui.IconButton>
            </Mui.Tooltip>
            <Mui.Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <Mui.MenuItem key={setting.name} onClick={setting.name === 'Logout' ? handleLogOut : handleCloseUserMenu}>
                  <Mui.Typography sx={{ textAlign: 'center', color: '#7100AE' }}>
                    <Link to={setting.path} style={{ textDecoration: 'none', color: '#7100AE' }}>
                      {setting.name}
                    </Link>
                  </Mui.Typography>
                </Mui.MenuItem>
              ))}
            </Mui.Menu>
          </Mui.Box>
        </Mui.Toolbar>
      </Mui.Container>
    </Mui.AppBar>
  );
}
export default NavBar;