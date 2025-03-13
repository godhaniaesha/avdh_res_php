
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
       
        
        </div>
      </div>
    </>
  );
}

export default AccountProfile;
