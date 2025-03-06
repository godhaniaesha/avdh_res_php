import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../css/VerifyOTP.module.css';
import axios from 'axios'; // Import axios for API calls

const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [phone, setPhone] = useState(''); // Add phone state
  const otpInputs = useRef([]);
  const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");

  useEffect(() => {
    const forgotId = localStorage.getItem('forgotId');
    console.log("forgotId", forgotId);


    if (forgotId) {
      const fetchPhoneNumber = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/getUser/${forgotId}`);
          console.log("API Response:", response.data); // Log the API response

          if (response.data.user) {
            console.log(response.data.user, "response.data.user");

            setPhone(response.data.user.phone); // Set the phone number state
            console.log("phone", response.data.user.phone);

            // console.log("Fetched Phone Number:", response.user.phone); // Log the fetched phone number
          } else {
            setOtpError('User not found.');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          setOtpError('Failed to fetch user data.');
        }
      };

      fetchPhoneNumber();
    } else {
      setOtpError('User ID not found.');
    }

    otpInputs.current[0].focus();
  }, []);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < otpInputs.current.length - 1) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      otpInputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');

    console.log("Entered OTP:", enteredOtp); // Log the entered OTP
    console.log("OTP Length:", enteredOtp.length); // Log the length of the entered OTP
    console.log("Phone number:", phone); // Log the phone number

    // Convert phone to a number if it's a string
    const otp1 = typeof enteredOtp === 'string' ? Number(enteredOtp) : enteredOtp;
    console.log("otp number (after conversion):", otp1); // Log the phone number after conversion

    // Check if the entered OTP is complete
    if (enteredOtp.length == 4 && phone) { // Ensure the length is exactly 4
      try {
        const response = await axios.post('http://localhost:8000/api/verifyOtp', {
          phone: phone,  // Send the phone number with OTP
          otp: otp1
        });

        console.log("Server response:", response.data); // Log the server response

        // Check if the server response indicates success
        if (response.data) {
          // Redirect to the change password page
          navigate('/changepass');
        } else {
          // Handle incorrect OTP
          setOtpError('The OTP you entered is incorrect. Please try again.');
        }
      } catch (error) {
        console.error("Error verifying OTP:", error);
        if (error.response) {
          setOtpError(`Error: ${error.response.data.message || 'An error occurred while verifying the OTP.'}`);
          console.log(error.response.data.message, "error.response.data.message");

        } else {
          setOtpError('An error occurred while verifying the OTP. Please try again.');
        }
      }
    } else {
      // Handle incomplete OTP
      setOtpError('Please enter the complete OTP.'); // This message will show if the length is not 4
    }
  };

  // const handleResendCode = async (e) => {
  //   e.preventDefault();
  //   const userId = localStorage.getItem('forgotId'); // Assuming userId is stored here

  //   try {
  //     const response = await axios.post('http://localhost:8000/api/generateOtp', {
  //       userId: userId
  //     });

  //     if (response.data.success) {
  //       alert('OTP has been resent to your mobile number.');
  //     } else {
  //       alert('Failed to resend OTP. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error("Error resending OTP:", error);
  //     alert('An error occurred while resending the OTP. Please try again.');
  //   }
  // };

  return (
    <div className={`container-fluid ${styles.container}`}>
      <div className="row">
        <div className="col no-padding-col p-0">
          <div className={styles.bg_login} style={{ backgroundColor: "rgba(225, 234, 225, 1) !important;" }}>
            <div className={styles.a_fooddish}>
              <img src={require('../../Image/image 118.png')} className={styles.img} alt="" />
              <img src={require('../../Image/cropdbg.png')} className={styles.cropdbg} alt="" />
            </div>
            <div className={`${styles.a_loginform} d-flex justify-content-center align-items-center`}>
              <div className={styles.a_card}>
                <div className={`${styles.a_title} text-center`}>
                  <h3>OTP Verification</h3>
                  <p>Enter OTP code sent to mobile!</p>
                </div>

                <form className={styles.a_form} onSubmit={handleSubmit}>
                  <div className="d-flex justify-content-between flex-nowrap align-items-center mb-3" id={styles.otpContainer}>
                    {otp.map((value, index) => (
                      <input
                        key={index}
                        type="text"
                        className={styles['otp-input']}
                        maxLength="1"
                        value={value}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleBackspace(e, index)}
                        ref={(el) => (otpInputs.current[index] = el)}
                      />
                    ))}
                  </div>
                  <div className="mb-3 text-center">
                    <label className="form-label" htmlFor="otp">Didn't receive OTP code?</label>
                    {/* <a href="#" className="text-decoration-none d-block" onClick={handleResendCode}>
                      Resend Code
                    </a> */}
                  </div>
                  {otpError && <div className={styles['text-danger']}>{otpError}</div>}
                  <div className={`${styles['d-grid']} text-center`}>
                    <button type="submit" className="btn">
                      Verify
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
