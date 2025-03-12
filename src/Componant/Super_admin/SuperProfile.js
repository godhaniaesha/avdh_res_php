import React, { useEffect, useState } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import SuperSidePanel from './SuperSidePanel';
import SuperNavbar from './SuperNavbar';
import styles from '../../css/SuperProfile.module.css';
import style from "../../css/BillPayment.module.css";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';

function SuperProfile() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        image: "",
    });
    const [AdminId, setAdminId] = useState(null);
    const [imageName, setImageName] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changepasswordmodal, setChangepasswordmodal] = useState(false)
    const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");

 useEffect(() => {
    const token = localStorage.getItem("authToken");
    const id = localStorage.getItem("userId");
    setAdminId(id);

    if (token) {
        // Fetch user data using axios
        axios.post('http://localhost/avadh_api/super_admin/profile/change_profile.php', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            const userData = response.data.user;
            setFormData({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                phone: userData.phone || '',
                image: userData.image || '',
            });
            setImageName(userData.image || "");
        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
    }
}, []);

const handleProfileSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");

    try {
        const formDataToSend = new FormData();
        formDataToSend.append('firstName', formData.firstName);
        formDataToSend.append('lastName', formData.lastName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);

        // If a new image is selected, append it
        const imageInput = document.getElementById("image");
        if (imageInput.files.length > 0) {
            formDataToSend.append('image', imageInput.files[0]);
        }

        const response = await axios.post(
            'http://localhost/avadh_api/super_admin/profile/change_profile.php',
            formDataToSend,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        if (response.data.success) {
            alert("Profile updated successfully!");
        } else {
            alert(response.data.message || "Failed to update profile");
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
    }
};
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            image: e.target.files[0],
        }));
        setImageName(e.target.files[0].name);
    };
    const handleUpdate = async () => {
        
        // window.location.href('/')
    }

    const toggleDrawer = () => {
        setIsSidebarOpen(prev => !prev);
    };

    // Handle logout
    const handleLogout = () => {
        if (window.bootstrap && window.bootstrap.Modal) {
            const logoutModal = document.getElementById('logoutModal');
            const modal = new window.bootstrap.Modal(logoutModal);
            modal.hide();
        }

        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");

        navigate("/login", { replace: true });

        window.history.pushState(null, '', window.location.href);
    };

    // Handle password change
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
        <div>
            <SuperNavbar toggleDrawer={toggleDrawer} showSearch={false} />
            <SuperSidePanel isOpen={isSidebarOpen} isProfile={true} />

            <div id={styles['a_main-content']}>
                <div className={`container-fluid ${styles.a_main}`}>
                    <div className={styles.m_add}>
                        <span>Profile</span>
                    </div>
                </div>

                <form id={styles.add_chef_form} className={styles.m_add_chef} onSubmit={handleProfileSave}>
                    <div className={`row d-flex ${styles.m_add_input} ${styles.m_chef_details}`}>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" id="First_Name" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" id="Last_name" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="email" className="form-control" id="Email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="Phone"
                                    name="phone"
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    maxLength="10"
                                    pattern="[0-9]{10}" // Pattern for 10-digit phone number
                                    onInvalid={(e) => e.target.setCustomValidity("Please enter a valid 10-digit phone number.")}
                                    onInput={(e) => e.target.setCustomValidity("")} // Clear custom validity on input
                                    style={{
                                        borderRadius: '6px'
                                    }}
                                />
                                <div className="invalid-feedback">
                                    Please enter a valid 10-digit phone number.
                                </div>
                            </div>
                        </div>

                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`}>
                                <input
                                    className={`form-control ${styles.m_add_file} ${styles.m_add_input_pad}`}
                                    type="file"
                                    id="image"
                                    onChange={handleFileChange}
                                    style={{ display: "none", border: "1px solid #2e2e2e;" }}
                                />
                                <button type="button" className={`form-control ${styles.m_add_file} d-flex flex-wrap justify-content-between align-items-center`} onClick={() => document.getElementById("image").click()}>
                                    {imageName || 'Choose Image'}
                                </button>
                            </div>
                        </div>

                        <div className={`${styles.m_btn_clear_save} ms-0`}>
                            <div className={styles.m_btn_save}>
                                <div className={`${styles.m_add_input_pad}`}>
                                    <button type="submit" className={styles.m_save_btn}>
                                        Save Change
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
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



            <div
                className={`modal ${styles.m_model_logout} fade`}
                id="logoutModal"
                tabIndex="-1"
                aria-labelledby="logoutModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div
                        className={`${styles.m_model_con} modal-content`}
                        style={{ border: "none", backgroundColor: "#f6f6f6" }}
                    >
                        <div className={styles.m_log}>
                            <div className={styles.m_logout}>
                                <span>Logout</span>
                            </div>
                            <div className={styles.m_text}>
                                <span>Are You Sure You Want To Logout?</span>
                            </div>
                            <div className={styles.m_btn_cancel_yes}>
                                <div className={styles.m_btn_cancel_logout}>
                                    <button id="cancelBtn" data-bs-dismiss="modal">Cancel</button>
                                </div>
                                <div className={styles.m_btn_yes}>
                                    {/* <button id="yesBtn">Yes</button> */}
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
    );
}

export default SuperProfile;
