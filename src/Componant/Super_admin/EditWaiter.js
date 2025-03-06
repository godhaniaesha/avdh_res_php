import React, { useEffect, useState } from 'react';
import styles from '../../css/EditWaiter.module.css';
import SuperSidePanel from './SuperSidePanel';
import SuperNavbar from './SuperNavbar';
import { useNavigate } from 'react-router-dom';
import style from "../../css/BillPayment.module.css";

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
        const formData = new FormData(); // Use FormData to handle file uploads
        formData.append('image', waiterData.image); // Append the image file
        formData.append('firstName', waiterData.firstName);
        formData.append('lastName', waiterData.lastName);
        formData.append('email', waiterData.email);
        formData.append('phone', waiterData.phone);
        formData.append('dateOfBirth', waiterData.dateOfBirth);
        formData.append('gender', waiterData.gender);
        formData.append('address', waiterData.address);
        formData.append('city', waiterData.city);
        formData.append('state', waiterData.state);
        formData.append('country', waiterData.country);
        
        try {
            const response = await fetch(`http://localhost:8000/api/updateUser/${waiterData._id}`, {
                method: 'PUT',
                body: formData, // Send FormData
            });

            if (!response.ok) {
                throw new Error('Failed to update waiter details');
            } else {
                console.log('Waiter details updated successfully!');
                window.location.href = '/superWaiter'; // Redirect after successful update
            }
        } catch (error) {
            console.error('Error updating waiter details:', error.message);
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


                {/* Logout Modal */}
                <div
                    className={`modal fade ${styles.m_model_logout}`}
                    id="logoutModal"
                    tabIndex="-1"
                    aria-labelledby="logoutModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div
                            className={`modal-content ${styles.m_model_con}`}
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
                                        <button data-bs-dismiss="modal">Cancel</button>
                                    </div>
                                    <div className={styles.m_btn_yes}>
                                        <button type="button" data-bs-toggle="modal" data-bs-target="#logoutModal" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </div>
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