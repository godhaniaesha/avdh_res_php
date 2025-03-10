import React, { useEffect, useState } from "react";
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import ChefNavbar from "./ChefNavbar";
import ChefSidePanel from "./ChefSidePanel";
import styles from "../../css/EditDish.module.css";
import styless from "../../css/EditChef.module.css";
import style from "../../css/BillPayment.module.css";
import axios from "axios"; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function EditDish() {


  const [imageFile, setImageFile] = useState(null);
  const [dishData, setDishData] = useState({
    dishId: "",
    dishName: "",
    dishCategory: "",
    sellingPrice: "",
    costPrice: "",
    status: "",
    description: "",
    image: null,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changepasswordmodal, setChangepasswordmodal] = useState(false);
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");

  // Fetching dish data from localStorage on component mount
  const dishId = localStorage.getItem("dishId"); // Get the dish ID from local storage
  useEffect(() => {
    console.log(dishId, "dishId");

    const formData = new FormData();
    formData.append("dish_id", dishId);

    if (dishId) {
      // Fetch the dish data using the dish ID
      axios.post(`http://localhost/avadh_api/chef/dish/view_dish.php`, formData) // Adjust the endpoint as necessary
        .then((response) => {
          console.log(response, "response");
          if (response.status === 200) {
            const parsedDishData = response.data.data; // Assuming the response contains the dish data
            setDishData({
              dishId: parsedDishData.id,
              dishName: parsedDishData.dishName,
              dishCategory: parsedDishData.dishCategory,
              sellingPrice: parsedDishData.sellingPrice,
              costPrice: parsedDishData.costPrice,
              status: parsedDishData.status,
              description: parsedDishData.description,
              image: parsedDishData.dishImage,
            });
            setImageFile(parsedDishData.dishImage);
            
          }
          console.log("imageFile", imageFile);
        })
        .catch((error) => console.error("Error fetching dish data:", error));
    } else {
      console.error("Dish ID not found in local storage");
    }
  }, []);

  // Handle input changes and file selection
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setDishData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
    if (files) {
      setImageFile(files[0]);
      console.log("---", files[0].name);
    }
  };

  // Update dish details on form submission
  const updateDishDetails = async (event) => {
    event.preventDefault();
    const { dishId } = dishData;

    if (!dishId) {
      console.error("Dish ID not found");
      return;
    }

    // Create a FormData object to send the form data
    const formData = new FormData();
    formData.append("dishId", dishId);
    formData.append("dishName", dishData.dishName);
    formData.append("dishCategory", dishData.dishCategory);
    formData.append("sellingPrice", dishData.sellingPrice);
    formData.append("costPrice", dishData.costPrice);
    formData.append("status", dishData.status);
    formData.append("description", dishData.description);

    // Append image file if it exists
    if (imageFile) {
      formData.append("image", imageFile);
      console.log(imageFile);
    }

    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem('authToken'); // Ensure this is the correct key

      // Update the API endpoint to use updateVariant
      const response = await axios.post(`http://localhost/avadh_api/chef/dish/update_dish.php`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type for form data
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status !== 200) throw new Error("Failed to update dish details");
      console.log("Dish details updated successfully!");
      navigate('/chef_menu')
      // Optionally redirect after success
      // window.location.href = "/chef_menu";
    } catch (error) {
      console.error("Error updating dish details:", error.message);
    }
  };

  // Clear form fields
  const clearForm = () => {
    setDishData({
      dishId: "",
      dishName: "",
      dishCategory: "",
      sellingPrice: "",
      costPrice: "",
      status: "",
      description: "",
      image: null,
    });
    setImageFile(null);
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
      <ChefNavbar toggleDrawer={toggleDrawer} showSearch={false} toggleNotifications={toggleNotifications} />
      <ChefSidePanel isOpen={isSidebarOpen} isChefMenu={true} />

      <div id={styles["a_main-content"]}>
        <div className={`container-fluid ${styles.a_main}`}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "30px" }}>Edit Dish</div>
          </div>
          <form id={styles.editDishForm} onSubmit={updateDishDetails}>
            <div className={`row ${styles.v_row_adddish}`}>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <input
                  type="text"
                  className={`form-control ${styles["form-control"]} ${styles.v_dishinput_pad}`}
                  placeholder="Dish Name"
                  name="dishName"
                  value={dishData.dishName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <select
                  className={`form-control ${styles["form-control"]} ${styles.v_dishinput_pad}`}
                  name="dishCategory"
                  value={dishData.dishCategory}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select Dish Category</option>
                  <option value="Biryani">Biryani</option>
                  <option value="SouthIndian">South Indian</option>
                  {/* Additional options can be added here */}
                </select>
              </div>
            </div>
            <div className={`row ${styles.v_row_adddish}`}>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <input
                  type="text"
                  className={`form-control ${styles["form-control"]} ${styles.v_dishinput_pad}`}
                  placeholder="Selling Price"
                  name="sellingPrice"
                  value={dishData.sellingPrice}
                  onChange={handleChange}
                />
              </div>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <input
                  type="text"
                  className={`form-control ${styles["form-control"]} ${styles.v_dishinput_pad}`}
                  placeholder="Cost Price"
                  name="costPrice"
                  value={dishData.costPrice}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={`row ${styles.v_row_adddish}`}>
              <div className="col d-flex justify-content-between" style={{ flexDirection: "column", padding: 0 }}>
                <select
                  className={`form-control ${styles["form-control"]} ${styles.v_dishinput_pad}`}
                  name="status"
                  value={dishData.status}
                  onChange={handleChange}
                >
                  <option value="" disabled>Status</option>
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
                <div>
                  <div className={`w-100 ${styless.m_add_input_mar}`} style={{ paddingRight: '36px' }}>
                    <input
                      className={`form-control ${styless['form-control']} ${styless.v_dishinput_pad}`}
                      id="image"
                      type="file"
                      onChange={handleChange}
                      style={{ display: "none", border: "1px solid #2e2e2e;" }}
                    />
                    <label htmlFor="image"
                      className={`form-control ${styless.m_add_file} ${styless.v_dishinput_pad} d-flex flex-wrap justify-content-between align-items-center`}>
                      <span>{imageFile?.name ? imageFile.name : imageFile}</span>

                      <span className={`btn btn-primary ${styless.d_choose_file}`}>CHOOSE</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <textarea
                  className={`form-control ${styles["form-control"]} ${styles.v_dishinput_pad}`}
                  placeholder="Description"
                  name="description"
                  value={dishData.description}
                  onChange={handleChange}
                  rows="4"
                ></textarea>
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
      </div>
    </div>
  );
}

export default EditDish;
