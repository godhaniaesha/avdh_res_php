import React, { useEffect, useState } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import styles from '../../css/EditWaiter.module.css';
import SuperSidePanel from './SuperSidePanel';
import SuperNavbar from './SuperNavbar';
import { useNavigate } from 'react-router-dom';
import style from "../../css/BillPayment.module.css";
import axios from 'axios';

function EditWaiter() {
    const [imageName, setImageName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changepasswordmodal, setChangepasswordmodal] = useState(false)
    const [waiterData, setWaiterData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'male',
        address: '',
        city: '',
        state: '',
        country: '',
        profession: '',
        image: '',
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");

    useEffect(() => {
        // Get the waiter data from local storage
        const storedWaiterData = localStorage.getItem('waiterData');
        if (storedWaiterData) {
            setWaiterData(JSON.parse(storedWaiterData)); // Set waiter data from localStorage
        }
    }, []);
    const updateWaiterDetails = async (event) => {
        event.preventDefault();

        try {
            const accountantId = waiterData.id; // Use waiterData instead of formData
            console.log("Accountant ID:", accountantId);

            if (!accountantId) throw new Error("Accountant ID not found");

            const token = localStorage.getItem("authToken");
            console.log("Stored Token:", token);

            if (!token) throw new Error("Authentication token is missing");

            const formDataToSend = new FormData(); // Renamed variable to avoid conflict

            formDataToSend.append('userId', accountantId); // Add userId
            formDataToSend.append('firstName', waiterData.firstName);
            formDataToSend.append('lastName', waiterData.lastName);
            formDataToSend.append('email', waiterData.email);
            formDataToSend.append('phone', waiterData.phone);
            formDataToSend.append('dateOfBirth', waiterData.dateOfBirth);
            formDataToSend.append('gender', waiterData.gender);
            formDataToSend.append('address', waiterData.address);
            formDataToSend.append('city', waiterData.city);
            formDataToSend.append('state', waiterData.state);
            formDataToSend.append('country', waiterData.country);
            if (waiterData.image) {
                formDataToSend.append("image", waiterData.image);
            }

            console.log("Sending FormData:", [...formDataToSend.entries()]);

            const response = await axios.post(
                "http://localhost/avadh_api/super_admin/waiter/update_waiter.php",
                formDataToSend,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json",
                    },
                }
            );

            console.log("API Response:", response.data);

            if (response.data.success) {
                console.log("Accountant details updated successfully!");
                navigate("/superWaiter");
            } else {
                throw new Error(response.data.message || "Failed to update accountant details");
            }
        } catch (error) {
            console.error("Error updating Accountant details:", error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWaiterData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            setWaiterData({ ...waiterData, image: e.target.files[0] }); // Update image in waiterData
            setImageName(e.target.files[0].name); // Set the image name for display
        }
    };

    const toggleDrawer = () => {
        setIsSidebarOpen(prev => !prev);
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
        <div>
            <SuperNavbar toggleDrawer={toggleDrawer} showSearch={false} />
            <SuperSidePanel isOpen={isSidebarOpen} isWaiter={true} />

            <div id={styles['a_main-content']}>
                <div className={`container-fluid ${styles.a_main}`}>
                    <div className={styles.m_add}>
                        <span>Edit Waiter</span>
                    </div>
                </div>

                {/* Edit Waiter Form */}
                <form id={styles.editWaiterForm} onSubmit={updateWaiterDetails}>
                    <div className={`row d-flex ${styles.m_add_input}`}>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" placeholder="First Name" name="firstName" value={waiterData.firstName || ''} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" placeholder="Last Name" name="lastName" value={waiterData.lastName || ''} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="email" className="form-control" placeholder="Email" name="email" value={waiterData.email || ''} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" maxLength="10" placeholder="Phone" name="phone" value={waiterData.phone || ''} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 input-group ${styles.m_add_input_mar}`}>
                                <input type="date" className="form-control" name="dateOfBirth" value={waiterData.dateOfBirth || ''} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" name="gender" value={waiterData.gender || ''} onChange={handleChange} required>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" placeholder="Address" name="address" value={waiterData.address || ''} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" name="city" value={waiterData.city || ''} onChange={handleChange} required>
                                    <option value="Surat">Surat</option>
                                    <option value="Vapi">Vapi</option>
                                    <option value="Baroda">Baroda</option>
                                    <option value="Mumbai">Mumbai</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" name="state" value={waiterData.state || ''} onChange={handleChange} required>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Uttarakhand">Uttarakhand</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" name="country" value={waiterData.country || ''} onChange={handleChange} required>
                                    <option value="India">India</option>
                                    <option value="China">China</option>
                                    <option value="Japan">Japan</option>
                                    <option value="Canada">Canada</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`}>
                                <input
                                    className={`form-control ${styles.m_add_input_pad} ${styles.m_add_file}`}
                                    id="image"
                                    type="file"
                                    onChange={handleImageChange} // Add onChange handler
                                    style={{ display: "none", border: "1px solid #2e2e2e;" }} // Hide the default file input
                                />
                                <label htmlFor="image"
                                    className={`form-control ${styles.m_add_file} d-flex flex-wrap justify-content-between align-items-center`} >
                                    <span>{imageName || waiterData.image || "No file chosen"}</span> {/* Display the selected image name or default from API */}
                                    <span className={`btn btn-primary ${styles.d_choose_file}`}>CHOOSE </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.m_btn_clear_save}>
                        <div className={styles.m_btn_save}>
                            <button type="submit" className={`btn ${styles.btn_save}`}>Save Changes</button>
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


                {/* Success Modal */}
                <div
                    className="modal fade"
                    id="deleteModal"
                    tabIndex="-1"
                    aria-labelledby="deleteModalLabel"
                    aria-hidden="true"
                >
                    <div className="m_model modal-dialog modal-dialog-centered">
                        <div
                            className="modal-content m_save"
                            style={{ border: "none", backgroundColor: "#f6f6f6" }}
                        >
                            <div className="modal-body m_save_text">
                                <span>Add Successfully!</span>
                            </div>
                            <div className="m_save_img">
                                <img src="image/right.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditWaiter;