import React, { useEffect, useState } from 'react';
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import ChefNavbar from './ChefNavbar';
import ChefSidePanel from './ChefSidePanel';
import styles from "../../css/AddCategory.module.css";
import style from "../../css/EditChef.module.css";
import styl from "../../css/BillPayment.module.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditCategory() {
    const [catName, setCatName] = useState(''); // State for category name
    const [image, setImage] = useState(null); // State for the selected image
    const [storedCatId, setStoredCatId] = useState(''); // State for the category ID
    const [currentImageName, setCurrentImageName] = useState(''); // State for the current image name
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [newPassword, setNewPassword] = useState(""); // State for new password
    const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
    const [changepasswordmodal, setChangepasswordmodal] = useState(false); // State for change password modal
    const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");

    useEffect(() => {
        // Get the category ID from local storage
        const catId = localStorage.getItem('ecatId');
        setStoredCatId(catId);
        if (catId) {
            getCatDetails(catId); // Fetch category details if ID exists
        }
    }, []);

    // Function to fetch category details from the API
    const getCatDetails = async (ecatId) => {
        var token = localStorage.getItem("authToken");
        const formData = new FormData(); 
        formData.append('cat_id', ecatId); // Append new image if selected
        try {
            // Added http:// to the URL
            const response = await axios.post('http://localhost/avadh_api/chef/category/view_category.php',formData,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log('view',response.data.categories);
            const catData = response.data.categories;
            console.log(catData, "catData");

            populateCatForm(catData); // Populate the form with fetched data
        } catch (error) {
            console.error('Error fetching category details:', error.message);
        }
    };

    // Function to populate the form with fetched category data
    const populateCatForm = (catData) => {
        setCatName(catData.categoryName); // Set the category name
        setCurrentImageName(catData.categoryImage.split('\\').pop()); // Set the current image name (extract the filename)
    };

    // Function to handle form submission
    const updateCatDetails = async (event) => {
        event.preventDefault(); // Prevent default form submission
        var token = localStorage.getItem("authToken");
        var cat_id = localStorage.getItem("ecatId");
        try {
            if (!storedCatId) throw new Error('Category ID not found in localStorage');
            const catNameValue = catName.trim();
            if (!catNameValue) throw new Error('Category name is required');

            const formData = new FormData(); // Create a FormData object
            formData.append('cat_id', cat_id); // Append category name
            formData.append('categoryName', catNameValue); // Append category name
            if (image) {
                formData.append('categoryImage', image); // Append new image if selected
            }

            // Send PUT request to update the category
            // const response = await fetch(`http://localhost/avadh_api/chef/category/view_category.php`, {
            //     method: 'PUT',
            //     body: formData
            // });
            const response = await axios.post('http://localhost/avadh_api/chef/category/update_category.php',formData,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            // console.log('view',response);
            window.location.href = "/chef_category"; // Redirect to category list page
            
            // if (!response.ok) throw new Error('Failed to update category details');
            // console.log('Category details updated successfully!');
        } catch (error) {
            console.error('Error updating category details:', error.message);
        }
    };

    // Function to handle image selection
    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            setImage(e.target.files[0]); // Set the selected image file
            setCurrentImageName(e.target.files[0].name); // Update the current image name
        }
    };

    // Function to clear the form
    const clearForm = () => {
        setCatName(''); // Reset category name
        setImage(null); // Reset image
        setCurrentImageName(''); // Reset current image name
    };

    const toggleDrawer = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const toggleNotifications = () => {
        const panel = document.getElementById("notification-panel");
        panel.style.display = panel.style.display === "none" || panel.style.display === "" ? "block" : "none";
    };

    // ... existing code ...
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

                // Hide the modal after successful password change
                const changePasswordModal = document.getElementById('changepassModal');
                if (changePasswordModal) {
                    // Remove the 'show' class directly
                    changePasswordModal.classList.remove('show');
                    changePasswordModal.style.display = 'none'; // Also set display to none

                    // Remove the backdrop
                    const backdrop = document.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.remove(); // Remove the backdrop element
                    }

                    // Optionally, reset the modal content
                    setNewPassword("");
                    setConfirmPassword("");
                }

                return response.json();
            })
            .catch(error => {
                console.error("Error changing password:", error);
            });
    };


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
    return (
        <div id={styles.a_selectTable}>
            <ChefNavbar toggleDrawer={toggleDrawer} showSearch={false} toggleNotifications={toggleNotifications} />
            <ChefSidePanel isOpen={isSidebarOpen} isChefDashboard={false} isChefMenu={false} isChefCategory={true} isChefVariant={false} isChefProfile={false} />
            <div id={styles['a_main-content']}>
                <div className={`container-fluid ${styles.a_main}`}>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '30px' }}>Edit Category</div>
                    </div>
                    <form id={styles.editCatForm} onSubmit={updateCatDetails}>
                        <div className={`row ${styles.v_row_adddish}`}>
                            <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                                <div className={`w-100 ${style.m_add_input_mar}`}>
                                    <input type="text"
                                        className={`form-control pb-2 ${styles['form-control']} ${styles.v_dishinput_pad}`}
                                        placeholder="Category Name"
                                        aria-label="Category Name"
                                        id="catName"
                                        value={catName}
                                        onChange={(e) => setCatName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                                <div className={`w-100 ${style.m_add_input_mar}`} style={{ paddingRight: '30px' }}>
                                    <input
                                        className={`form-control ${style['form-control']} ${style.v_dishinput_pad}`}
                                        id="image"
                                        type="file"
                                        onChange={handleImageChange}
                                        style={{ display: "none", border: "1px solid #2e2e2e;" }}
                                    />
                                    <label htmlFor="image"
                                        className={`form-control ${style.m_add_file} ${style.v_dishinput_pad} d-flex flex-wrap justify-content-between align-items-center`}>
                                        <span>{currentImageName || "No file chosen"}</span>
                                        <span className={`btn btn-primary ${style.d_choose_file}`}>CHOOSE</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '100px' }}>
                            <button type="button" className={`btn border-secondary border me-3 ${styles.v_btn_size}`} style={{ color: '#B5B5B5' }} onClick={clearForm}>
                                <FontAwesomeIcon icon={faEraser} style={{ marginRight: '10px' }} />Clear
                            </button>
                            <button type="submit" className={`btn btn-primary border-secondary border mx-3 ${styles.v_btn_size}`} style={{ color: 'white', backgroundColor: '#4B6C52' }}>
                                <FontAwesomeIcon icon={faFloppyDisk} style={{ marginRight: '10px' }} />Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {/* Change Password Modal */}
            <div
            className={`modal fade ${styl.m_model_ChangePassword}`}
            id="changepassModal"
            tabIndex="-1"
            aria-labelledby="changepassModalLabel"
            aria-hidden="true"
          >
            <div className={`modal-dialog modal-dialog-centered ${styl.m_model}`}>
              <div className={`modal-content ${styl.m_change_pass}`} style={{ border: "none", backgroundColor: "#f6f6f6" }}>
                <div className={`modal-body ${styl.m_change_pass_text}`}>
                  <span>Change Password</span>
                </div>
                <div className={styl.m_old}>
                  <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </div>
                <div className={styl.m_new}>
                  <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <div className={styl.m_confirm}>
                  <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <div className={styl.m_btn_cancel_change}>
                  <div className={styl.m_btn_cancel}>
                    <button data-bs-dismiss="modal">Cancel</button>
                  </div>
                  <div className={styl.m_btn_change}>
                    <button type="button" onClick={handlePasswordChange}>Change</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div
                className={`modal fade ${styl.m_model_logout}`}
                id="logoutModal"
                tabIndex="-1"
                aria-labelledby="logoutModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div
                        className={`modal-content ${styl.m_model_con}`}
                        stylee={{ border: "none", backgroundColor: "#f6f6f6" }}
                    >
                        <div className={styl.m_log}>
                            <div className={styl.m_logout}>
                                <span>Logout</span>
                            </div>
                            <div className={styl.m_text}>
                                <span>Are You Sure You Want To Logout?</span>
                            </div>
                            <div className={styl.m_btn_cancel_yes}>
                                <div className={styl.m_btn_cancel_logout}>
                                    <button data-bs-dismiss="modal">Cancel</button>
                                </div>
                                <div className={styl.m_btn_yes}>
                                    {/* <button onClick={handleLogout}>Logout</button> */}
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

export default EditCategory;
