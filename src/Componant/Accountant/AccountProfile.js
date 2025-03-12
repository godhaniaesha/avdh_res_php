
import React, { useEffect, useState } from "react";
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import styles from "../../css/AccountProfile.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import SidePanel from "./SidePanel";
import style from "../../css/BillPayment.module.css";
import { useNavigate } from 'react-router-dom';
import styl from "../../css/BillPayment.module.css";
import axios from "axios";


function AccountProfile(props) {
  // State to hold the accountant's data
  const [accountantData, setAccountantData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profession: "",
    image: "",
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [imageName, setImageName] = useState("");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changepasswordmodal, setChangepasswordmodal] = useState(false)

  // Fetch the user data when the component mounts
  useEffect(() => {
    const id = localStorage.getItem("userId");
    setAccountId(id);

    // if (id) {
    //   // Fetch user data from the backend using the ID
    //   fetch(`http://localhost:8000/api/getUser/${id}`)
    //     .then(response => {
    //       if (!response.ok) throw new Error("Network response was not ok");
    //       return response.json();
    //     })
    //     .then(data => {
    //       console.log("Fetched user data:", data);
    //       const userData = data.user;

    //       // Set the fetched user data into state
    //       setAccountantData({
    //         firstName: userData.firstName || '',
    //         lastName: userData.lastName || '',
    //         email: userData.email || '',
    //         phone: userData.phone || '',
    //         profession: userData.profession || '',
    //         image: userData.image || '',
    //       });
    //       setImageName(userData.image || ""); // Store the image name
    //     })
    //     .catch(error => {
    //       console.error("Error fetching user data:", error);
    //     });
    // }
    getUserData();
  }, []);
  const getUserData = async () => {
    const response = await axios.post(
      "http://localhost/avadh_api/Accountant/profile/change_profile.php",
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      }
    );
    const userData = response.data.user;

          // Set the fetched user data into state
          setAccountantData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
            profession: userData.role || '',
            image: userData.image || '',
          });
          setImageName(userData.image || ""); // Store the image name
    console.log("profile", response.data.user);

  }
  // Log current accountant data for debugging
  console.log("accountantData", accountantData);

  // Handle the profile update form submission
  const handleProfileSave = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Prepare updated data for submission
    const updatedData = {
      ...accountantData,
      image: imageName,
    };
    console.log("accountantData", updatedData);
    // Check if a new image file has been selected
    const imageInput = document.getElementById("image");
    if (imageInput.files.length > 0) {
      updatedData.image = imageInput.files[0].name; // Use the selected file name
    }

    var formData = new FormData;
    formData.append('firstName', updatedData.firstName);
    formData.append('lastName', updatedData.lastName);
    formData.append('email', updatedData.email);
    formData.append('phone', updatedData.phone);
    formData.append('image',imageInput.files[0]);
    // Send updated data to the backend
    axios.post(`http://localhost/avadh_api/Accountant/profile/change_profile.php`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "multipart/form-data", // Important for file uploads
      },
    })
    // fetch(`http://localhost:8000/api/updateuser/${accountId}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(updatedData),
    // })
    //   .then((response) => {
    //     if (!response.ok) throw new Error("Network response was not ok");
    //     alert("Data updated successfully!"); // Notify user on success
    //   })
    //   .catch((error) => {
    //     console.error("Error updating data:", error);
    //     alert("Failed to update data. Please try again."); // Notify user on error
    //   });
  };

  // Handle changes to the image input
  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImageName(e.target.files[0].name); // Store the selected image file name
    }
  };

  // Toggle the side drawer
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

        // Hide the modal after successful password change
        const changePasswordModal = document.getElementById('changepassModal');
        if (changePasswordModal) {
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

  return (
    <>
      <h1>Profile</h1>
      <div id="a_selectTable">
        <Navbar toggleDrawer={toggleDrawer} showSearch={false}/>
        <SidePanel isOpen={isSidebarOpen} isProfilePage={true} />
        <div id={styles["a_main-content"]}>
          <div className={`container-fluid ${styles.a_main}`}>
            <div className={styles.m_add}>
              <span>Profile</span>
            </div>
          </div>
          <form id="add_chef_form" className={styles.m_add_chef} onSubmit={handleProfileSave}>
            <div className={`row d-flex ${styles.m_add_input} ${styles.m_chef_details}`}>
              {/* First Name Input */}
              <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                <div className={`input-group ${styles.m_add_input_mar}`}>
                  <input
                    type="text"
                    className="form-control"
                    id="First_Name"
                    placeholder="First Name"
                    value={accountantData.firstName}
                    onChange={(e) => setAccountantData({ ...accountantData, firstName: e.target.value })} // Update firstName on change
                    required
                  />
                </div>
              </div>

              {/* Last Name Input */}
              <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                <div className={`input-group ${styles.m_add_input_mar}`}>
                  <input
                    type="text"
                    className="form-control"
                    id="Last_name"
                    placeholder="Last Name"
                    value={accountantData.lastName}
                    onChange={(e) => setAccountantData({ ...accountantData, lastName: e.target.value })} // Update lastName on change
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                <div className={`input-group ${styles.m_add_input_mar}`}>
                  <input
                    type="email"
                    className="form-control"
                    id="Email"
                    placeholder="Email"
                    value={accountantData.email}
                    onChange={(e) => setAccountantData({ ...accountantData, email: e.target.value })} // Update email on change
                    required
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                <div className={`input-group ${styles.m_add_input_mar}`}>
                  <input
                    type="tel"
                    className="form-control"
                    id="Phone"
                    maxLength="10"
                    placeholder="Phone"
                    value={accountantData.phone}
                    onChange={(e) => setAccountantData({ ...accountantData, phone: e.target.value })} // Update phone on change
                    required
                  />
                </div>
              </div>

              {/* Profession Select */}
              <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                <div className={`w-100 ${styles.m_add_input_mar}`}>
                  <select
                    className="form-control"
                    aria-label="Dish Category"
                    id="profession"
                    value={accountantData.profession}
                    onChange={(e) => setAccountantData({ ...accountantData, profession: e.target.value })} // Update profession on change
                    disabled
                  >
                    <option value="" disabled>{accountantData.profession}</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Waiter">Waiter</option>
                    <option value="Chef">Chef</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                <div className={`w-100 ${styles.m_add_input_mar}`}>
                  <input
                    className={`form-control ${styles.m_add_input_pad} ${styles.m_add_file}`}
                    id="image"
                    type="file"
                    onChange={handleImageChange} // Handle file change
                    style={{ display: "none", border: "1px solid #2e2e2e;" }} // Hide the default file input
                  />
                  <label htmlFor="image" className={`form-control ${styles.m_add_file} d-flex flex-wrap justify-content-between align-items-center`}>
                    <span>{imageName || accountantData.image || "No file chosen"}</span> {/* Display the selected image name or default from API */}
                    <span className={`${styles.d_choose_file}`}>CHOOSE</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className={styles.m_btn_clear_save}>
              <div className={styles.m_btn_save}>
                <button type="submit" className={`btn ${styles.btn_save}`}>
                  <i className="fa-regular fa-floppy-disk"></i> Save Change
                </button>
              </div>
            </div>
          </form>
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
      </div>
    </>
  );
}

export default AccountProfile;
