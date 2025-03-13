import React, { useEffect, useState } from "react";
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal } from 'bootstrap';
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dishName, setDishName] = useState("");
  const [dishCategory, setDishCategory] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [status, setStatus] = useState("");
  const [dishImage, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch categories from the API using axios
  const fetchCategories = async () => {
    try {
      const response = await axios.post("http://localhost/avadh_api/chef/category/view_category.php"); // Using axios to get categories
      // Check if the response contains the expected data
      console.log("Fetched data is not an array:", response.data.categories);
      setCategories(response.data.categories)

      // if (Array.isArray(response.data.categcategoriesory)) {
      //   setCategories(response.data.categories); // Set categories state
      //   console.log(categories)
      // } else {
      //   console.log("Fetched data is not an array:", response.data.categories);
      //   // alert("Failed to fetch categories. Please try again.");
      // }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // alert("Failed to fetch categories. Please try again.");
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
      formData.append("dishCategory", dishCategory);
      console.log(dishCategory)// Append dish category ID
      formData.append("sellingPrice", sellingPrice); // Append selling price
      formData.append("costPrice", costPrice); // Append cost price
      formData.append("status", status); // Append dish status
      formData.append("description", description); // Append description
      formData.append("image", dishImage); // Append the image file

      // Retrieve the token from localStorage
      const token = localStorage.getItem("authToken");
      console.log("Retrieved token:", token); // Log the token for verification
      if (!token) throw new Error("No authentication token found"); // Throw error if token is missing

      // Send the POST request with the Authorization header
      const response = await axios.post("http://localhost/avadh_api/chef/dish/add_dish.php", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Bearer token for authorization
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle the response
      console.log("Dish added successfully!");
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
      setShowSuccessModal(true);
      clearForm(); // Reset the form fields after submission
      // alert("Dish added successfully!");
    } catch (error) {
      console.error("Error adding dish:", error.message);
      // alert(error.message); // Display the error to the user
    }
  };

  // Function to clear form inputs
  const clearForm = () => {
    setDishName("");
    setDishCategory("");
    setSellingPrice("");
    setCostPrice("");
    setStatus("");
    setImage("");
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
                    <option key={category._id} value={category.id}>
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
      
   

      {/* Add Successfully Modal */}
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



  );
}

export default AddDish;
