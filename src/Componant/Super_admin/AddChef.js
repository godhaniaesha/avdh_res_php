import React, { useEffect, useState, useRef } from 'react';
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import SuperNavbar from './SuperNavbar';
import SuperSidePanel from './SuperSidePanel';
import styles from '../../css/AddChef.module.css';
import style from "../../css/BillPayment.module.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddChef(props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const formRef = useRef(null);
    const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changepasswordmodal, setChangepasswordmodal] = useState(false)

    const profilesave = (event) => {
        event.preventDefault();

        // Gather form data
        const chefData = {
            firstName: document.getElementById("Firstname").value,
            lastName: document.getElementById("Lastname").value,
            email: document.getElementById("chefmail").value,
            phone: document.getElementById("phone").value,
            dateOfBirth: document.getElementById("bod").value,
            gender: document.getElementById("gender").value,
            address: document.getElementById("Address").value,
            city: document.getElementById("city").value,
            state: document.getElementById("state").value,
            country: document.getElementById("country").value,
            password: document.getElementById("password").value,
            image: document.getElementById("Waiterimage").files[0],// Get the file input
            confirmPassword: document.getElementById("conpassword").value,
        };

        // Create FormData object to handle file upload
        const formData = new FormData();
        for (const key in chefData) {
            formData.append(key, chefData[key]);
        }

        // Retrieve the token from local storage
        const token = localStorage.getItem('authToken');
        console.log("Token:", token); // Check if the token is retrieved correctly

        // Send data to the backend API
        axios.post("http://localhost/avadh_api/super_admin/chef/add_chef.php", formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            }
        })
            .then(response => {
                console.log("Chef added successfully:", response.data);
                
                // Show success modal
                const modalElement = document.getElementById('imgModal');
                if (modalElement) {
                    const successModal = new bootstrap.Modal(modalElement);
                    successModal.show();

                    // Automatically close modal and redirect after 2 seconds
                    setTimeout(() => {
                        successModal.hide();
                        navigate('/superchef'); // Adjust the route as needed
                    }, 2000);
                }
                
                clearForm(); // Clear the form after successful submission
            })
            .catch(error => {
                console.error("Error adding chef:", error.response ? error.response.data : error.message);
            });
    };

    const toggleDrawer = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const clearForm = () => {
        if (formRef.current) {
            formRef.current.reset();
        } else {
            console.error("Form reference is null");
        }
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
    const handlePasswordChange = async () => {
        // Validation checks
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("Please fill in all password fields.");
            return;
        }

        const token = localStorage.getItem("authToken");
        
        try {
            const formData = new FormData();
            formData.append('oldPassword', oldPassword);
            formData.append('newPassword', newPassword);
            formData.append('confirmPassword', confirmPassword);

            const response = await axios.post(
                'http://localhost/avadh_api/super_admin/profile/change_password.php',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            let responseData;
            if (typeof response.data === 'string') {
                try {
                    const cleanJson = response.data.replace(/^\d+/, '');
                    responseData = JSON.parse(cleanJson);
                } catch (e) {
                    console.error('Error parsing response:', e);
                    responseData = { success: false, message: 'Invalid response format' };
                }
            } else {
                responseData = response.data;
            }

            if (responseData.success === true) {
                alert(responseData.message || 'Password changed successfully');
                
                // Close modal
                const changePasswordModal = document.getElementById("changepassModal");
                if (changePasswordModal) {
                    const modalInstance = bootstrap.Modal.getInstance(changePasswordModal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
                
                // Clear password fields
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                alert(responseData.message || 'Failed to change password');
            }
        } catch (error) {
            console.error("Error changing password:", error);
            
            if (error.response) {
                try {
                    let errorData;
                    if (typeof error.response.data === 'string') {
                        const cleanJson = error.response.data.replace(/^\d+/, '');
                        errorData = JSON.parse(cleanJson);
                    } else {
                        errorData = error.response.data;
                    }
                    alert(errorData.message || 'Server error');
                } catch (e) {
                    alert('Error processing server response');
                }
            } else if (error.request) {
                alert('No response from server. Please check your connection.');
            } else {
                alert('Error: ' + error.message);
            }
        }
    };
    return (
        <section id={styles.a_selectTable}>

            <SuperNavbar toggleDrawer={toggleDrawer} showSearch={false}></SuperNavbar>
            <SuperSidePanel isOpen={isSidebarOpen} isChef={true} />

            <div id={styles['a_main-content']}>
                <div className={`container-fluid ${styles.a_main}`}>
                    <div className={styles.m_add}>
                        <span>Add Chef</span>
                    </div>
                </div>
                <form id={styles.add_chef_form} ref={formRef}>
                    <div className={`row d-flex ${styles.m_add_input}`}>
                        {/* Input fields for adding a chef */}
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
                                <input type="email" className="form-control" id="chefmail" placeholder="Email" aria-label="Username" />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="tel" className="form-control" id="phone" maxLength="10" placeholder="Phone" aria-label="Username" />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group w-100 ${styles.m_add_input_mar}`}>
                                <input type="date" className="form-control db_date-input" id="bod" placeholder="Date of Birth" aria-label="Username" />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" aria-label="Dish Category" id="gender">
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
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" aria-label="Dish Category" id="city">
                                    <option value="" disabled selected>City</option>
                                    <option value="Surat">Surat</option>
                                    <option value="Vapi">Vapi</option>
                                    <option value="Baroda">Baroda</option>
                                    <option value="Mumbai">Mumbai</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`col ${styles.m_add_input_mar} w-100`} style={{ padding: 0 }}>
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
                            <div className={`col ${styles.m_add_input_mar} w-100`} style={{ padding: 0 }}>
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
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`}>
                                {/* <input className="form-control m_add_file" id="chefimage" placeholder="Image" type="file" style={{ lineHeight: '1.1' }} /> */}
                                <input class="form-control m_add_file" id="Waiterimage" name="image" type="file" required=""></input>
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
                            <button type="button" onClick={clearForm}>
                                <i className="fa-solid fa-eraser"></i> Clear
                            </button>
                        </div>
                        <div className={styles.m_btn_save} style={{border: "2px solid #4B6C52", borderRadius: "8px"}}>
               
                            <button type="button" onClick={profilesave} data-toggle="modal" data-target="#imgModal">
                                <i className="fa-regular fa-floppy-disk"></i> Save
                            </button>
                        </div>
                    </div>
                </form>
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

                {/* Add Successfully Modal */}
                <div 
                    className="modal fade" 
                    id="imgModal" 
                    tabIndex="-1" 
                    aria-labelledby="successModalLabel" 
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{ border: 'none', backgroundColor: '#f6f6f6', padding: '20px' }}>
                            <div className="modal-body text-center">
                                <h4 style={{
                                    fontSize: '24px',
                                    fontWeight: '500',
                                    marginBottom: '20px'
                                }}>
                                    Add Successfully!
                                </h4>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    backgroundColor: '#4B6C52',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto'
                                }}>
                                    <i className="fas fa-check" style={{
                                        color: 'white',
                                        fontSize: '30px'
                                    }}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AddChef;