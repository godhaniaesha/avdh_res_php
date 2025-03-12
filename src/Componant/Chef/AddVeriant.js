import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal } from 'bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import ChefNavbar from './ChefNavbar';
import ChefSidePanel from './ChefSidePanel';
import styles from "../../css/AddVeriant.module.css";
import style from "../../css/BillPayment.module.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const response = await fetch('http://localhost/avadh_api/chef/category/view_category.php', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to fetch categories');

      const data = await response.json();
      setDishCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories. Please try again.');
    }
  };
  ;

  // Fetch dishes based on selected category
  const fetchDishNames = async (categoryId) => {
    try {

      const formData = new FormData();
      formData.append('dish_id', categoryId);
      const response = await fetch(`http://localhost/avadh_api/chef/dish/view_dish.php`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to fetch dishes');

      const data = await response.json();

      if (data) {
        setDishes(data.data.filter(dish => dish.dishCategory == categoryId));
        console.log(dishes)
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

    if (!dishCategory || !dishName || !varName || !price || !imageFile) {
      alert('Please fill out all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('categoryName', dishCategory);
    formData.append('dishName', dishName);
    formData.append('variantName', varName);
    formData.append('price', price);
    formData.append('variantImage', imageFile);

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("No authentication token found");
      return;
    }

    try {
      const response = await axios.post(`http://localhost/avadh_api/chef/variant/add_variant.php`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status == 200) {
        // Show success modal
        const modalElement = document.getElementById('imgModal');
        if (modalElement) {
            const successModal = new Modal(modalElement);
            successModal.show();
            setTimeout(() => {
                successModal.hide();
                navigate('/chef_variant');
            }, 2000);
        }
    } else {
        alert(response.data.message || 'Failed to add table');
    }
      // setShowModal(true);
      setVariantData({ dishCategory: '', dishName: '', varName: '', price: '', imageFile: null });

    } catch (error) {
      console.error('Error adding variant:', error);
      alert('Failed to add variant. Please try again.');
    }
  };


  // ... existing code ...

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

  return (
    <div id={styles['a_selectTable']}>
      <ChefNavbar toggleDrawer={toggleDrawer} toggleNotifications={toggleNotifications} showSearch={false} />
      <ChefSidePanel isOpen={isSidebarOpen} />
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
                      <option key={category.id} value={category.id}>
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
                      <option key={dish.id} value={dish.id}>{dish.dishName}</option>
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
          {/* {/ Success Modal /} */}
          <div
            className="modal fade"
            id="imgModal"
            tabIndex="-1"
            aria-labelledby="successModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ border: 'none', backgroundColor: '#f6f6f6', padding: '20px' }}>
                <div className="modal-body text-center">
                  <h4 style={{
                    fontSize: '24px',
                    fontWeight: '500',
                    marginBottom: '20px'
                  }}>
                    Add Successfully!
                  </h4>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#4B6C52',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="fas fa-check" style={{
                      color: 'white',
                      fontSize: '30px'
                    }}></i>
                    <img src="../../Image/right.png" alt="" />
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
