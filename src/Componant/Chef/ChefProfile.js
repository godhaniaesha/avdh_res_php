import React, { useEffect, useState } from 'react';
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import ChefNavbar from './ChefNavbar';
import ChefSidePanel from './ChefSidePanel';
import styles from "../../css/ChefProfile.module.css";
import style from "../../css/BillPayment.module.css"; 
import { useNavigate } from 'react-router-dom';

function ChefProfile() {
  // State to hold chef data
  const [formData, setformData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    image: ""
  });

  const [userId, setuserId] = useState(null);
  const [imageName, setImageName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [changepasswordmodal, setChangepasswordmodal] = useState(false); // State for change password modal
  const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("userId"); // Get userId from local storage
    setuserId(id)
    console.log("userId", id);

    if (id) {
      // Fetch user data from the backend using the userId
      fetch(`http://localhost:8000/api/getUser/${id}`)
        .then(response => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then(data => {
          console.log("Fetched user data:", data);
          const userData = data.user;

          setformData({
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

  console.log("form data", formData)

  // Handle profile save
  const handleProfileSave = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData, // Spread operator to include all current chef data
      image: imageName, // Use the image name from the state
    };

    // If a new image is selected, update the image field with the new file name
    const imageInput = document.getElementById("image");
    if (imageInput.files.length > 0) {
      updatedData.image = imageInput.files[0].name; // Get the file name from input
    }

    // Send updated data to the updateuser API
    fetch(`http://localhost:8000/api/updateuser/${userId}`, { // Corrected fetch URL
      method: "PUT", // Use PUT method to update user data
      headers: {
        "Content-Type": "application/json", // Send data as JSON
      },
      body: JSON.stringify(updatedData), // Convert data to JSON string for request body
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok"); // Check for errors
        return response.json();
      })
      .then((data) => {
        console.log("Update successful:", data);
        alert("Data updated successfully!"); // Alert on success
      })
      .catch((error) => {
        console.error("Error updating data:", error);
        alert("Failed to update data. Please try again."); // Alert on error
      });
  };

  // Handle image change
  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImageName(e.target.files[0].name); // Set the image name in state
    }
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData(prevState => ({
      ...prevState,
      [name]: value, // Update specific form field value
    }));
  };
  const toggleNotifications = () => {
    const panel = document.getElementById("notification-panel");
    panel.style.display = panel.style.display === "none" || panel.style.display === "" ? "block" : "none";
  };
  const toggleDrawer = () => {
    setIsSidebarOpen(prev => !prev);
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
// ... existing code ...

  return (
    <section id="a_selectTable">
      <ChefNavbar toggleDrawer={toggleDrawer} showSearch={false} toggleNotifications={toggleNotifications}  />
      <ChefSidePanel isOpen={isSidebarOpen} isChefProfile={true} />

      {/* Main Content */}
      <div id={styles['a_main-content']}>
        <div className={`container-fluid ${styles.a_main_profile}`}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '30px' }}>Profile</div>
          </div>
          <form id={styles['chef-form']} onSubmit={handleProfileSave}>
            <div className={`row d-flex ${styles.m_add_input}`}>
              <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                <div className={`input-group ${styles.m_add_input_mar}`}>
                  <input
                    type="text"
                    className="form-control"
                    id="First_Name"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setformData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                <div className={`input-group ${styles.m_add_input_mar}`}>
                  <input
                    type="text"
                    className="form-control"
                    id="Last_name"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setformData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                <div className={`input-group ${styles.m_add_input_mar}`}>
                  <input
                    type="email"
                    className="form-control"
                    id="Email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setformData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                <div className={`input-group ${styles.m_add_input_mar}`}>
                  <input
                    type="tel"
                    className="form-control"
                    id="Phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setformData({ ...formData, phone: e.target.value })}
                    maxLength="10"
                    required
                  />
                </div>
              </div>
              <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                <div className={`w-100 ${styles.m_add_input_mar}`}>
                  <input className={`form-control ${styles.m_add_file} ${styles.m_add_input_pad}`} type="file" id="image" onChange={handleImageChange} style={{ display: "none", border: "1px solid #2e2e2e;" }} />
                  <label htmlFor="image"
                    className={`form-control ${styles.m_add_file} d-flex flex-wrap justify-content-between align-items-center`}>
                    <span>{imageName || formData.image || "No file chosen"}</span>
                    <span className={`btn btn-primary ${styles.d_choose_file}`}>CHOOSE </span>
                  </label>
                </div>
              </div>
            </div>
            <div className={styles.m_btn_clear_save}>
              <div className={styles.m_btn_save}>
                <button type="submit">Save Change</button>
              </div>
            </div>
          </form>
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
            stylee={{ border: "none", backgroundColor: "#f6f6f6" }}
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
    </section>
  );
}

export default ChefProfile;
