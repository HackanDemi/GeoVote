import axios from 'axios'; 

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
});

// --------------------------------------------------------- USERS ---------------------------------------------------------------------------------------------------------------------------------------------------

export const userRegistrtion = async(formData) => {
  const { first_name, last_name, email, password } = formData; 
  let response = await api.post('users/signup/', 
    { 
      first_name: first_name,
      last_name: last_name, 
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


// export const userUpdate = async(user) => {
//   try{

//   }
// }


// --------------------------------------------------------- POLLS ---------------------------------------------------------------------------------------------------------------------------------------------------

export const createPoll = async(pollData) =>  {
    const token = localStorage.getItem('token'); 

    if (token) {
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      const response = await api.post('polls/', pollData);
      
      if (response.status === 201) {
        const poll = response.data; 
        return poll;

      } else  {
        console.error('Poll creation error:');
        return null;
      }
    }
};



export const getPolls = async() => {
  const token = localStorage.getItem('token')

  if(token){
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      let response = await api.get('polls/');

      if (response.status === 200){
          return response.data;
      }
  } else {
      return null;
  }
};


export const updatePoll = async (formData) => {
  const { pollId } = formData
  try{
      const { data } = await api.put(`poll/${pollId}/`);
      return data;

  }catch (error){
      console.error('Error updating poll name: ', error.message);
  }
};


export const deletePoll = async(pollId) =>{
  try {
      const token = localStorage.getItem('token');

      if (token) {
        api.defaults.headers.common['Authorization'] = `Token ${token}`;
        const { data } = await api.delete(`poll/${pollId}/`);
        return data;
      }
    } catch (err) {
      console.error('Error deleting poll:', err.message);
    }
}