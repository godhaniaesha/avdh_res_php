import React, { useEffect, useState } from 'react';
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import ChefNavbar from './ChefNavbar';
import ChefSidePanel from './ChefSidePanel';
import styles from "../../css/AddVeriant.module.css";
import { useParams } from 'react-router-dom';
import style from "../../css/EditChef.module.css";
import styl from "../../css/BillPayment.module.css";
import { useNavigate } from 'react-router-dom';

function EditVeriant() {
  const [dishCategories, setDishCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [variantData, setVariantData] = useState({
    dishCategory: '',
    dishName: '',
    varName: '',
    price: '',
    variantImage: null,
  });
  const [imageName, setImageName] = useState('');
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changepasswordmodal, setChangepasswordmodal] = useState(false);
  const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");

  const populateCategoryOptions = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/allCategory");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const categories = await response.json();
      setDishCategories(categories.category);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
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
  const populateDishOptions = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/allDish?dishCategory=${categoryId}`);
      if (!response.ok) throw new Error("Failed to fetch dishes");
      const dishes = await response.json();
      setDishes(dishes.dish);
    } catch (error) {
      console.error('Error fetching dishes:', error.message);
    }
  };

  const getVariantDetails = async (variantId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/getVariant/${variantId}`);
      if (!response.ok) throw new Error('Failed to fetch variant details');
      const { variant } = await response.json();
      setVariantData({
        dishCategory: variant.dishName.dishCategory,
        dishName: variant.dishName._id,
        varName: variant.variantName,
        price: variant.price,
        variantImage: null,
      });
      setImageName(variant.variantImage || '');
      populateDishOptions(variant.dishName.dishCategory);
    } catch (error) {
      console.error('Error fetching variant details:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVariantData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageName(file.name);
      setVariantData(prevState => ({
        ...prevState,
        variantImage: file,
      }));
    }
  };
  const toggleDrawer = () => {
    setIsSidebarOpen(prev => !prev);
  };
  const toggleNotifications = () => {
    const panel = document.getElementById("notification-panel");
    panel.style.display = panel.style.display === "none" || panel.style.display === "" ? "block" : "none";
  };

  const editVariant = async (event) => {
    event.preventDefault();
    const { dishCategory, dishName, varName, price, variantImage } = variantData;

    if (!dishCategory || !dishName || !varName || !price) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('categoryName', dishCategory);
    formData.append('dishName', dishName);
    formData.append('variantName', varName);
    formData.append('price', price);
    if (variantImage) {
      formData.append('variantImage', variantImage); // Append the image file
    }

    try {
      const response = await fetch(`http://localhost:8000/api/updateVariant/${id}`, {
        method: 'PUT',
        body: formData, // Send FormData
      });

      if (!response.ok) throw new Error('Failed to update variant details');
      console.log('Variant details updated successfully!');
      window.location.href = "/chef_variant"; // Redirect to the variant list
    } catch (error) {
      console.error('Error updating variant details:', error.message);
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

  useEffect(() => {
    populateCategoryOptions();
    if (id) {
      getVariantDetails(id);
    }
  }, [id]);

  return (
    <div id="a_selectTable">
      <ChefNavbar toggleDrawer={toggleDrawer} showSearch={false} toggleNotifications={toggleNotifications} />
      <ChefSidePanel isOpen={isSidebarOpen} isChefVariant={true} />
      <div id={styles['a_main-content']}>
        <div className={`container-fluid ${styles.a_main}`}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '30px' }}>Edit Variant</div>
          </div>
          <form id={styles.editVariant} onSubmit={editVariant}>
            <div className={`row ${styles.v_row_adddish}`}>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <select className={`form-select ${styles['form-select']} ${styles['form-control']} ${styles.v_dishinput_pad}`} name="dishCategory" value={variantData.dishCategory} onChange={handleChange} required>
                  <option value="" disabled>Select Dish Category</option>
                  {Array.isArray(dishCategories) && dishCategories.map(category => (
                    <option key={category._id} value={category._id}>{category.categoryName}</option>
                  ))}
                </select>
              </div>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <select className={`form-select ${styles['form-select']} ${styles['form-control']} ${styles.v_dishinput_pad}`} name="dishName" value={variantData.dishName} onChange={handleChange} required>
                  <option value="" disabled>Select Dish Name</option>
                  {dishes?.map(dish => (
                    <option key={dish._id} value={dish._id}>{dish.dishName}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={`row ${styles.v_row_adddish}`}>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <input type="text" className={`${styles['form-control']} ${styles.v_dishinput_pad}`} placeholder="Variant Name" required aria-label="Variant Name" name="varName" value={variantData.varName} onChange={handleChange} />
              </div>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <input
                  type="text"
                  className={`${styles['form-control']} ${styles.v_dishinput_pad}`}
                  placeholder="Price"
                  aria-label="Price"
                  name="price"
                  value={variantData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className={`row ${styles.v_row_adddish}`}>
              <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                <div className={`w-100 ${style.m_add_input_mar}`} style={{ paddingRight: '35px' }}>
                  <input
                    className={`form-control ${style['form-control']} ${style.v_dishinput_pad}`}
                    id="image"
                    type="file"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="image"
                    className={`form-control ${style.m_add_file} ${style.v_dishinput_pad} d-flex flex-wrap flex-wrap justify-content-between align-items-center`}>
                    <span>{imageName || "No file chosen"}</span>
                    <span className={`btn btn-primary ${style.d_choose_file}`}>CHOOSE</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center" style={{ marginTop: '100px' }}>
              <button type="button" className={`btn border-secondary border me-3 ${styles.v_btn_size}`} style={{ color: '#B5B5B5' }} onClick={() => setVariantData({ ...variantData, varName: '', price: '', variantImage: null })}>
                <FontAwesomeIcon icon={faEraser} style={{ marginRight: '10px' }} />Clear
              </button>
              <button type="submit" className={`btn btn-primary border-secondary border mx-3 ${styles.v_btn_size}`} style={{ color: 'white', backgroundColor: '#4B6C52' }}>
                <FontAwesomeIcon icon={faFloppyDisk} style={{ marginRight: '10px' }} />Save
              </button>
            </div>
          </form>
        </div>
      </div>
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

export default EditVeriant;