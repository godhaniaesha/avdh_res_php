import React, { useEffect, useState } from 'react';
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import SuperNavbar from './SuperNavbar';
import SuperSidePanel from './SuperSidePanel';
import styles from '../../css/AddAccountant.module.css';
import style from "../../css/BillPayment.module.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddAccountant() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changepasswordmodal, setChangepasswordmodal] = useState(false)
    const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");


    const profilesave = (event) => {
        event.preventDefault();

        // Gather form data
        const accountantData = {
            firstName: document.getElementById("Firstname").value,
            lastName: document.getElementById("Lastname").value,
            email: document.getElementById("accmail").value,
            phone: document.getElementById("phone").value,
            dateOfBirth: document.getElementById("bod").value,
            gender: document.getElementById("gender").value,
            address: document.getElementById("Address").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            country: document.getElementById("country").value,
            password: document.getElementById("password").value,
            image: document.getElementById("Waiterimage").files[0],
            confirmPassword: document.getElementById("conpassword").value,
        };

        // Create FormData object to handle file upload
        const formData = new FormData();
        for (const key in accountantData) {
            formData.append(key, accountantData[key]);
        }

        // Retrieve the token from local storage
        const token = localStorage.getItem('authToken');
        console.log("Token:", token); // Check if the token is retrieved correctly

        // Send data to the backend API
        axios.post("http://localhost/avadh_api/super_admin/accountant/add_accountant.php", formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        })
            .then(response => {
                console.log("Accountant added successfully:", response.data);
                document.getElementById("imgModal").style.display = "block"; // Show success modal
                clearForm(); // Clear the form after successful submission
            })
            .catch(error => {
                console.error("Error adding accountant:", error.response ? error.response.data : error.message);
            });
    };
    const clearForm = () => {
        const form = document.getElementById("add_acc_form");
        if (form) {
            form.reset();
        }
        document.getElementById("Waiterimage").value = "";
    };

    const toggleDrawer = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const handleLogout = () => {
        // Check if Bootstrap's Modal is available
        if (window.bootstrap && window.bootstrap.Modal) {
            const logoutModal = document.getElementById('logoutModal');
            const modal = new window.bootstrap.Modal(logoutModal);
            modal.hide(); // Close the modal
        } else {
            console.error("Bootstrap Modal is not available");
        }

        // Remove the authToken from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId"); // Clear the userId if needed

        // Redirect to login page
        navigate("/login", { replace: true });

        window.history.pushState(null, '', window.location.href);
    };
    const handlePasswordChange = () => {
        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        // Make sure password is not empty
        if (!newPassword || !confirmPassword) {
            alert("Please enter a new password.");
            return;
        }

        const userId = localStorage.getItem("userId");

        if (!userId) {
            console.error("User ID is not available.");
            return;
        }

        const passwordData = {
            newPassword: newPassword, // Send new password
            confirmPassword: confirmPassword // Send confirm password
        };

        // Send the PUT request to update the password
        fetch(`http://localhost:8000/api/updateuser/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(passwordData),
        })
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok");
                const changePasswordModal = document.getElementById('changepassModal');
                const modal = new window.bootstrap.Modal(changePasswordModal);
                modal.hide();
                setNewPassword("");
                setConfirmPassword("");
                return response.json();
            })
            .catch(error => {
                console.error("Error changing password:", error);
                alert("Failed to change password. Please try again."); // Display error message to user
            });
    };
    return (
        <div>
            <SuperNavbar toggleDrawer={toggleDrawer} showSearch={false}/>
            <SuperSidePanel isOpen={isSidebarOpen} isAccountant={true} />

            <div id={styles['a_main-content']}>
                <div className={`container-fluid ${styles.a_main}`}>
                    <div className={styles.m_add}>
                        <span>Add Accountant</span>
                    </div>
                </div>
                <form id={styles.add_acc_form}  className={styles.add_acc_form}>
                    <div className={`row d-flex ${styles.m_add_input}`}>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" id="Firstname" name="firstName" placeholder="First Name" required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" id="Lastname" name="lastName" placeholder="Last Name" required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="email" className="form-control" id="accmail" name="email" placeholder="Email" required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="tel" className="form-control" id="phone" name="phone" maxLength="10" placeholder="Phone" required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 input-group ${styles.m_add_input_mar}`}>
                                <input type="date" className="form-control" id="bod" name="dateOfBirth" placeholder="Date of Birth" required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" id="gender" name="gender" required>
                                    <option value="" disabled>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" id="Address" name="address" placeholder="Address" required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`col ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" id="city" name="city" required>
                                    <option value="" disabled>Select City</option>
                                    <option value="Surat">Surat</option>
                                    <option value="Vapi">Vapi</option>
                                    <option value="Baroda">Baroda</option>
                                    <option value="Mumbai">Mumbai</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`col ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" id="state" name="state" required>
                                    <option value="" disabled>Select State</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Uttarakhand">Uttarakhand</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`col ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" id="country" name="country" required>
                                    <option value="" disabled>Select Country</option>
                                    <option value="India">India</option>
                                    <option value="China">China</option>
                                    <option value="Japan">Japan</option>
                                    <option value="Canada">Canada</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" id="profession" name="profession" required>
                                    <option value="" disabled>Select Profession</option>
                                    <option value="Accountant">Accountant</option>
                                    <option value="Waiter">Waiter</option>
                                    <option value="Chef">Chef</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`}>
                                <input className="form-control m_add_file" id="Waiterimage" name="image" type="file" required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="password" className="form-control" id="password" name="password" placeholder="Password" required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="password" className="form-control" id="conpassword" name="confirmPassword" placeholder="Confirm Password" required />
                            </div>
                        </div>
                    </div>
                    <div className={styles.m_btn_clear_save}>
                        <div className={styles.m_btn_clear}>
                            <button type="button" onClick={clearForm}><i className="fa-solid fa-eraser"></i>Clear</button>
                        </div>
                        <div className={styles.m_btn_save}>
                            <button type="button" onClick={profilesave} data-toggle="modal" data-target="#imgModal"><i className="fa-regular fa-floppy-disk"></i>Save</button>
                        </div>
                    </div>
                </form>

                {/* Add Successfully Modal */}
                <div className={`${styles.m_add_successfully} modal fade`} id="imgModal" tabIndex="-1" aria-labelledby="imgModalLabel" aria-hidden="true">
                    <div className={`${styles.m_model} modal-dialog modal-dialog-centered`}>
                        <div className={`modal-content ${styles.m_save}`} style={{ border: 'none', backgroundColor: '#f6f6f6' }}>
                            <div className={`modal-body ${styles.m_save_text}`}>
                                <span>Add Successfully!</span>
                            </div>
                            <div className={styles.m_save_img}>
                                <img src="image/right.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
 {/* Change Password Modal */}
 <div
          className={`modal fade ${style.m_model_ChangePassword}`}
          id="changepassModal"  // Ensure this ID matches
          tabIndex="-1"
          aria-labelledby="changepassModalLabel"
          aria-hidden="true"
        >
          <div className={`modal-dialog modal-dialog-centered ${style.m_model}`}>
            <div className={`modal-content ${style.m_change_pass}`} style={{ border: "none", backgroundColor: "#f6f6f6" }}>
              <div className={`modal-body ${style.m_change_pass_text}`}>
                <span>Change Password</span>
              </div>
              <div className={style.m_new}>
                <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
              </div>
              <div className={style.m_new}>
                <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <div className={style.m_confirm}>
                <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div className={style.m_btn_cancel_change}>
                <div className={style.m_btn_cancel}>
                  <button data-bs-dismiss="modal">Cancel</button>
                </div>
                <div className={style.m_btn_change}>
                  <button type="button" data-bs-toggle="modal" data-bs-target="#changepassModal" onClick={handlePasswordChange}>Change</button>
                </div>
              </div>
            </div>
          </div>
        </div>


                {/* Logout Modal */}
                <div
                    className={`modal fade ${style.m_model_logout}`}
                    id="logoutModal"
                    tabIndex="-1"
                    aria-labelledby="logoutModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div
                            className={`modal-content ${style.m_model_con}`}
                            style={{ border: "none", backgroundColor: "#f6f6f6" }}
                        >
                            <div className={style.m_log}>
                                <div className={style.m_logout}>
                                    <span>Logout</span>
                                </div>
                                <div className={style.m_text}>
                                    <span>Are You Sure You Want To Logout?</span>
                                </div>
                                <div className={style.m_btn_cancel_yes}>
                                    <div className={style.m_btn_cancel_logout}>
                                        <button data-bs-dismiss="modal">Cancel</button>
                                    </div>
                                    <div className={style.m_btn_yes}>
                                        <button type="button" data-bs-toggle="modal" data-bs-target="#logoutModal" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddAccountant;