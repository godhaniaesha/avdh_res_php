import React, { useEffect, useState } from "react";
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import SuperNavbar from "./SuperNavbar";
import SuperSidePanel from "./SuperSidePanel";
import styles from "../../css/EditChef.module.css";
import style from "../../css/BillPayment.module.css";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function EditChef() {
    const [imageName, setImageName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changepasswordmodal, setChangepasswordmodal] = useState(false)
    const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");
    const [chefData, setChefData] = useState({
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        country: '',
        profession: '',
        image: '',
       
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleDrawer = () => {
        setIsSidebarOpen(prev => !prev);
      };
    useEffect(() => {
        const chefDataFromStorage = localStorage.getItem("chefData");
        if (chefDataFromStorage) {
            setChefData(JSON.parse(chefDataFromStorage)); // Set chef data from localStorage
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setChefData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

 // ... existing code ...
const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        setImageName(file.name);
        setChefData(prev => ({
            ...prev,
            chefImage: file  // Store the actual file object
        }));
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("authToken");
    const formDataToSend = new FormData();
    
    // Append all form fields
    formDataToSend.append("user_id", chefData.id);
    formDataToSend.append("firstName", chefData.firstName);
    formDataToSend.append("lastName", chefData.lastName);
    formDataToSend.append("email", chefData.email);
    formDataToSend.append("phone", chefData.phone);
    formDataToSend.append("dateOfBirth", chefData.dateOfBirth);
    formDataToSend.append("gender", chefData.gender);
    formDataToSend.append("address", chefData.address);
    formDataToSend.append("city", chefData.city);
    formDataToSend.append("state", chefData.state);
    formDataToSend.append("country", chefData.country);
    
    // Handle image upload
    if (chefData.chefImage instanceof File) {
        formDataToSend.append("image", chefData.chefImage);
    }

    try {
        const response = await axios.post(
            "http://localhost/avadh_api/super_admin/chef/update_chef.php",
            formDataToSend,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json",
                },
            }
        );

        if (response.data.success) {
            alert("Chef data updated successfully!");
            navigate('/superChef');
        } else {
            alert(response.data.message || "Failed to update chef data");
        }
    } catch (error) {
        console.error("Error updating chef data:", error);
        alert("Failed to update chef data. Please try again.");
    }
};
// ... existing code ...
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
            <SuperNavbar toggleDrawer={toggleDrawer} showSearch={false}/>
            <SuperSidePanel isOpen={isSidebarOpen} isChef={true} />

            <div id={styles["a_main-content"]}>
                <div className={`container-fluid ${styles.a_main}`}>
                    <div className={styles.m_add}>
                        <span>Edit Chef</span>
                    </div>
                </div>

                <form id={styles.editChefForm} onSubmit={handleSubmit}>
                    <div className={`row d-flex ${styles.m_add_input}`}>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="First Name"
                                    name="firstName"
                                    value={chefData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Last Name"
                                    name="lastName"
                                    value={chefData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Email"
                                    name="email"
                                    value={chefData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Phone"
                                    maxLength="10"
                                    name="phone"
                                    value={chefData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group w-100 ${styles.m_add_input_mar}`}>
                                <input type="date" name="dateOfBirth" className="form-control" value={chefData.dateOfBirth} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select
                                    className="form-control"
                                    name="gender"
                                    value={chefData.gender}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`input-group ${styles.m_add_input_mar}`}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Address"
                                    name="address"
                                    value={chefData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select
                                    className="form-control"
                                    name="city"
                                    value={chefData.city}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Surat">Surat</option>
                                    <option value="Vapi">Vapi</option>
                                    <option value="Baroda">Baroda</option>
                                    <option value="Mumbai">Mumbai</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select
                                    className="form-control"
                                    name="state"
                                    value={chefData.state}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Gujarat">Gujarat</option>
                                    <option value="Haryana">Haryana</option>
                                    <option value="Karnataka">Karnataka</option>
                                    <option value="Uttarakhand">Uttarakhand</option>
                                </select>
                            </div>
                        </div>
                        <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                            <div className={`w-100 ${styles.m_add_input_mar}`} style={{ padding: 0 }}>
                                <select
                                    className="form-control"
                                    name="country"
                                    value={chefData.country}
                                    onChange={handleInputChange}
                                    required
                                >
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
                                    onChange={handleImageChange}
                                    style={{ display: "none", border: "1px solid #2e2e2e;" }}
                                />
                                <label htmlFor="image"
                                    className={`form-control ${styles.m_add_file} d-flex flex-wrap justify-content-between align-items-center`} >
                                    <span>{imageName || chefData.chefImage || "No file chosen"}</span>
                                    <span className={`btn btn-primary ${styles.d_choose_file}`}>CHOOSE </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={styles.m_btn_clear_save}>
                        <div className={styles.m_btn_save}>
                            <button type="submit" className={`btn ${styles.btn_save}`}>
                                Save Changes
                            </button>
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

export default EditChef;

// Function to handle adding a dish
// const handleAddDish = async (event) => {
//     event.preventDefault(); // Prevent form from refreshing the page
//     try {
//       // Validate that all required fields are filled
//       if (!dishName || !dishCategory || !sellingPrice || !costPrice || !status || !dishImage || !description) {
//         throw new Error("Please fill out all fields"); // Throw error if any field is missing
//       }
  
//       // Prepare form data
//       const formData = {
//         dishName,
//         dishCategory,
//         sellingPrice,
//         costPrice,
//         status,
//         dishImage: dishImage.name, // Include image name (consider using form data to upload file)
//         description,
//       };
  
//       // Retrieve the token from localStorage
//       const token = localStorage.getItem("authToken"); 
//       if (!token) throw new Error("No authentication token found"); // Throw error if token is missing
  
//       // Send the POST request with the Authorization header
//       const response = await fetch("http://localhost:8000/api/createDish", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Add Bearer token for authorization
//         },
//         body: JSON.stringify(formData), // Send form data as JSON
//       });
  
//       // Handle the response
//       if (!response.ok) throw new Error("Failed to add dish: " + response.statusText); // Throw error for failed request
  
//       // If successful, clear the form
//       console.log("Dish added successfully!");
//       clearForm(); 
//       alert("Dish added successfully!");
//     } catch (error) {
//       console.error("Error adding dish:", error.message);
//       alert(error.message); // Display the error to the user
//     }
//   };
  