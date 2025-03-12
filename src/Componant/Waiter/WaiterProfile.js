import React, { useEffect, useState } from "react";
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import "bootstrap/dist/css/bootstrap.min.css";
import $ from "jquery";
import WaiterNavbar from "./WaiterNavbar";
import WaiterSidePanel from "./WaiterSidePanel";
import styles from "../../css/WaiterProfile.module.css";
import { useNavigate } from "react-router-dom";
import styl from "../../css/BillPayment.module.css";
import axios from "axios";


const WaiterProfile = () => {
  const [waiterData, setWaiterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profession: "",
    image: "",
  });
  const [waiterName, setWaiterName] = useState('');
  const [waiterId, setWaiterId] = useState(null); // New state for waiter ID
  const [imageName, setImageName] = useState(""); // New state for image name
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [changepasswordmodal, setChangepasswordmodal] = useState(false);
  var token;
  useEffect(() => {
    const storedWaiterData = localStorage.getItem("waiterData");
    token = localStorage.getItem('authToken');
    // if (storedWaiterData) {
    //   setWaiterData(JSON.parse(storedWaiterData)); // Set state with data from local storage
    // } else {
    //   const id = localStorage.getItem("loginWaiterId"); // Get waiter ID from local storage
    //   const response =  axios.post(
    //     "http://localhost/avadh_api/waiter/profile/change_profile.php",
    //     {},
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "multipart/form-data", // Important for file uploads
    //       },
    //     }
    //   );
    //   // console.log("profile", response?.data?.user?.firstName);
    //   // fetch("http://localhost/avadh_api/waiter/profile/change_password.php")
    //     // .then((response) => response.json())
    //     // .then((data) => {
    //       console.log('responsive', response)
    //       const matchingWaiter = response?.find(waiter => waiter.id === id); // Find waiter by ID
    //       // if (matchingWaiter) {
    //         setWaiterData(matchingWaiter); // Populate form with waiter data
    //         setWaiterName(matchingWaiter.firstName); // Set waiter name
    //         setImageName(matchingWaiter.image); // Set the image name from API
    //       // }
    //     // })
    // .catch((error) => console.error("Error:", error));
    getUserData()
    // }
  }, []);
  const getUserData = async () => {
    const response = await axios.post(
      "http://localhost/avadh_api/waiter/profile/change_profile.php",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      }
    );
    console.log("profile", response.data.user);
    setWaiterData(response.data.user); // Populate form with waiter data
    setWaiterName(response.data.user.firstName); // Set waiter name
    setImageName(response.data.user.image);
  }
  const handleProfileSave =async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", document.getElementById("First_Name").value);
    formData.append("lastName", document.getElementById("Last_name").value);
    formData.append("email", document.getElementById("Email").value);
    formData.append("phone", document.getElementById("Phone").value);
    formData.append("image", imageName || waiterData.image); // Retain existing image if no new image is selected

    const imageInput = document.getElementById("image");
    if (imageInput.files.length > 0) {
      formData.set("image", imageInput.files[0]); // Replace image if new image selected
    }

    // Append other waiterData properties if needed
    Object.keys(waiterData).forEach((key) => {
      if (!formData.has(key) && key !== "image") {
        formData.append(key, waiterData[key]);
      }
    });

    // Store waiter data in local storage
    localStorage.setItem("waiterData", JSON.stringify(formData)); // Store updated waiter data

    // const userId = localStorage.getItem("userId"); // Get user ID from local storage
    token = localStorage.getItem('authToken');
    try {
      await axios.post(`http://localhost/avadh_api/waiter/profile/change_profile.php`, formData, {
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
      });

      // localStorage.setItem('bookTable', JSON.stringify(data));
      // localStorage.setItem("tableId", data.id);
      // navigate('/waiter_menu');
      getUserData()
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
  }
    // fetch(`http://localhost:8000/api/updateuser/${userId}`, { // Use the specified API endpoint
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(updatedData),
    // })
    //   .then((response) => {
    //     if (!response.ok) throw new Error("Network response was not ok");
    //     alert("Data updated successfully!");
    //   })
    //   .catch((error) => {
    //     console.error("Error updating data:", error);
    //     alert("Failed to update data. Please try again.");
    //   });
  };

  
  const toggleDrawer = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const toggleNotifications = () => {
    const panel = document.getElementById("notification-panel");
    panel.style.display = panel.style.display === "none" || panel.style.display === "" ? "block" : "none";
  };

  // Add this function to handle file input change
  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImageName(e.target.files[0].name); // Set the image name in state
    }
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
  return (
    <section id={styles.a_selectTable}>
      <WaiterNavbar toggleDrawer={toggleDrawer} showSearch={false} toggleNotifications={toggleNotifications} waiterName={waiterName} />
      <WaiterSidePanel isOpen={isSidebarOpen} iswaiterprofile={true} />

      <div id={styles['a_main-content']}>
        <div className={`container-fluid ${styles.a_main}`}>
          <div className={styles.m_add}>
            <span>Profile</span>
          </div>
        </div>

        <form id={styles[`waiter-form`]} onSubmit={handleProfileSave}>
          <div className={`row d-flex ${styles.m_add_input}`}>
            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
              <div className={`input-group ${styles.m_add_input_mar}`}>
                <input
                  type="text"
                  className="form-control"
                  id="First_Name"
                  placeholder="First Name"
                  aria-label="First Name"
                  value={waiterData.firstName}
                  onChange={(e) => setWaiterData({ ...waiterData, firstName: e.target.value })}
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
                  aria-label="Last Name"
                  value={waiterData.lastName}
                  onChange={(e) => setWaiterData({ ...waiterData, lastName: e.target.value })}
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
                  aria-label="Email"
                  value={waiterData.email}
                  onChange={(e) => setWaiterData({ ...waiterData, email: e.target.value })}
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
                  maxLength="10"
                  aria-label="Phone"
                  value={waiterData.phone}
                  onChange={(e) => setWaiterData({ ...waiterData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
              <div className={`w-100 ${styles.m_add_input_mar}`}>
                <select
                  className={`form-control ${styles.m_add_file}`}
                  name="profession"
                  id="profession"
                  value={waiterData.role}
                  onChange={(e) => setWaiterData({ ...waiterData, profession: e.target.value })}
                  disabled
                >
                  <option value="" disabled>Profession</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Waiter">Waiter</option>
                  <option value="Chef">Chef</option>
                  <option value="Other">Other</option>
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
              <button type="submit">Save Change</button>
            </div>
          </div>
        </form>
        {/* Change Password Modal */}
        

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
      </div>
    </section>
  );
};

export default WaiterProfile;