import React, { useEffect, useState } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import SuperNavbar from './SuperNavbar';
import SuperSidePanel from './SuperSidePanel';
import styles from "../../css/EditChef.module.css";
import style from "../../css/BillPayment.module.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditAccountant() {
    const [formData, setFormData] = useState({
        _id: '', // Add this line to store the accountant ID
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'male',
        address: '',
        city: 'Surat',
        state: 'Gujarat',
        country: 'India',
        profession: '',
        image: '',
    });
    const [imageName, setImageName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changepasswordmodal, setChangepasswordmodal] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
   


    useEffect(() => {
        const accountantData = localStorage.getItem("accountantData");
        if (accountantData) {
            const parsedData = JSON.parse(accountantData);
            setFormData(parsedData);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFormData({ ...formData, image: e.target.files[0] });
            setImageName(e.target.files[0].name);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const accountantId = formData.id;
            console.log("Accountant ID:", accountantId);
            
            if (!accountantId) throw new Error("Accountant ID not found");
    
            const token = localStorage.getItem("authToken");
            console.log("Stored Token:", token);
            
            if (!token) throw new Error("Authentication token is missing");
    
            const formDataToSend = new FormData();
            formDataToSend.append("userId", formData.id);
            formDataToSend.append("firstName", formData.firstName);
            formDataToSend.append("lastName", formData.lastName);
            formDataToSend.append("email", formData.email);
            formDataToSend.append("phone", formData.phone);
            formDataToSend.append("dateOfBirth", formData.dateOfBirth);
            formDataToSend.append("gender", formData.gender);
            formDataToSend.append("address", formData.address);
            formDataToSend.append("city", formData.city);
            formDataToSend.append("state", formData.state);
            formDataToSend.append("country", formData.country);
            if (formData.image) {
                formDataToSend.append("image", formData.image);
            }
            // formDataToSend.append("userId", formData.id);
            // formDataToSend.append("firstName", formData.firstName);
            // formDataToSend.append("lastName", formData.lastName);
            // if (formData.image) {
            //     formDataToSend.append("image", formData.image);
            // }
    
            console.log("Sending FormData:", [...formDataToSend.entries()]); 
    
            const response = await axios.post(
                "http://localhost/avadh_api/super_admin/accountant/update_accountant.php",
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
                navigate("/superaccountlist");
            } else {
                throw new Error(response.data.message || "Failed to update accountant details");
            }
        } catch (error) {
            console.error("Error updating Accountant details:", error.message);
        }
    };
    
    
    const toggleDrawer = () => {
        setIsSidebarOpen(prev => !prev);
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
        <section id="a_selectTable">
            <SuperNavbar toggleDrawer={toggleDrawer} showSearch={false} />
            <SuperSidePanel isOpen={isSidebarOpen} isAccountant={true} />
            <div id={styles['a_main-content']}>
                <div className={`container-fluid ${styles.a_main}`}>
                    <div className={styles.m_add}>
                        <span>Edit Accountant</span>
                    </div>
                </div>
                <form id={styles.editWaiterForm} onSubmit={handleSubmit}>
                    <div className={`row d-flex ${styles.m_add_input}`}>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" placeholder="First Name" aria-label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" placeholder="Last Name" aria-label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="email" className="form-control" placeholder="Email" aria-label="Email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" placeholder="Phone" aria-label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 input-group ${styles.m_add_input_mar}`}>
                                <input type="date" className="form-control" placeholder="Date of Birth" aria-label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" aria-label="Gender" name="gender" value={formData.gender} onChange={handleChange} required>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input type="text" className="form-control" placeholder="Address" aria-label="Address" name="address" value={formData.address} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" aria-label="City" name="city" value={formData.city} onChange={handleChange} required>
                                    <option value="Surat">Surat</option>
                                    <option value="Vapi">Vapi</option>
                                    <option value="Baroda">Baroda</option>
                                    <option value="Mumbai">Mumbai</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" aria-label="State" name="state" value={formData.state} onChange={handleChange} required>
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Uttarakhand">Uttarakhand</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select className="form-control" aria-label="Country" name="country" value={formData.country} onChange={handleChange} required>
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
                                    onChange={handleFileChange}
                                    style={{ display: "none", border: "1px solid #2e2e2e;" }}
                                />
                                <label htmlFor="image"
                                    className={`form-control ${styles.m_add_file} flex-wrap d-flex justify-content-between align-items-center`} >
                                    <span>{imageName || formData.image || "No file chosen"}</span>
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

        </section>
    );
}

export default EditAccountant;