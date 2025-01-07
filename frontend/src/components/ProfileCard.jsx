import { Card, CardActions, CardContent, Button, Typography, TextField, Container, Grid2, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { getInfo } from '../utilities';



const ProfileCard = () => {
  const [formData, setFormData] = useState({first_name:'', last_name:'', email:'', street:'', city:'', state:'', zip_code:'', birth_date:'', bio:''}); 
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(false); 
  const [firstFormData, setFirstFormData] = useState(...formData);

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
    setFormData({...formData, state: selectedState});
  };

  const handleInputChange = (evt) => {
    const {name, value} = evt.target;
    setFormData({...formData, [name]: value});
  };

  const toggleEdit = () => {
    setEdit(!edit);
  };

  const handleSave = () => {
    const address = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.zip_code}`;
    const updatedUser = {...formData, address};
    console.log('Updated user profile:', updatedUser);
    setFirstFormData({...formData});
    toggleEdit();
  };

  const handleCancel = () => {
    setFormData({...firstFormData});
    toggleEdit();
  }

  useEffect(() => {
    const getUserData = async() => {
      const userInfo = await getInfo();
      console.log(userInfo);
      if (userInfo) {
        setUser(userInfo);
      }
    };
    getUserData();
  })



  return ( 
    <>
    <Container>
      <Card sx={{ maxWidth: 900 }}>
        <CardContent>
          {edit ? (
            <>
              <TextField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                name="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            <Grid2 container spacing={5}>
              <Grid2 item xs={12} sm={4}>
                <TextField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid2>
              <Grid2 item xs={12} sm={4}>
                <TextField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleStateChange}
                  select
                  sx={{ width: '200px' }}
                  margin="normal">

                  {states.map((state) => (
                    <MenuItem key={state.abbreviation} value={state.abbreviation}>
                      {state.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid2>
              <Grid2 item xs={12} sm={4}>
                <TextField
                  label="Zipcode"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid2>
            </Grid2>
              <TextField
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
              />
            </>
          ) : (
            <>
              <Typography gutterBottom variant="h5" component="div">
                {formData.first_name} {formData.last_name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {formData.email}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {formData.birth_date}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {formData.address}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {formData.bio}
              </Typography>
            </>
          )}
        </CardContent>
        <CardActions>
          {edit ? (
            <>
              <Button size="small" onClick={handleSave}>
                Save
              </Button>
              <Button size="small" onClick={handleCancel}>
                Cancel
              </Button>
            </>
            ) : (
              <Button size="small" onClick={toggleEdit}>
                Edit
              </Button>
          )}
        </CardActions>
      </Card>
    </Container>
    </>
  )
}

export default ProfileCard;