import React, { useState, useEffect } from 'react';
import { Modal } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';
import SuperNavbar from './SuperNavbar';
import SuperSidePanel from './SuperSidePanel';
import styles from "../../css/AddTable.module.css"; // Corrected import for CSS
import axios from 'axios';
import style from "../../css/BillPayment.module.css";
import { useNavigate } from 'react-router-dom';

function AddTable(props) {
    const [tableQuantity, setTableQuantity] = useState(1); // Number of tables to add
    const [tableGuest, setTableGuest] = useState(''); // Number of guests per table
    const [tables, setTables] = useState([]); // Store existing tables
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changepasswordmodal, setChangepasswordmodal] = useState(false);
    const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");
    // Function to fetch existing tables from the server
    const fetchTables = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                "http://localhost/avadh_api/super_admin/tables/view_tables.php",
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            if (response.data && response.data.tables) {
                setTables(response.data.tables);
            }
        } catch (error) {
            console.error("Error fetching tables:", error);
            setTables([]);
        }
    };

    useEffect(() => {
        fetchTables(); // Fetch tables when component mounts
    }, []);

    useEffect(() => {
        // Import Bootstrap's JavaScript
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
        
        // Clean up function
        return () => {
            const modalElement = document.getElementById('imgModal');
            if (modalElement) {
                const modal = Modal.getInstance(modalElement);
                if (modal) {
                    modal.dispose();
                }
            }
        };
    }, []);

     const toggleDrawer = () => {
        setIsSidebarOpen(prev => !prev);
      };

    const clearForm = () => {
        setTableQuantity(1);
        setTableGuest('');
        setErrorMessage(''); // Clear error message
    };

    // Function to find the next table number based on existing tables
    const getNextTableNumber = () => {
        const existingNumbers = tables.map(table => {
            // Extract number from tableName (e.g., "table 2" -> 2)
            const match = table.tableName.match(/\d+/); 
            return match ? parseInt(match[0], 10) : 0; // Convert to integer or default to 0
        });
        // Return max number + 1, or start at 1 if no tables exist
        return existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1; 
    };

    const profilesave = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem('authToken');
            
            if (!tableGuest) {
                alert("Please enter guest capacity");
                return;
            }

            const response = await axios.post(
                `http://localhost/avadh_api/super_admin/tables/add_tables.php`,
                {
                    tableName: tableQuantity.toString(),
                    tableGuest: tableGuest
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            console.log("response", response);

            if (response.status == 200) {
                // Clear form
                clearForm();
                
                // Show success modal
                const modalElement = document.getElementById('imgModal');
                if (modalElement) {
                    const successModal = new Modal(modalElement);
                    successModal.show();
                    
                    // Automatically close modal and redirect after 2 seconds
                    setTimeout(() => {
                        successModal.hide();
                        navigate('/supertable');
                    }, 20000);
                }
            } else {
                alert(response.data.message || 'Failed to add table');
            }

        } catch (error) {
            console.error("Error adding table:", error);
            alert("Failed to add table. Please try again.");
        }
    };

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

        console.log(passwordData);


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
                console.log(response);
                const changePasswordModal = document.getElementById('changepassModal');
                console.log(changePasswordModal);

                const modal = new window.bootstrap.Modal(changePasswordModal);
                console.log(modal);

                if (modal) {
                    modal.hide();
                } else {
                    const newModal = new bootstrap.Modal(changePasswordModal);
                    newModal.hide();
                }
                setNewPassword("");
                setConfirmPassword("");
                return response.json();

            })
            .catch(error => {
                console.error("Error changing password:", error);
            });
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
        <>
            <section id={styles.a_selectTable} showSearch={false}>
                <SuperNavbar toggleDrawer={toggleDrawer} />
                <SuperSidePanel isOpen={isSidebarOpen} isTable={true} />

                <div id={styles['a_main-content']}>
                    <div className={`container-fluid ${styles.a_main}`}>
                        <div className={styles.m_add}>
                            <span>Add Tables</span>
                        </div>
                    </div>
                    <form id={styles.add_chef_form} onSubmit={profilesave}>
                        <div className={`row d-flex ${styles.m_add_input}`}>
                            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                                <div className={`input-group ${styles.m_add_input_mar}`}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tablequantity"
                                        placeholder="Table Name"
                                        value={tableQuantity}
                                        onChange={(e) => setTableQuantity(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                                <div className={`input-group ${styles.m_add_input_mar}`}>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="tableGuest"
                                        placeholder="Guest Capacity"
                                        min="1"
                                        max="20"
                                        value={tableGuest}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            if (value >= 1 && value <= 20) {
                                                setTableGuest(value);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>} {/* Display error message */}
                        <div className={styles.m_btn_clear_save}>
                            <div className={styles.m_btn_clear}>
                                <button type="button" onClick={clearForm}>
                                    <i className="fa-solid fa-eraser"></i> Clear
                                </button>
                            </div>
                            <div className={styles.m_btn_save}>
                                <button type="submit">
                                    <i className="fa-regular fa-floppy-disk"></i> Save
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Success Modal */}
                    {/* <div 
                        className="modal fade" 
                        id="imgModal" 
                        tabIndex="-1" 
                        aria-labelledby="successModalLabel" 
                        aria-hidden="true"
                        data-bs-backdrop="static" // Prevents closing when clicking outside
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content" style={{ backgroundColor: '#f6f6f6', border: 'none' }}>
                                <div className="modal-body text-center">
                                    <h5 className="modal-title mb-3">Success!</h5>
                                    <p>Table added successfully!</p>
                                    <div className="mt-4">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary" 
                                            onClick={() => {
                                                const modalElement = document.getElementById('imgModal');
                                                const modal = Modal.getInstance(modalElement);
                                                if (modal) {
                                                    modal.hide();
                                                }
                                                navigate('/supertable');
                                            }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* Success Modal */}
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
                    {/* <img src="../../Image/right.png" alt="" /> */}
                </div>
            </div>
        </div>
    </div>
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
                            style={{ border: "none", backgroundColor: "#f6f6f6" }}
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
                                        <button type="button" data-bs-toggle="modal" data-bs-target="#logoutModal" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </>
    );
}

export default AddTable;