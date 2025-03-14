import React, { useEffect, useState } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Modal } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import ChefNavbar from './ChefNavbar';
import ChefSidePanel from './ChefSidePanel';
import styles from "../../css/AddCategory.module.css";
import style from "../../css/BillPayment.module.css"; // Import the CSS module
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddCategory(props) {
    const [catName, setCatName] = useState(''); // State to hold category name input
    const [image, setImage] = useState(null);   // State to hold image file
    const [chefName, setChefName] = useState(''); // State to hold logged-in chef's name
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    
    const addCategory = async (event) => {
        event.preventDefault(); // Prevent form submission

        try {
            // Validate input fields
            if (catName.trim() === "" || !image) {
                throw new Error("Please fill out all fields.");
            }

            // Prepare form data including the image
            const formData = new FormData();
            formData.append('categoryName', catName); // Append category name
            formData.append('categoryImage', image);     // Append image file

            // Send POST request to the server without manually setting `Content-Type`
            // const response = await fetch("http://localhost:8000/api/createCategory", {
            //     method: "POST",
            //     body: formData, // FormData automatically handles multipart data
            // });

            var token = localStorage.getItem("authToken");
            try {
                const response = await axios.post(
                    `http://localhost/avadh_api/chef/category/add_category.php`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                console.log("Category added successfully!");
                if (response.status == 200) {
                    // Show success modal
                    const modalElement = document.getElementById('imgModal');
                    if (modalElement) {
                        const successModal = new Modal(modalElement);
                        successModal.show();
                        setTimeout(() => {
                            successModal.hide();
                            navigate('/chef_category');
                        }, 2000);
                    }
                } else {
                    alert(response.data.message || 'Failed to add table');
                }
                // window.location.href = "/chef_category"; // Redirect to category list page

            } catch (error) {
                console.error("Error fetching dishes by category:", error);
            }
            // Check if the request was successful
            // if (!response.ok) {
            //     const errorResponse = await response.text(); // Get the error response from the server
            //     throw new Error(`Failed to add category: ${response.status} - ${errorResponse}`);
            // }

            // Show success modal if the category is added successfully


            // Clear the form after submission
            clearForm();

        } catch (error) {
            // Log the detailed error
            console.error("Error adding category:", error.message);
        }
    };

    const clearForm = () => {
        // Clear form fields after successful submission
        setCatName('');
        setImage(null);
    };

    const toggleDrawer = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const toggleNotifications = () => {
        const panel = document.getElementById("notification-panel");
        panel.style.display = panel.style.display === "none" || panel.style.display === "" ? "block" : "none";
    };

    return (
        <div id={styles.a_selectTable}>
            <ChefNavbar
                toggleDrawer={toggleDrawer}
                toggleNotifications={toggleNotifications}
                showSearch={false}
            />
            <ChefSidePanel
                isOpen={isSidebarOpen}
                isChefDashboard={false}
                isChefMenu={false}
                isChefCategory={true}
                isChefVariant={false}
                isChefProfile={false} />
            <div id={styles['a_main-content']}>
                <div className={`container-fluid ${styles.a_main}`}>
                    <div>
                        <div className={styles.title_txt} style={{ fontSize: '30px', fontWeight: '600' }}>Add Category</div>
                    </div>
                    <form id={styles.addCategory} onSubmit={addCategory}>
                        <div className={`row ${styles.v_row_adddish}`}>
                            <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                                <input type="text" className={`form-control ${styles['form-control']} ${styles.v_dishinput_pad}`} id="cat_name" placeholder="Category Name" required aria-label="Category Name" value={catName} onChange={(e) => setCatName(e.target.value)} />
                            </div>
                            <div className="col-xs-12 col-md-6" style={{ padding: 0 }}>
                                <input className={`form-control ${styles['form-control']} ${styles.v_dishinput_pad}`} placeholder="Image" type="file" id="formFile" required onChange={(e) => setImage(e.target.files[0])} />
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

export default AddCategory;

