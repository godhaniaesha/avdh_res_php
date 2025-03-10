import React, { useEffect, useState } from 'react';
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import SuperNavbar from './SuperNavbar';
import SuperSidePanel from './SuperSidePanel';
import styles from '../../css/AddWaiter.module.css';
import style from "../../css/BillPayment.module.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddWaiter(props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changepasswordmodal, setChangepasswordmodal] = useState(false)
    const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");

    const profilesave = (event) => {
        event.preventDefault();

        // Gather form data
        const waiterData = {
            firstName: document.getElementById("Firstname").value.trim(),
            lastName: document.getElementById("Lastname").value.trim(),
            email: document.getElementById("waitermail").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            dateOfBirth: document.getElementById("bod").value.trim(),
            gender: document.getElementById("gender").value,
            address: document.getElementById("Address").value.trim(),
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            country: document.getElementById("country").value,
            password: document.getElementById("password").value.trim(),
            confirmPassword: document.getElementById("conpassword").value.trim(),
            image: document.getElementById("Waiterimage").files[0] // Get the file input
        };

        // Create FormData object to handle file upload
        const formData = new FormData();
        for (const key in waiterData) {
            formData.append(key, waiterData[key]);
        }

        // Retrieve the token from local storage
        const token = localStorage.getItem('authToken');
        console.log("Token:", token); // Check if the token is retrieved correctly

        // Send data to the backend API
        axios.post("http://localhost/avadh_api/super_admin/waiter/add_waiter.php", formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        })
            .then(response => {
                console.log("Waiter added successfully:", response.data);
                document.getElementById("imgModal").style.display = "block"; // Show success modal
                clearForm(); // Clear the form after successful submission
            })
            .catch(error => {
                console.error("Error adding waiter:", error.response ? error.response.data : error.message);
            });
    };

    const clearForm = () => {
        document.getElementById("add_waiter_form").reset();
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

        console.log(passwordData);


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
                console.log(response);
                const changePasswordModal = document.getElementById('changepassModal');
                console.log(changePasswordModal);

                const modal = new window.bootstrap.Modal(changePasswordModal);
                console.log(modal);

                if (modal) {
                    modal.hide();
                } else {
                    const newModal = new bootstrap.Modal(changePasswordModal);
                    newModal.hide();
                }
                setNewPassword("");
                setConfirmPassword("");
                return response.json();

            })
            .catch(error => {
                console.error("Error changing password:", error);
            });
    };
    return (
        <div>
            <SuperNavbar toggleDrawer={toggleDrawer} showSearch={false}/>
            <SuperSidePanel isOpen={isSidebarOpen} isWaiter={true} />
            <div id={styles['a_main-content']}>
                <div className={`container-fluid ${styles.a_main}`}>
                    <div className={styles.m_add}>
                        <span>Add Waiter</span>
                    </div>
                </div>
                <form action="" id="add_waiter_form" onSubmit={profilesave}>
                    <div className={`row d-flex ${styles['m_add_input']}`}>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" id="Firstname" placeholder="First Name" aria-label="Username" />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" id="Lastname" placeholder="Last Name" aria-label="Username" />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="email" className="form-control" id="waitermail" placeholder="Email" aria-label="Username" />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="tel" className="form-control" id="phone" maxLength="10" placeholder="Phone" aria-label="Username" />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group w-100 ${styles.m_add_input_mar}`}>
                                <input type="date" className="form-control" id="bod" placeholder="Date of Birth" aria-label="Username" />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div clasName={`w-100 ${styles.m_add_input_mar}`} style={{ padding: "0px", marginTop: "30px" }}>
                                <select className="form-control" aria-label="Dish Category" id="gender" style={{ border: " 1px solid #606060" }}>
                                    <option value="" disabled selected>Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" id="Address" placeholder="Address" aria-label="Username" />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div clssName={`col ${styles.m_add_input_mar}`} style={{ padding: "0px", marginTop: "30px" }}>
                                <select className="form-control" aria-label="Dish Category" id="city" style={{ border: " 1px solid #606060" }}>
                                    <option value="" disabled selected>City</option>
                                    <option value="Surat">Surat</option>
                                    <option value="Vapi">Vapi</option>
                                    <option value="Baroda">Baroda</option>
                                    <option value="Mumbai">Mumbai</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`col ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" aria-label="Dish Category" id="state">
                                    <option value="" disabled selected>State</option>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Uttarakhand">Uttarakhand</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`col ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" aria-label="Dish Category" id="country">
                                    <option value="" disabled selected>Country</option>
                                    <option value="India">India</option>
                                    <option value="China">China</option>
                                    <option value="Japan">Japan</option>
                                    <option value="Canada">Canada</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" aria-label="Dish Category" id="profession">
                                    <option value="" disabled selected>Profession</option>
                                    <option value="Accountant">Accountant</option>
                                    <option value="Waiter">Waiter</option>
                                    <option value="Chef">Chef</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`} style={{ padding: "0px", marginTop: "30px" }}>
                            <div clasName={`w-100 ${styles.m_add_input_mar}`} >
                                {/* <input className="form-control m_add_file" id="Waiterimage" placeholder="image" type="file" style={{ lineHeight: '1.1' }} /> */}
                                <input type="file" class="form-control" style={{ border: " 1px solid #606060" }} id="Waiterimage" name="image" required></input>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="password" className="form-control" id="password" placeholder="Password" aria-label="Username" />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="password" className="form-control" id="conpassword" placeholder="Confirm Password" aria-label="Username" />
                            </div>
                        </div>
                    </div>

                    <div className={styles.m_btn_clear_save}>
                        <div className={styles.m_btn_clear}>
                            <button type="button" onClick={clearForm}><i className="fa-solid fa-eraser"></i>Clear</button>
                        </div>
                        <div className={styles.m_btn_save}>
                            <button type="submit"><i className="fa-regular fa-floppy-disk"></i>Save</button>
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

export default AddWaiter;