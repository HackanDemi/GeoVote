import { Card, CardActions, CardContent, Button, Container, Grid, MenuItem, ThemeProvider, createTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { getInfo } from '../utilities'; //  , updateUserProfile
import CustomTextField from './CustomText';


  const theme = createTheme({
    palette: {
      background: {
        paper: '#1e1e2f',
      },
      text: {
        primary: "#d3d3d3",
        secondary: "#acacac",
      },
    }
  });

  const STYLES = {
    cardContainer: {
      bgcolor: 'background.paper',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(128, 90, 213, 0.8)',
      margin: '20px auto',
      padding: '20px',
    },
    name: {
      color: 'text.primary',
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '8px',
    },
    text: {
      color: 'text.primary',
      marginBottom: '8px',
    },
  };

const ProfileCard = () => {
  const [formData, setFormData] = useState({first_name:'', last_name:'', email:'', birth_date:'', bio:'', address: {street:'', city:'', state:'', zip_code:''}}); 
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);  


  const states = [
    { name: 'Alabama', abbreviation: 'AL' },
    { name: 'Alaska', abbreviation: 'AK' },
    { name: 'Arizona', abbreviation: 'AZ' },
    { name: 'Arkansas', abbreviation: 'AR' },
    { name: 'California', abbreviation: 'CA' },
    { name: 'Colorado', abbreviation: 'CO' },
    { name: 'Connecticut', abbreviation: 'CT' },
    { name: 'Delaware', abbreviation: 'DE' },
    { name: 'Florida', abbreviation: 'FL' },
    { name: 'Georgia', abbreviation: 'GA' },
    { name: 'Hawaii', abbreviation: 'HI' },
    { name: 'Idaho', abbreviation: 'ID' },
    { name: 'Illinois', abbreviation: 'IL' },
    { name: 'Indiana', abbreviation: 'IN' },
    { name: 'Iowa', abbreviation: 'IA' },
    { name: 'Kansas', abbreviation: 'KS' },
    { name: 'Kentucky', abbreviation: 'KY' },
    { name: 'Louisiana', abbreviation: 'LA' },
    { name: 'Maine', abbreviation: 'ME' },
    { name: 'Maryland', abbreviation: 'MD' },
    { name: 'Massachusetts', abbreviation: 'MA' },
    { name: 'Michigan', abbreviation: 'MI' },
    { name: 'Minnesota', abbreviation: 'MN' },
    { name: 'Mississippi', abbreviation: 'MS' },
    { name: 'Missouri', abbreviation: 'MO' },
    { name: 'Montana', abbreviation: 'MT' },
    { name: 'Nebraska', abbreviation: 'NE' },
    { name: 'Nevada', abbreviation: 'NV' },
    { name: 'New Hampshire', abbreviation: 'NH' },
    { name: 'New Jersey', abbreviation: 'NJ' },
    { name: 'New Mexico', abbreviation: 'NM' },
    { name: 'New York', abbreviation: 'NY' },
    { name: 'North Carolina', abbreviation: 'NC' },
    { name: 'North Dakota', abbreviation: 'ND' },
    { name: 'Ohio', abbreviation: 'OH' },
    { name: 'Oklahoma', abbreviation: 'OK' },
    { name: 'Oregon', abbreviation: 'OR' },
    { name: 'Pennsylvania', abbreviation: 'PA' },
    { name: 'Rhode Island', abbreviation: 'RI' },
    { name: 'South Carolina', abbreviation: 'SC' },
    { name: 'South Dakota', abbreviation: 'SD' },
    { name: 'Tennessee', abbreviation: 'TN' },
    { name: 'Texas', abbreviation: 'TX' },
    { name: 'Utah', abbreviation: 'UT' },
    { name: 'Vermont', abbreviation: 'VT' },
    { name: 'Virginia', abbreviation: 'VA' },
    { name: 'Washington', abbreviation: 'WA' },
    { name: 'West Virginia', abbreviation: 'WV' },
    { name: 'Wisconsin', abbreviation: 'WI' },
    { name: 'Wyoming', abbreviation: 'WY' },
  ];


  const handleStateChange = (evt) => {
    const selectedState = evt.target.value;
    setFormData((prevData) => ({
      ...prevData,
      address: { ...prevData.address, state: selectedState }
    }));
  };

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((prevData) =>
      name in prevData.address
        ? {
            ...prevData,
            address: { ...prevData.address, [name]: value },
          }
        : { ...prevData, [name]: value }
    );
  };

  const toggleEdit = () => setEdit((prev) => !prev);

  const handleSave = () => {
    const updatedUser = { ...formData };
    localStorage.setItem(formData.email, JSON.stringify(updatedUser));
    setUser(updatedUser);
    setFormData(updatedUser);
    toggleEdit();
  };

  const handleCancel = () => {
    setFormData({...formData});
    toggleEdit();
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = formData.email;
      const savedUser = localStorage.getItem(userEmail);

      if (savedUser) {
        setFormData(JSON.parse(savedUser));
      } else {
        const userInfo = await getInfo();
        if (userInfo) {
          setUser(userInfo);
          setFormData({
            ...userInfo,
            address: {
              ...userInfo.address,
              street: userInfo.address?.street || '',
              city: userInfo.address?.city || '',
              state: userInfo.address?.state || '',
              zip_code: userInfo.address?.zip_code || '',
            },
          });
        }
      }
    };
    fetchUserData();
  }, [formData.email]);



  return ( 
    <>
    <ThemeProvider theme={theme}>
    <Container className='profile-card-container' disableGutters>
      <Card sx={STYLES.cardContainer}>
        <CardContent className='card-content'>
          {edit ? (
            <>
              <CustomTextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                edit={edit}
              />
              <CustomTextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                edit={edit}
              />
              <CustomTextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                edit={edit}
              />
              <CustomTextField
                name="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                edit={edit}
              />
              <CustomTextField
                label="Street"
                name="street"
                value={formData.address.street}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                edit={edit}
              />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  label="City"
                  name="city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  edit={edit}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  label="State"
                  name="state"
                  value={formData.address.state}
                  onChange={handleStateChange}
                  select
                  fullWidth
                  margin="normal"
                  edit={edit}
                >
                  {states.map((state) => (
                    <MenuItem key={state.abbreviation} value={state.abbreviation}>
                      {state.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <CustomTextField
                  label="Zipcode"
                  name="zip_code"
                  value={formData.address.zip_code}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  edit={edit}
                />
              </Grid>
            </Grid>
              <CustomTextField
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                edit={edit}
              />
              {/* <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {formData.profile_picture && (
                <img
                  src={formData.profile_picture}
                  alt="Profile"
                  style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: '10px' }}
                />
              )} */}

            </>
          ) : (
            <>
              {/* {formData.profile_picture && (
                <img
                  src={formData.profile_picture}
                  alt="Profile"
                  style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }}
                />
              )} */}
                <div style={STYLES.name}>
                  {formData.first_name} {formData.last_name}
                </div>
                <div style={STYLES.text}>
                  {formData.email}
                </div>
                <div style={STYLES.text}>
                  {formData.birth_date}
                </div>
                <div style={STYLES.text}>
                  {`${formData.address?.street || ''} ${formData.address?.city || ''}${formData.address?.city && formData.address?.state ? ', ' : ''}${formData.address?.state || ''}${formData.address?.state && formData.address?.zip_code ? ', ' : ''}${formData.address?.zip_code || ''}`}
                </div>
                <div style={STYLES.text}>
                  {formData.bio}
                </div>
              </>
          )}
        </CardContent>
        <CardActions>
          {edit ? (
           <>
            <Button size="small" onClick={handleSave} className='button-save'>
              Save
            </Button>
            <Button size='small' onClick={handleCancel} className='button-cancel'>
              Cancel
            </Button>
           </> 
          ) : (
            <Button size="small" onClick={toggleEdit} className='button-edit'>
              Edit
            </Button>
          )}
          
        </CardActions>
      </Card>
    </Container>
    </ThemeProvider>
    </>
  )
}

export default ProfileCard;

