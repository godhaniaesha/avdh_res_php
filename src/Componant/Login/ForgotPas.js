import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import styles from '../../css/ForgotPassword.module.css'; // Import the CSS module
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {

    const navigate = useNavigate();
    const [mobileNumber, setMobileNumber] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem("authToken");


    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate mobile number
        if (!isValidMobileNumber(mobileNumber)) {
            setError("Please enter a valid 10-digit mobile number.");
            return;
        }

        // Check mobile number with the API
        const userId = await checkMobileNumberAcrossApis(mobileNumber);
        if (!userId) {
            setError("Mobile number not found in our records.");
            return;
        }

        // Store the ID in localStorage
        localStorage.setItem("forgotId", userId);

        // Call generateOtp API
        const otpSent = await generateOtp(userId);

        if (otpSent) {
            // Redirect to /verifyotp page after OTP is successfully generated and sent
            console.log(`OTP sent successfully to ${mobileNumber}. Check your messages.`);
            window.location.href = "/verifyotp";
        } else {
            setError("Failed to send OTP. Please try again.");
        }
    };

    const isValidMobileNumber = (value) => /^\d{10}$/.test(value);

    // Function to check the mobile number across APIs
    const checkMobileNumberAcrossApis = async (mobileNumber) => {
        const urls = [
            "http://localhost:8000/api/allUsers" // Correct URL format
        ];

        try {
            for (const url of urls) {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Network response was not ok for ${url}`);
                
                const data = await response.json(); // Store the entire response
                const users = data.users; // Access the users property

                // Ensure users is an array before calling find
                if (Array.isArray(users)) {
                    const user = users.find(user => user.phone === mobileNumber);
                    if (user) {
                        return user._id; // Return the userId if found
                    }
                } else {
                    console.error("Expected an array but got:", users);
                }
            }
            return null; // If no match found in any API
        } catch (error) {
            console.error("Error checking mobile number across APIs:", error);
            return null;
        }
    };


    // Function to generate OTP by calling the generateOtp API

    const generateOtp = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("phone", mobileNumber);
        try {
            const response = await axios.post("http://localhost/avadh_api/forgot.php", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            
            localStorage.setItem("mobileno",mobileNumber)
            console.log("Generate OTP response:", response.data);
            
            if (response.data.success) {
                navigate('/verifyotp');
                
            } else {
                console.error("OTP sending failed:", response.data.message);
            }
        } catch (error) {
            console.error("Error generating OTP:", error);
        }
    };
    

    return (

        <div className="container-fluid">
            <div className="row">
                <div className="col no-padding-col p-0">
                    <div className={styles.bg_login} style={{backgroundColor: "rgba(225, 234, 225, 1)"}}>
                        <div className={styles.a_fooddish}>
                            <img src={require('../../Image/image 118.png')} className={styles.img} alt="" />
                            <img src={require('../../Image/cropdbg.png')} className={styles.cropdbg} alt="" />
                        </div>
                        <div className={`${styles.a_loginform} d-flex justify-content-center align-items-center`}>
                            <div className={styles.a_card}>
                                <div className={`${styles.a_title} text-center`}>
                                    <h3>Forgot Password</h3>
                                    <p>Reset your password here!</p>
                                </div>
                                <form className={styles.a_form} id="forgotForm" >
                                    <div className="mb-3">
                                        <div className={`${styles.a_input_group} d-flex justify-content-between`}>
                                            <input
                                                type="tel"
                                                id="f_mobile"
                                                placeholder="Mobile no."
                                                pattern="[0-9]{10}"
                                                title="Please enter a 10-digit mobile number. Only numbers are allowed."
                                                required
                                                maxLength="10"
                                                minLength="10"
                                                inputMode="numeric"
                                                value={mobileNumber}
                                                onChange={(e) => setMobileNumber(e.target.value)}
                                            />
                                            <span className={styles.a_input_group_text}>
                                                <FontAwesomeIcon icon={faPhone} />
                                            </span>
                                        </div>
                                        {error && <div className="text-danger">{error}</div>}
                                    </div>
                                    <div className={`${styles.d_grid} text-center`} onClick={generateOtp}>
                                        <button  className="btn" id="send_otp" >Send Otp</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
