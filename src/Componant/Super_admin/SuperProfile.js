import React, { useEffect, useState } from 'react';
import SuperSidePanel from './SuperSidePanel';
import SuperNavbar from './SuperNavbar';
import styles from '../../css/SuperProfile.module.css';
import style from "../../css/BillPayment.module.css";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

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
        const id = localStorage.getItem("userId");
        setAdminId(id);

        if (id) {
            // Fetch user data from the backend using the ID
            fetch(`http://localhost:8000/api/getUser/${id}`)
                .then(response => {
                    if (!response.ok) throw new Error("Network response was not ok");
                    return response.json();
                })
                .then(data => {
                    const userData = data.user;

                    setFormData({
                        firstName: userData.firstName || '',
                        lastName: userData.lastName || '',
                        email: userData.email || '',
                        phone: userData.phone || '',
                        image: userData.image || '',
                    });
                    setImageName(userData.image || ""); // Set image name from user data
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                });
        }
    }, []);

    const handleProfileSave = (e) => {
        e.preventDefault();
        const updatedData = {
            ...formData,  // Spread operator to include all current form data
            image: imageName, // Use the image name from the state
        };

        // If a new image is selected, update the image field with the new file name
        const imageInput = document.getElementById("image");
        if (imageInput.files.length > 0) {
            updatedData.image = imageInput.files[0].name; // Get the file name from input
        }

        if (!AdminId) {
            console.error("AdminId is not available.");
            return;
        }

        // Make the request to update the user details
        fetch(`http://localhost:8000/api/updateuser/${AdminId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Network response was not ok");
                return response.json();
            })
            .then((data) => {
                alert("Data updated successfully!");
            })
            .catch((error) => {
                alert("Failed to update data. Please try again.");
            });
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
                                        borderRadius:'6px'
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
