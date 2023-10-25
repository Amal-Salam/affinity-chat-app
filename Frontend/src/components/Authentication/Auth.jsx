import React,{useState} from 'react';
import * as Components from './styleComp';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../App.css';

const Auth=()=> {
  //sign in
  const [signIn, toggle] = useState(true);
  const [email,setEmail] = useState();
  const [password,setPassword]= useState();
  const [loading,setLoading]= useState(false);
  const navigate = useNavigate();
  
  //signup
  
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  const [username, setUsername]= useState();
  //email and password from the above
  // const [avatar, setAvatar] = useState();
 

  //sign in logic

  const submitHandlerSignIn = async () => {
    setLoading(true);
    if (!email || !password) {
      toast.warn('Please Fill all the fields', {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/auth/login',
        { email, password },
        config
      );
      toast.success('Login Successful', {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    } catch (error) {
      console.log("errornious");
      toast.error('Error Occured!', {
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };

  //signup logic
  // const postDetails = (avatar) => {
  //   setLoading(true);

  //   if (avatar === undefined) {
  //     toast.warn('Please Fill all the fields', {
  //       autoClose: 10000,
  //       position: toast.POSITION.TOP_RIGTH,
  //     });
  //     toast.warn('Please Select an Image!', {
  //       autoClose: 10000,
  //       position: toast.POSITION.TOP_RIGTH,
  //     });
  //     return;
  //   }

  //   if (avatar.type !== 'image/jpeg' && avatar.type !== 'image/png') {
  //     toast.warn('Please Select a JPEG or PNG Image!', {
  //       autoClose: 10000,
  //       position: toast.POSITION.TOP_RIGTH,
  //     });
  //     setLoading(false);
  //     return;
  //   }

  //   if (avatar.type === 'image/jpeg' || avatar.type === 'image/png') {
  //     const data = new FormData();
  //     data.append('file', avatar);
  //     data.append('upload_preset', 'chatterbox');
  //     data.append('cloud_name', 'nktvsoftware');
  //     axios
  //       .post('https://api.cloudinary.com/v1_1/nktvsoftware/image/upload', data)
  //       .then((response) => {
  //         console.log('Cloudinary response:', response);
  //         setAvatar(response.data.url.toString());
  //         setLoading(false);
  //         toast.success('Image uploaded successfully!', {
  //           autoClose: 10000,
  //           position: toast.POSITION.TOP_RIGTH,
  //         });
  //       })
  //       .catch((error) => {
  //         console.log('Cloudinary error:', error);
  //         setLoading(false);
  //       });
  //   }
  // };

  const submitHandlerSignUp = async () => {
    setLoading(true);
    if (!username || !email || !password ) {
      toast.warn( 'Please fill in all required fields',{
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
      return;
    }
    
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/auth/signup',
        { firstname,lastname,username, email, password, 
          // avatar 
        },
        config
      );
      toast.success('Registration Successfull',{
       
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    } catch (err) {
      toast.error('Error Occured!',{
      
        description: err.response.data.message,
        autoClose: 10000,
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
 };

  return (
    <Components.Body>
      <Components.Container>
        <Components.SignUpContainer signingIn={signIn}>
          <Components.Form>
            {/* <Components.Title>Sign Up </Components.Title> */}
            <Components.Input
              type='text'
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder='Firstname'
            />
            <Components.Input
              type='text'
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder='Lastname'
            />
            <Components.Input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Username'
            />
            <Components.Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
            />
            <Components.Input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
            />
            {/* <Components.Input type= 'file' value ={avatar} accept = 'image/*' onChange = {(e) => postDetails(e.target.files[0])}/> */}
            <Components.Button onClick={submitHandlerSignUp}>
              Sign Up
            </Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        <Components.SignInContainer signingIn={signIn}>
          <Components.Form>
            <Components.Title>Sign in</Components.Title>
            <Components.Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email'
            />
            <Components.Input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
            />

            <Components.Button onClick={submitHandlerSignIn} disabled={loading}>
              Sign In
            </Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        <Components.OverlayContainer signingIn={signIn}>
          <Components.Overlay signingIn={signIn}>
            <Components.LeftOverlayPanel signingIn={signIn}>
              <Components.Title>Welcome!</Components.Title>
              <Components.Paragraph>
                Like stars drawn to the night sky, our hearts find their truest
                home in affinity
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(true)}>
                Sign In
              </Components.GhostButton>
            </Components.LeftOverlayPanel>
            <Components.RightOverlayPanel signingIn={signIn}>
              <Components.Title>Hello, Friend!</Components.Title>
              <Components.Paragraph>
                Resume your journey with us.
              </Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(false)}>
                Sign Up
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
        <ToastContainer />
      </Components.Container>
    </Components.Body>
  );
}
export default Auth;

