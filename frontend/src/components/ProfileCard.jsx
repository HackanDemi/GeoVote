import { Card, CardActions, CardContent, Button, Container, Grid, MenuItem, ThemeProvider, createTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { getInfo, updateProfile, getProfile } from '../utilities';
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

  const textStyles = {
    color: "text.primary",
    marginBottom: "8px",
  };

  const nameStyles = {
    ...textStyles,
    fontSize: "32px", 
    fontWeight: "bold",
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
    if (name in formData.address) {
      setFormData((prevData) => ({
        ...prevData,
        address: { ...prevData.address, [name]: value } 
      }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };


  const toggleEdit = () => {
    setEdit(!edit);
  };

  useEffect(() => {
    const getUserData = async () => {
      const userInfo = await getInfo();
      const profileInfo = await getProfile();
      if (userInfo && profileInfo) {
        setFormData({
          first_name: userInfo.first_name || '',
          last_name: userInfo.last_name || '',
          email: userInfo.email || '',
          birth_date: profileInfo.profile.birth_date || '',
          bio: profileInfo.profile.bio || '',
          address: profileInfo.address || {
            id: '',
            street: '',
            city: '',
            state: '',
            zip_code: ''
          }
        });
        setUser({ ...userInfo, id: profileInfo.profile.user }); 
      } else {
        console.error('Invalid user info structure:', userInfo, profileInfo);
      }
    };
    getUserData();
  }, []);


  const handleSave = async () => {
    if (!user || !user.id) {
      console.error('User ID is not set');
      return;
    }

    const updatedUser = {
      user: user.id,
      birth_date: formData.birth_date,
      bio: formData.bio,
      address: {
        id: formData.address.id, 
        street: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        zip_code: formData.address.zip_code,
      },
    };

    console.log('Saving to localStorage:', updatedUser);

    const response = await updateProfile(updatedUser);
    if (response) {
      console.log('Profile updated successfully:', response);
      localStorage.setItem('user', JSON.stringify({ ...user, ...updatedUser }));
      setUser({ ...user, ...updatedUser });
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        birth_date: response.profile.birth_date,
        bio: response.profile.bio,
        address: response.address
      });
      toggleEdit();
      console.log('Updated user profile:', updatedUser);
      console.log("User:", user);
    } else {
      console.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({...formData});
    toggleEdit();
  };





  return ( 
    <>
    <ThemeProvider theme={theme}>
    <Container className='profile-card-container' disableGutters>
      <Card className='profile-card'
        sx={{
          bgcolor: 'background.paper', 
          borderRadius: "15px",
          boxShadow: "0 4px 20px rgba(128, 90, 213, 0.8)", 
          margin: "20px auto",
          padding: "20px",
        }}>
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
            </>
          ) : (
            <>
                <div style={nameStyles}>
                  {formData.first_name} {formData.last_name}
                </div>
                <div style={textStyles}>
                  {formData.email}
                </div>
                <div style={textStyles}>
                  {formData.birth_date}
                </div>
                <div style={textStyles}>
                {`${formData.address?.street || ''} ${formData.address?.city || ''}${formData.address?.city && formData.address?.state ? ', ' : ''}${formData.address?.state || ''}${formData.address?.state && formData.address?.zip_code ? ', ' : ''}${formData.address?.zip_code || ''}`}
                </div>
                <div style={textStyles}>
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