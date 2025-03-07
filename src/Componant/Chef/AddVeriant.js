import React, { useEffect, useState } from 'react';
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import ChefNavbar from './ChefNavbar';
import ChefSidePanel from './ChefSidePanel';
import styles from "../../css/AddVeriant.module.css";
import style from "../../css/BillPayment.module.css"; 
import { useNavigate } from 'react-router-dom';

function AddVeriant(props) {
  const [dishCategories, setDishCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [variantData, setVariantData] = useState({
    dishCategory: '',
    dishName: '',
    varName: '',
    price: '',
    imageFile: null, // Use null initially for file input
  });
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changepasswordmodal, setChangepasswordmodal] = useState(false);
  const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/allCategory');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setDishCategories(data.category);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories. Please try again.');
    }
  };

  // Fetch dishes based on selected category
  const fetchDishNames = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/allDish?dishCategory=${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch dishes');
      const data = await response.json();
      if (data && Array.isArray(data.dish)) {
        setDishes(data.dish.filter(dish => dish.dishCategory === categoryId));
      } else {
        console.error('Fetched dishes data is not an array:', data);
        setDishes([]);
      }
    } catch (error) {
      console.error('Error fetching dishes:', error);
      alert('Failed to fetch dishes. Please try again.');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVariantData({ ...variantData, [name]: value });
    if (name === 'dishCategory') {
      fetchDishNames(value);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setVariantData({ ...variantData, imageFile: e.target.files[0] });
  };

  // Function to add a new variant
  const addVariant = async (event) => {
    event.preventDefault();
    const { dishCategory, dishName, varName, price, imageFile } = variantData;

    // Validate input fields
    if (!dishCategory || !dishName || !varName || !price || !imageFile) {
      alert('Please fill out all fields.');
      return;
    }

    const formData = new FormData();
    // Append data to FormData object with keys matching API expectations
    formData.append('categoryName', dishCategory); // Use 'categoryName' as per your API's structure
    formData.append('dishName', dishName);
    formData.append('variantName', varName);
    formData.append('price', price);
    formData.append('variantImage', imageFile); // Append the image file

    try {
      const response = await fetch('http://localhost:8000/api/createVariant', {
        method: 'POST',
        body: formData, // Sending FormData
      });
      if (!response.ok) throw new Error('Failed to add variant');
      setShowModal(true); // Show success modal
      // Reset variant data after successful addition
      setVariantData({ dishCategory: '', dishName: '', varName: '', price: '', imageFile: null });
    } catch (error) {
      console.error('Error adding variant:', error);
      alert('Failed to add variant. Please try again.'); // Notify user
    }
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

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleNotifications = () => {
    const panel = document.getElementById("notification-panel");
    panel.style.display = panel.style.display === "none" || panel.style.display === "" ? "block" : "none";
  };
  const toggleDrawer = () => {
    setIsSidebarOpen(prev => !prev);
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
    <div id={styles['a_selectTable']}>
      <ChefNavbar toggleDrawer={toggleDrawer} toggleNotifications={toggleNotifications} showSearch={false} />
      <ChefSidePanel isOpen={isSidebarOpen}/>
      <div id={styles['a_main-content']}>
        <div className={`container-fluid ${styles.a_main}`}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '30px' }}>Add Variant</div>
          </div>
          <form id="addvariant" onSubmit={addVariant}>
            <div className={`row ${styles.v_row_adddish}`}>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                {/* Dish Category Select */}
                <select
                  className={`form-select form-control ${styles['form-control']} ${styles.v_dishinput_pad}`}
                  name="dishCategory"
                  id="Dish_category"
                  value={variantData.dishCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Dish Category</option>
                  {Array.isArray(dishCategories) && dishCategories.length > 0 ? (
                    dishCategories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.categoryName}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No categories available</option>
                  )}
                </select>
              </div>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                {/* Dish Name Select */}
                <select
                  className={`form-select form-control ${styles['form-control']} ${styles.v_dishinput_pad}`}
                  name="dishName"
                  id="Dish_name"
                  value={variantData.dishName}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Dish Name</option>
                  {Array.isArray(dishes) && dishes.length > 0 ? (
                    dishes.map(dish => (
                      <option key={dish._id} value={dish._id}>{dish.dishName}</option>
                    ))
                  ) : (
                    <option value="" disabled>No dishes available</option>
                  )}
                </select>
              </div>
            </div>
            <div className={`row ${styles.v_row_adddish}`}>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <input
                  type="text"
                  className={`form-control ${styles['form-control']} ${styles.v_dishinput_pad}`}
                  placeholder="Variant Name"
                  required
                  name="varName"
                  value={variantData.varName}
                  onChange={handleChange}
                />
              </div>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <input
                  type="number" // Changed to number for price input
                  className={`form-control ${styles['form-control']} ${styles.v_dishinput_pad}`}
                  placeholder="Price"
                  required
                  name="price"
                  value={variantData.price}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={`row ${styles.v_row_adddish}`}>
              <div className="col-xs-12 col-md-6" style={{ flexDirection: 'column', padding: 0 }}>
                <input
                  className={`form-control ${styles['form-control']} ${styles.v_dishinput_pad}`}
                  placeholder="Image"
                  type="file"
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '100px' }}>
              <button
                type="button"
                className={`btn border-secondary border me-3 ${styles.v_btn_size}`}
                style={{ color: '#B5B5B5' }}
                onClick={() => setVariantData({ ...variantData, varName: '', price: '', imageFile: null })} // Clear form fields
              >
                <FontAwesomeIcon icon={faEraser} style={{ marginRight: '10px' }} />Clear
              </button>
              <button
                type="submit"
                className={`btn btn-primary border-secondary border mx-3 ${styles.v_btn_size}`}
                style={{ color: 'white', backgroundColor: '#4B6C52' }}
              >
                <FontAwesomeIcon icon={faFloppyDisk} style={{ marginRight: '10px' }} />Save
              </button>
            </div>
          </form>
          {showModal && (
            <div className={`modal fade ${styles.v_adddish_modal} show`} style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className={`modal-content ${styles.v_adddish_modal}`} style={{ border: 'none', backgroundColor: '#f6f6f6' }}>
                  <div className="modal-body" style={{ height: '250px' }}>
                    <div className="text-center" style={{ marginTop: '25px' }}>
                      <div style={{ fontSize: '32px', fontWeight: 700, marginBottom: '30px' }}>Added Successfully!</div>
                      <div><img src="./Image/right.png" alt="" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
    </div>
  );
}

export default AddVeriant;
