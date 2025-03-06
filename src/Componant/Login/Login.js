// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import styles from '../../css/Login.module.css'; // Import CSS module
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// function Login() {
//     // State hooks for email, password, and error messages
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [emailError, setEmailError] = useState('');
//     const [passwordError, setPasswordError] = useState('');

    
//     const handleSubmit = (event) => {
//         event.preventDefault();

//     }
//     return (
//         <div>
//             <div className="container-fluid">
//                 <div className="row">
//                     <div className="col no-padding-col p-0">
//                         <div className={styles.bg_login}>
//                             <div className={styles.a_fooddish}>
//                                 <img src={require('../../Image/image 118.png')} className={styles.img} alt="" />
//                                 <img src={require('../../Image/cropdbg.png')} className={styles.cropdbg} alt="" />
//                             </div>
//                             <div className={`${styles.a_loginform} d-flex justify-content-center align-items-center`}>
//                                 <div className={styles.a_card}>
//                                     <div className={`${styles.a_title} text-center`}>
//                                         <h3>Login</h3>
//                                         <p>Welcome to our Restaurant</p>
//                                     </div>
//                                     <form className={styles.a_form} id="loginForm" onSubmit={handleSubmit}>
//                                         <div className="mb-3">
//                                             <div className={`${styles.a_input_group} d-flex justify-content-between`}>
//                                                 <input
//                                                     type="email"
//                                                     id="a_email"
//                                                     placeholder="Email address"
//                                                     value={email}
//                                                     onChange={(e) => setEmail(e.target.value)}
//                                                 />
//                                                 <span className={styles.a_input_group_text}>
//                                                     <i class="fa-regular fa-envelope"></i>
//                                                 </span>
//                                             </div>
//                                             <div className="text-danger">{emailError}</div>
//                                         </div>
//                                         <div className="mb-3">
//                                             <div className={`${styles.a_input_group} d-flex justify-content-between`}>
//                                                 <input
//                                                     type="password"
//                                                     id="a_password"
//                                                     placeholder="Password"
//                                                     value={password}
//                                                     onChange={(e) => setPassword(e.target.value)}
//                                                 />
//                                                 <span className={styles.a_input_group_text}>
//                                                     <img src={require('../../Image/Lock.png')} alt="" />
//                                                 </span>
//                                             </div>
//                                             <div className="text-danger" style={{ width: '300px' }}>
//                                                 {passwordError}
//                                             </div>
//                                         </div>
//                                         <div className="text-end">
//                                             <Link to="/forgotpass" className="text-decoration-none text-danger">
//                                                 Forgot password?
//                                             </Link>
//                                         </div>
//                                         <div className={`${styles.d_grid} text-center`}>
//                                             <button type="submit" className="btn">
//                                                 Login
//                                             </button>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Login;


// 22
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import styles from '../../css/Login.module.css'; // Import CSS module
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// function Login() {
//     // State hooks for email, password, and error messages
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [emailError, setEmailError] = useState('');
//     const [passwordError, setPasswordError] = useState('');
//     const navigate = useNavigate(); // Hook for navigation

//     // Function to handle form submission
//     const handleSubmit = async (event) => {
//         event.preventDefault();

//         // Clear previous error messages
//         setEmailError('');
//         setPasswordError('');

//         // Validate input fields
//         if (!email) {
//             setEmailError('Email is required');
//             return;
//         }
//         if (!password) {
//             setPasswordError('Password is required');
//             return;
//         }

//         // API request payload
//         const loginData = {
//             email,
//             password,
//         };

//         try {
//             // Send login request to the server
//             const response = await fetch('http://localhost:8000/api/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(loginData),
//             });

//             // Parse the response
//             const data = await response.json();

//             // Check if login was successful
//             if (response.ok) {
//                 // Access the user data from the response
//                 const user = data.user;

//                 // Redirect based on the user's role
//                 switch (user.role) {
//                     case 'Chef':
//                         navigate('/chef_board'); // Redirect to Chef page
//                         break;
//                     case 'Waiter':
//                         navigate('/Waiter_Dashboard'); // Redirect to Waiter page
//                         break;
//                     case 'Super Admin':
//                         navigate('/superadmin'); // Redirect to Super Admin page
//                         break;
//                     case 'Accountan':
//                         navigate('/accountant'); // Redirect to Accountant page
//                         break;
//                     default:
//                         console.log('Unknown role');
//                 }
//             } else {
//                 // Display error message if login failed
//                 setEmailError(data.message || 'Invalid login credentials');
//             }
//         } catch (error) {
//             console.error('Error during login:', error);
//             setEmailError('An error occurred. Please try again.');
//         }
//     };

//     return (
//         <div>
//             <div className="container-fluid">
//                 <div className="row">
//                     <div className="col no-padding-col p-0">
//                         <div className={styles.bg_login}>
//                             <div className={styles.a_fooddish}>
//                                 <img src={require('../../Image/image 118.png')} className={styles.img} alt="" />
//                                 <img src={require('../../Image/cropdbg.png')} className={styles.cropdbg} alt="" />
//                             </div>
//                             <div className={`${styles.a_loginform} d-flex justify-content-center align-items-center`}>
//                                 <div className={styles.a_card}>
//                                     <div className={`${styles.a_title} text-center`}>
//                                         <h3>Login</h3>
//                                         <p>Welcome to our Restaurant</p>
//                                     </div>
//                                     <form className={styles.a_form} id="loginForm" onSubmit={handleSubmit}>
//                                         <div className="mb-3">
//                                             <div className={`${styles.a_input_group} d-flex justify-content-between`}>
//                                                 <input
//                                                     type="email"
//                                                     id="a_email"
//                                                     placeholder="Email address"
//                                                     value={email}
//                                                     onChange={(e) => setEmail(e.target.value)}
//                                                 />
//                                                 <span className={styles.a_input_group_text}>
//                                                     <i className="fa-regular fa-envelope"></i>
//                                                 </span>
//                                             </div>
//                                             <div className="text-danger">{emailError}</div>
//                                         </div>
//                                         <div className="mb-3">
//                                             <div className={`${styles.a_input_group} d-flex justify-content-between`}>
//                                                 <input
//                                                     type="password"
//                                                     id="a_password"
//                                                     placeholder="Password"
//                                                     value={password}
//                                                     onChange={(e) => setPassword(e.target.value)}
//                                                 />
//                                                 <span className={styles.a_input_group_text}>
//                                                     <img src={require('../../Image/Lock.png')} alt="" />
//                                                 </span>
//                                             </div>
//                                             <div className="text-danger" style={{ width: '300px' }}>
//                                                 {passwordError}
//                                             </div>
//                                         </div>
//                                         <div className="text-end">
//                                             <Link to="/forgotpass" className="text-decoration-none text-danger">
//                                                 Forgot password?
//                                             </Link>
//                                         </div>
//                                         <div className={`${styles.d_grid} text-center`}>
//                                             <button type="submit" className="btn">
//                                                 Login
//                                             </button>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Login;


// 5555555555
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../css/Login.module.css'; // Import CSS module
import axios from 'axios';

function Login() {
    // State hooks for email, password, and error messages
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
    
        // Clear previous error messages
        setEmailError('');
        setPasswordError('');

        // Validate input fields
        if (!email) {
            setEmailError('Email is required');
            return;
        }
        if (!password) {
            setPasswordError('Password is required');
            return;
        }
    
        // API request payload

        const loginData = { email, password };
        console.log(loginData);
        try {
            // Send login request to the server
            const response = await axios.post('http://localhost/avadh_api/login.php',{
                email: loginData.email,
                password: loginData.password,
            });
            // Parse the response
            // const data = await response.json();
            console.log("data",response.data.user)
            let data=response.data;
            // Check if login was successful
            if (response.status === 200) {
                const user = data.user; // Assuming user object contains an id property
                localStorage.setItem('authToken', data.token);
                // Store user ID in local storage
                localStorage.setItem('userId', user.id); // Change 'user.id' if your API returns a different property
                localStorage.setItem('firstName', user.firstName);
                // Redirect based on the user's role
                switch (user.role) {
                    case 'Chef':
                        navigate('/chef_board');
                        break;
                    case 'Waiter':
                        navigate('/Waiter_Dashboard');
                        break;
                    case 'Super Admin':
                        navigate('/superadmin');
                        break;
                    case 'Accountan': // Corrected spelling
                        navigate('/accountant');
                        break;
                    default:
                        console.log('Unknown role');
                }
            } else {
                // Display error message if login failed
                setEmailError(data.message || 'Invalid login credentials');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setEmailError('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col no-padding-col p-0">
                        <div className={styles.bg_login}>
                            <div className={styles.a_fooddish}>
                                <img src={require('../../Image/image 118.png')} className={styles.img} alt="" />
                                <img src={require('../../Image/cropdbg.png')} className={styles.cropdbg} alt="" />
                            </div>
                            <div className={`${styles.a_loginform} d-flex justify-content-center align-items-center`}>
                                <div className={styles.a_card}>
                                    <div className={`${styles.a_title} text-center`}>
                                        <h3>Login</h3>
                                        <p>Welcome to our Restaurant</p>
                                    </div>
                                    <form className={styles.a_form} id="loginForm" onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <div className={`${styles.a_input_group} d-flex justify-content-between`}>
                                                <input
                                                    type="email"
                                                    name='email'
                                                    id="a_email"
                                                    placeholder="Email address"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                                <span className={styles.a_input_group_text}>
                                                    <i className="fa-regular fa-envelope"></i>
                                                </span>
                                            </div>
                                            <div className="text-danger">{emailError}</div>
                                        </div>
                                        <div className="mb-3">
                                            <div className={`${styles.a_input_group} d-flex justify-content-between`}>
                                                <input
                                                    type="password"
                                                    name='password'
                                                    id="a_password"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                <span className={styles.a_input_group_text}>
                                                    <img src={require('../../Image/Lock.png')} alt="" />
                                                </span>
                                            </div>
                                            <div className="text-danger" style={{ width: '300px' }}>
                                                {passwordError}
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <Link to="/forgotpass" className="text-decoration-none text-danger">
                                                Forgot password?
                                            </Link>
                                        </div>
                                        <div className={`${styles.d_grid} text-center`}>
                                            <button type="submit" className="btn">
                                                Login
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;



// Form submission handler
    // const handleSubmit = (event) => {
    //     event.preventDefault(); // Prevent default form submission

    //     // Basic validation
    //     if (email === '') {
    //         setEmailError('Email address is required.');
    //         return;
    //     } else {
    //         setEmailError('');
    //     }

    //     if (password === '') {
    //         setPasswordError('Password is required.');
    //         return;
    //     } else {
    //         setPasswordError('');
    //     }

    //     fetch('localhost:8000/api/createSuperAdmin')
    //         .then(response => response.json())
    //         .then(data => {
    //             const superAdminMatch = data.some(user => user.email === email && user.password === password);

    //             if (superAdminMatch) {
    //                 localStorage.setItem('loggedInUser', email);
    //                 window.location.replace('/superadmin'); 
    //             } else {
    //                 fetch('http://localhost:209/Waiters')
    //                     .then(response => response.json())
    //                     .then(waitersData => {
    //                         const waitersMatch = waitersData.some(user => user.email === email && user.password === password);

    //                         if (waitersMatch) {
    //                             localStorage.setItem('loggedInUser', email);
    //                             window.location.replace('/Waiter_Dashboard'); 
    //                         } else {
    //                             fetch('http://localhost:209/Chefs')
    //                                 .then(response => response.json())
    //                                 .then(chefsData => {
    //                                     const chefsMatch = chefsData.some(user => user.email === email && user.password === password);

    //                                     if (chefsMatch) {
    //                                         localStorage.setItem('loggedInUser', email);
    //                                         window.location.replace('/chef_board'); 
    //                                     } else {
    //                                         fetch('http://localhost:209/accountant')
    //                                             .then(response => response.json())
    //                                             .then(acccountData => {
    //                                                 const accountMatch = acccountData.some(user => user.email === email && user.password === password);

    //                                                 if (accountMatch) {
    //                                                     localStorage.setItem('loggedInUser', email);
    //                                                     window.location.replace('/accountant'); 
    //                                                 } else {
    //                                                     alert("This Email and Password do not match any user!");
    //                                                 }
    //                                             });
    //                                     }
    //                                 });
    //                         }
    //                     });
    //             }
    //         });
    // };