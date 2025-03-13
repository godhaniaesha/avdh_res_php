import React, { useState } from "react";
import { useHistory, useNavigate } from "react-router-dom"; // Import useHistory for navigation
import styles from "../../css/ChangePass.module.css"; // Import the CSS module
import axios from "axios";

// Password change component
function ChangePass() {
    const navigate = useNavigate(); // Initialize useHistory for navigation
    const [newPassword, setNewPassword] = useState(""); // State for new password
    const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
    const [newError, setNewError] = useState(""); // State for new password error
    const [confirmError, setConfirmError] = useState(""); // State for confirm password error

    // Function to get the user ID from localStorage
    const getUserId = () => localStorage.getItem("forgotId");

    // Change Password Function
    const changePassword = async (userId, newPassword, confirmPassword) => {
        const passwordData = { newPassword, confirmPassword }; // Prepare the payload

        try {
            const response = await fetch(`http://localhost:8000/api/forgotPassword/${userId}`, { // Append userId to the URL
                method: "POST", // Use PUT method for updating
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(passwordData), // Convert the payload to JSON
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get the error response text
                throw new Error(`Error: ${response.statusText} - ${errorText}`); // Handle non-200 responses
            }

            const data = await response.json(); // Parse the response data
            console.log("Password updated successfully:", data); // Log success
            return true; // Indicate success
        } catch (error) {
            console.error("Error updating password:", error); // Log any errors
            return false; // Indicate failure
        }
    };

    // Function to validate password fields
    const validatePasswords = () => {
        if (newPassword.length < 6) {
            setNewError("Password must be at least 6 characters long.");
            return false;
        }
        if (newPassword !== confirmPassword) {
            setConfirmError("Passwords do not match.");
            return false;
        }
        return true;
    };

    // Form submission handler
    const handleSubmit = async (event) => {
        event.preventDefault();
        const userId = getUserId();

        // Clear previous error messages
        setNewError("");
        setConfirmError("");

        // Validate the passwords
        if (!validatePasswords()) return;

        const success = await changePassword(userId, newPassword, confirmPassword); // Call the change password function
        if (!success) {
            setNewError("Failed to update password. Please try again."); // Set error message
        } else {
            console.log("Password changed successfully!");
            // Navigate to the login page upon successful update
            navigate("/login"); // Redirect to the login page
        }
    };

    const ResetPassword = async (e) => {
        const userid = localStorage.getItem('forgetpassId')
        e.preventDefault();
        const formData = new FormData();
        formData.append("user_id", userid);
        formData.append("Newpassword", newPassword);
        formData.append("confirmPassword", confirmPassword);

        try {
            const response = await axios.post("http://localhost/avadh_api/change_password.php", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            console.log("Reset Password", response.data);
    
            if (response.data.success) {
                navigate('/login');
                localStorage.removeItem('forgetpassId');
                localStorage.removeItem('mobileno');
            } else {
                console.error("Reset Password failed:", response.data.message);
            }
        } catch (error) {
            console.error("Error Reset Password:", error);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col no-padding-col p-0">
                    <div className={styles.bg_login} style={{ backgroundColor: "rgba(225, 234, 225, 1) !important;" }}>
                        <div className={styles.a_fooddish}>
                            <img src={require("../../Image/image 118.png")} className={styles.img} alt="" />
                            <img src={require("../../Image/cropdbg.png")} className={styles.cropdbg} alt="" />
                        </div>
                        <div className={`${styles.a_loginform} d-flex justify-content-center align-items-center`}>
                            <div className={styles.a_card}>
                                <div className={`${styles.a_title} text-center`}>
                                    <h3>Change Password</h3>
                                    <p>Reset your password here!</p>
                                </div>
                                <form className={styles.a_form} id="passwordForm">
                                    <div className="mb-3">
                                        <div className={`${styles.a_input_group} d-flex justify-content-between`}>
                                            <input
                                                type="password"
                                                id="f_new_pass"
                                                placeholder="New Password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                            <span className={styles.a_input_group_text}>
                                                <img src={require("../../Image/Lock.png")} alt="Lock Icon" />
                                            </span>
                                        </div>
                                        {newError && <div className="text-danger">{newError}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <div className={`${styles.a_input_group} d-flex justify-content-between`}>
                                            <input
                                                type="password"
                                                id="f_con_pass"
                                                placeholder="Confirm Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <span className={styles.a_input_group_text}>
                                                <img src={require("../../Image/Lock.png")} alt="Lock Icon" />
                                            </span>
                                        </div>
                                        {confirmError && <div className="text-danger" style={{ width: "300px" }}>{confirmError}</div>}
                                    </div>
                                    <div className={`${styles.d_grid} text-center`}>
                                        <button className="btn" id="c_btn_pass" onClick={ResetPassword}>
                                            Change Password
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
}

export default ChangePass;
