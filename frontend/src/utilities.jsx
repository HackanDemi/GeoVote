import axios from 'axios'; 

export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
});

// --------------------------------------------------------- USERS ---------------------------------------------------------------------------------------------------------------------------------------------------

export const userRegistration = async(formData) => {
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
    localStorage.setItem('user', JSON.stringify(user));
    api.defaults.headers.common['Authorization'] = `Token ${token}`; 
    return user; 
  }
    console.log(response.data)
    return null
};


export const logOut = async(user) => {
  try {
    const token = localStorage.getItem('token');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];

    api.defaults.headers.common['Authorization'] = `Token ${token}`;

    let response = await api.post('users/logout/')
    if (response.status === 204){
      console.log('user has logged out')
      return null;
    } else {
      console.log('failure to log out')
      return user
    }
  } catch (err) {
    console.error('logout logic error:', err); 
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    return null; 
  }
};


export const getInfo = async() => {
  let token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  api.defaults.headers.common['Authorization'] = `Token ${token}`;

  try {
    const [userResponse, profileResponse] = await Promise.all([
      api.get("users/info/"),
      api.get("profile/info/"),
    ]);

    if (userResponse.status === 200 && profileResponse.status === 200) {
      const combinedData = {
        ...userResponse.data,
        profile: profileResponse.data,
      };
      return combinedData;
    }
    return null;
  } catch (err) {
    console.error('err fetching user info:', err.message);
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token');
    }
    return null;
  }
};

// export const updateUserProfile = async(formData) => {
//   const { first_name, last_name, email, birth_date, bio, address, profile_picture } = formData;
//   let formDataObj = new FormData();
//   formDataObj.append('first_name', first_name);
//   formDataObj.append('last_name', last_name);
//   formDataObj.append('email', email);
//   formDataObj.append('birth_date', birth_date);
//   formDataObj.append('bio', bio);
//   formDataObj.append('address', JSON.stringify(address));
//   if (profile_picture) {
//     formDataObj.append('profile_picture', profile_picture);
//   }

//   let response = await api.put('profile/update/', formDataObj, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   });

//   if (response.status === 200) {
//     const user = response.data;
//     localStorage.setItem('user', JSON.stringify(user));
//     return user;
//   }
//   console.log(response.data);
//   return null;
// };


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



export const getAllPolls = async() => {
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


export const deletePoll = async (pollId) => {
  try {
    const token = localStorage.getItem('token');

    if (token) {
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      const response = await api.post('polls/delete/', { poll_id: pollId }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        return response.data;
      } else {
        console.error('Error deleting poll:', response.data);
        return null;
      }
    }
  } catch (err) {
    console.error('Error deleting poll:', err.message);
    return null;
  }
};