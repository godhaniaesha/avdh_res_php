import React, { useEffect, useState } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import ChefNavbar from './ChefNavbar';
import ChefSidePanel from './ChefSidePanel';
import styles from "../../css/ChefProfile.module.css";
import style from "../../css/BillPayment.module.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ChefProfile() {
  // State to hold chef data
  const [formData, setFormdata] = useState({
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

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const id = localStorage.getItem("userId"); // Get userId from local storage
    setuserId(id)
    console.log("userId", id);

    if (id) {
      // Fetch user data from the backend using the userId
      axios.post(`http://localhost/avadh_api/chef/profile/change_profile.php`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          const userData = response.data.user

          console.log(userData)
          setFormdata({
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


  // Handle profile save
  const handleProfileSave = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("firstName", document.getElementById("First_Name").value);
    formData.append("lastName", document.getElementById("Last_name").value);
    formData.append("email", document.getElementById("Email").value);
    formData.append("phone", document.getElementById("Phone").value);
    formData.append("image", imageName || formData.image); 
    // const updatedData = {
    //   ...formData, // Include all current chef data
    //   image: imageName, // Use the image name from the state
    // };
  
    // If a new image is selected, update the image field with the new file name
    const imageInput = document.getElementById("image");
    if (imageInput.files.length > 0) {
      formData.set("image", imageInput.files[0]); // Get the file name from input
    }
  
    try {
      const response = await axios.post(
        "http://localhost/avadh_api/chef/profile/change_profile.php", formData , {// No need to wrap it inside another object
          headers: {
            Authorization: `Bearer ${token}`, // Ensure `token` is defined
            "Content-Type": "multipart/form-data"
          },
        }
      );
  
      console.log("Update successful:", response.data);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Failed to update data. Please try again.");
    }
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
      setFormdata(prevState => ({
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

    // ... existing code ...

    return (
      <section id="a_selectTable">
        <ChefNavbar toggleDrawer={toggleDrawer} showSearch={false} toggleNotifications={toggleNotifications} />
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
                      onChange={(e) => setFormdata({ ...formData, firstName: e.target.value })}
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
                      onChange={(e) => setFormdata({ ...formData, lastName: e.target.value })}
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
                      onChange={(e) => setFormdata({ ...formData, email: e.target.value })}
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
                      onChange={(e) => setFormdata({ ...formData, phone: e.target.value })}
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
