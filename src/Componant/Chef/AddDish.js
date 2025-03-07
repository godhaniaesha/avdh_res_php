import React, { useEffect, useState } from "react";
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import ChefNavbar from "./ChefNavbar";
import ChefSidePanel from "./ChefSidePanel";
import styles from "../../css/AddDish.module.css";
import style from "../../css/BillPayment.module.css";
import axios from "axios"; // Import axios
import { useNavigate } from 'react-router-dom'; // Ensure this is imported for navigation

function AddDish(props) {
  const [categories, setCategories] = useState([]);
  const [dishName, setDishName] = useState("");
  const [dishCategory, setDishCategory] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [status, setStatus] = useState("");
  const [dishImage, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [changepasswordmodal, setChangepasswordmodal] = useState(false); // State for change password modal
  const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState(""); // Initialize navigate

  // Fetch categories from the API using axios
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/allCategory"); // Using axios to get categories
      // Check if the response contains the expected data
      if (Array.isArray(response.data.category)) {
        setCategories(response.data.category); // Set categories state
      } else {
        console.error("Fetched data is not an array:", response.data);
        alert("Failed to fetch categories. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Failed to fetch categories. Please try again.");
    }
  };

  // Function to handle adding a dish
  const handleAddDish = async (event) => {
    event.preventDefault(); // Prevent form from refreshing the page

    try {
      // Validate that all required fields are filled
      if (!dishName || !dishCategory || !sellingPrice || !costPrice || !status || !dishImage || !description) {
        throw new Error("Please fill out all fields"); // Throw error if any field is missing
      }

      // Prepare form data using FormData to handle the file upload
      const formData = new FormData();
      formData.append("dishName", dishName); // Append dish name
      formData.append("dishCategory", dishCategory); // Append dish category ID
      formData.append("sellingPrice", sellingPrice); // Append selling price
      formData.append("costPrice", costPrice); // Append cost price
      formData.append("status", status); // Append dish status
      formData.append("description", description); // Append description
      formData.append("dishImage", dishImage); // Append the image file

      // Retrieve the token from localStorage
      const token = localStorage.getItem("authToken");
      console.log("Retrieved token:", token); // Log the token for verification
      if (!token) throw new Error("No authentication token found"); // Throw error if token is missing

      // Send the POST request with the Authorization header
      const response = await axios.post("http://localhost:8000/api/createDish", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token for authorization
        },
      });

      // Handle the response
      console.log("Dish added successfully!");
      clearForm(); // Reset the form fields after submission
      alert("Dish added successfully!");
    } catch (error) {
      console.error("Error adding dish:", error.message);
      alert(error.message); // Display the error to the user
    }
  };

  // Function to clear form inputs
  const clearForm = () => {
    setDishName("");
    setDishCategory("");
    setSellingPrice("");
    setCostPrice("");
    setStatus("");
    setImage(null);
    setDescription("");
  };

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories(); // Call fetchCategories to load categories
  }, []);

  const toggleDrawer = () => {
    setIsSidebarOpen(prev => !prev);
  };
  const toggleNotifications = () => {
    const panel = document.getElementById("notification-panel");
    panel.style.display = panel.style.display === "none" || panel.style.display === "" ? "block" : "none";
  };

  // Function to handle password change
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
      <ChefNavbar toggleDrawer={toggleDrawer} toggleNotifications={toggleNotifications} showSearch={false} />
      <ChefSidePanel isOpen={isSidebarOpen} isChefMenu={true}></ChefSidePanel>
      <div id={styles["a_main-content"]}>
        <div className={`container-fluid ${styles.a_main}`}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "30px" }}>Add Dish</div>
          </div>
          <form id={styles.addDish} onSubmit={handleAddDish}>
            <div className={`row ${styles.v_row_adddish}`}>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <input
                  type="text"
                  className={`form-control ${styles["form-control"]} ${styles.v_dishinput_pad}`}
                  placeholder="Dish Name"
                  required
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                />
              </div>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <select
                  className={`form-control ${styles["form-control"]} ${styles.v_dishinput_pad}`}
                  required
                  value={dishCategory}
                  onChange={(e) => setDishCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Select Dish Category
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={`row ${styles.v_row_adddish}`}>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <input
                  type="text"
                  className={`form-control ${styles["form-control"]} ${styles.v_dishinput_pad}`}
                  placeholder="Selling Price"
                  required
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                />
              </div>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <input
                  type="text"
                  className={`form-control ${styles["form-control"]} ${styles.v_dishinput_pad}`}
                  placeholder="Cost Price"
                  required
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                />
              </div>
            </div>
            <div className={`row ${styles.v_row_adddish}`}>
              <div className="col-xs-12 col-md-6 d-flex justify-content-between" style={{ flexDirection: "column", padding: 0 }}>
                <select
                  className={`form-control ${styles["form-control"]} ${styles.v_dishinput_pad}`}
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="" disabled>
                    Status
                  </option>
                  <option value="available">Available</option>
                  <option value="notavailable">Not Available</option>
                </select>
                <div>
                  <input
                    className={`form-control ${styles["form-control"]} ${styles.v_dishinput_pad}`}
                    type="file"
                    required
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <textarea
                  className={`form-control ${styles["form-control"]} ${styles.v_dishinput_pad}`}
                  placeholder="Description"
                  cols="60"
                  rows="4"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center" style={{ marginTop: "100px" }}>
              <button
                type="button"
                className={`btn border-secondary border me-3  ${styles.v_btn_size}`}
                style={{ color: "#B5B5B5" }}
                onClick={clearForm}
              >
                <FontAwesomeIcon icon={faEraser} style={{ marginRight: "10px" }} />
                Clear
              </button>
              <button
                type="submit"
                className={`btn btn-primary border-secondary border mx-3  ${styles.v_btn_size}`}
                style={{ color: "white", backgroundColor: "#4B6C52" }}
              >
                <FontAwesomeIcon icon={faFloppyDisk} style={{ marginRight: "10px" }} />
                Save
              </button>
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
      {/* Logout Modal */}
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
    </div>
  );
}

export default AddDish;
