import axios from 'axios'; 

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
});

// --------------------------------------------------------- USERS ---------------------------------------------------------------------------------------------------------------------------------------------------

export const userRegistrtion = async(formData) => {
  const { first_name, last_name, display_name, age, email, password, registration } = formData; 
  let response = await api.post(
    `users/${registration}`, 
    { 
      first_name: first_name,
      last_name: last_name, 
      display_name,
      age: age, 
      email: email, 
      password: password,
    }
  );

  if (response.status === 200){
    const { token, user } = response.data; 
    localStorage.setItem('token', token); 
    api.defaults.headers.common['Authorization'] = `Token ${token}`
    return user
        
  }
    console.log(response.data)
    return null
};


export const logIn = async (formData) => {
  const { email, password } = formData; 
  let response = await api.post('users/login/',
    {
      email: email, 
      password: password,
      }
  );

  if (response.status === 200) {
    const { token, user } = response.data; 
    localStorage.setItem('token', token); 
    api.defaults.headers.common['Authorization'] = `Token ${token}`; 
    return user; 
  }
    console.log(response.data)
    return null
};


export const logOut = async(user) => {
  try {
    let response = await api.post('users/logout/')

    if (response.status === 204){
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization']
      console.log('user has logged out')
      return null;
    }
      console.log('failure to log out')
      return user
  } catch (err) {
    console.error('logout logic error:', err); 
    return user; 
  }
};


// --------------------------------------------------------- POLLS ---------------------------------------------------------------------------------------------------------------------------------------------------

export const createPoll = async(pollData) =>  {
  try { 
    const token = localStorage.getItem('token'); 
    
    const response = await api.post('polls/', pollData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    });

    if (response.status === 201) {
      const poll = response.data; 
      return poll;
    }
  } catch (err) {
    console.error('Poll creation error:', err.message);
    return null;
  }
};