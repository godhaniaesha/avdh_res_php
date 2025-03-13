import React, { useEffect, useState } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

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
import axios from 'axios';

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
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  const populateCategoryOptions = async () => {
    try {
      const response = await axios.post("http://localhost/avadh_api/chef/category/view_category.php");
      setDishCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const populateDishOptions = async (categoryId) => {
    try {
      const response = await axios.post(`http://localhost/avadh_api/chef/dish/view_dish.php`);
      const dishes = response.data.data

      setDishes(dishes.filter(dish => dish.dishCategory == categoryId));
    } catch (error) {
      console.error('Error fetching dishes:', error.message);
    }
  };

  const getVariantDetails = async (variantId) => {
    const formData = new FormData();
    formData.append("var_id", variantId);

    try {
      const response = await axios.post(`http://localhost/avadh_api/chef/variant/view_variant.php`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const variant = response.data.variants;
      console.log(variant)
      setVariantData({
        categoryName: variant.category.categoryName,
        dishName: variant.dish.dishName,
        variantName: variant.variantName,
        price: variant.price,
        variantImage: null,
      });
      setImageName(variant.variantImage || '');
      populateDishOptions(variant.category.id);
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
    const { categoryName, dishName, variantName, price, variantImage } = variantData;

    if (!categoryName || !dishName || !variantName || !price) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('var_id', id);
    formData.append('categoryName', categoryName);
    formData.append('dishName', dishName);
    formData.append('variantName', variantName);
    formData.append('price', price);
    if (variantImage) {
      formData.append('variantImage', variantImage); // Append the image file
    }

    try {
      const response = await axios.post(`http://localhost/avadh_api/chef/variant/update_variant.php`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Variant details updated successfully!');
      navigate('/chef_variant')
      // window.location.href = "/chef_variant"; // Redirect to the variant list
    } catch (error) {
      console.error('Error updating variant details:', error.message);
    }
  };

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
                <select className={`form-select ${styles['form-select']} ${styles['form-control']} ${styles.v_dishinput_pad}`} name="dishCategory" value={variantData.categoryName} onChange={handleChange} required>
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
                <input type="text" className={`${styles['form-control']} ${styles.v_dishinput_pad}`} placeholder="Variant Name" required aria-label="Variant Name" name="varName" value={variantData.variantName} onChange={handleChange} />
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
    </div>
  );
}

export default EditVeriant;