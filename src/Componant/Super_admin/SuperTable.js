import React, { useEffect, useState } from "react";
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import styles from '../../css/SelecttableAdmin.module.css';
import SuperNavbar from "./SuperNavbar";
import SuperSidePanel from "./SuperSidePanel";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import style from "../../css/BillPayment.module.css";


export default function SuperTable() {
    const [tables, setTables] = useState([]); // State to hold table data
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
    const [tableIdToDelete, setTableIdToDelete] = useState(null); // ID of the table to delete
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changepasswordmodal, setChangepasswordmodal] = useState(false)
    const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // Add this new state

    const toggleDrawer = () => {
        setIsSidebarOpen(prev => !prev);
    };

    const fetchTables = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.post(
                "http://localhost/avadh_api/super_admin/tables/view_tables.php",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("API Response:", response.data);

            // Check if response.data.tables exists and is an array
            if (response.data && response.data.tables && Array.isArray(response.data.tables)) {
                setTables(response.data.tables);
            } else {
                setTables([]); // Set empty array if data is not in expected format
            }

        } catch (error) {
            console.error("Error fetching tables:", error);
            setTables([]); // Set empty array on error
        }
    };

    useEffect(() => {      
    
        fetchTables();
      }, []);

    const handleDeleteClick = (id) => {
        setTableIdToDelete(id); // Set the ID of the table to delete
        setShowDeleteModal(true); // Open the delete confirmation modal
    };

    const deleteTable = async (tableId) => {
        try {
            const token = localStorage.getItem("authToken");
            
            // Create form data
            const formData = new FormData();
            formData.append('table_id', tableId);

            const response = await axios.post(
                'http://localhost/avadh_api/super_admin/tables/delete_tables.php',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                // Update tables state by filtering out the deleted table
                setTables(tables.filter((table) => table.id !== tableId));
                setShowDeleteModal(false); // Close the modal after successful deletion
            } else {
                console.error("Error deleting table:", response.data.message);
                alert(response.data.message || "Failed to delete table");
            }
        } catch (error) {
            console.error("Error deleting table:", error);
            alert("Failed to delete table. Please try again.");
        }
    };

    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setTableIdToDelete(null);
    };

    const handleEditClick = (table) => {
        localStorage.setItem("tableData", JSON.stringify(table));
    };

    const handlePasswordChange = async () => {
        // Validation checks
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("Please fill in all password fields.");
            return;
        }

        const token = localStorage.getItem("authToken");
        
        try {
            const formData = new FormData();
            formData.append('oldPassword', oldPassword);
            formData.append('newPassword', newPassword);
            formData.append('confirmPassword', confirmPassword);

            const response = await axios.post(
                'http://localhost/avadh_api/super_admin/profile/change_password.php',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            let responseData;
            if (typeof response.data === 'string') {
                try {
                    const cleanJson = response.data.replace(/^\d+/, '');
                    responseData = JSON.parse(cleanJson);
                } catch (e) {
                    console.error('Error parsing response:', e);
                    responseData = { success: false, message: 'Invalid response format' };
                }
            } else {
                responseData = response.data;
            }

            if (responseData.success === true) {
                alert(responseData.message || 'Password changed successfully');
                
                // Close modal
                const changePasswordModal = document.getElementById("changepassModal");
                if (changePasswordModal) {
                    const modalInstance = bootstrap.Modal.getInstance(changePasswordModal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
                
                // Clear password fields
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                alert(responseData.message || 'Failed to change password');
            }
        } catch (error) {
            console.error("Error changing password:", error);
            
            if (error.response) {
                try {
                    let errorData;
                    if (typeof error.response.data === 'string') {
                        const cleanJson = error.response.data.replace(/^\d+/, '');
                        errorData = JSON.parse(cleanJson);
                    } else {
                        errorData = error.response.data;
                    }
                    alert(errorData.message || 'Server error');
                } catch (e) {
                    alert('Error processing server response');
                }
            } else if (error.request) {
                alert('No response from server. Please check your connection.');
            } else {
                alert('Error: ' + error.message);
            }
        }
    };

    // Add this function to filter tables based on search query
    const filteredTables = tables.filter(table => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            table.tableName.toLowerCase().includes(searchTerm) ||
            table.tableGuest.toString().toLowerCase().includes(searchTerm)
        );
    });

    return (
        <section id="a_selectTable">
            <SuperNavbar toggleDrawer={toggleDrawer} showSearch={false}/>
            <SuperSidePanel isOpen={isSidebarOpen} isTable={true} />

            <div id={styles["a_main-content"]}>
                <div className={styles["db_content-container"]}>
                    <div className={`container-fluid ${styles.a_main}`}>
                        <div className={styles.m_tbl_list}>
                            <div className={styles.m_tbl}>
                                <span>Table List</span>
                            </div>
                            <div className={`${styles.m_search} d-flex`}>
                                <div className="pr-3">
                                    <input
                                        type="search"
                                        placeholder="Search..."
                                        className="search-input"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Link to={"/addtable"}>
                                    <button>
                                        <i className="fa-solid fa-plus"></i>Add New
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div
                        className={styles.m_table}
                        style={{ padding: "30px 10px 300px 10px", borderRadius: "5px" }}
                    >
                        <table border="0" width="100%">
                            <thead>
                                <tr
                                    align="center"
                                    bgcolor="#F3F3F3"
                                    className={`${styles.m_table_heading} font-weight-bold`}
                                >
                                    <td>Table No.</td>
                                    <td>Guest</td>
                                    <td>Action</td>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(filteredTables) && filteredTables.length > 0 ? (
                                    filteredTables.map((table) => (
                                        <tr key={table.id} align="center">
                                            <td>{table.tableName}</td>
                                            <td>{table.tableGuest}</td>
                                            <td>
                                                <div className={styles.m_table_icon}>
                                                    <div className={styles.m_pencile}>
                                                        <Link 
                                                            to={"/edittable"} 
                                                            onClick={() => handleEditClick(table)} 
                                                            className={styles['edit-button']}
                                                        >
                                                            <button aria-label="Edit Table">
                                                                <i className="fa-solid fa-pencil"></i>
                                                            </button>
                                                        </Link>
                                                    </div>
                                                    <div className={styles.m_trash}>
                                                        <button 
                                                            onClick={() => handleDeleteClick(table.id)} 
                                                            aria-label="Delete Table"
                                                        >
                                                            <i className="fa-regular fa-trash-can"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" align="center">
                                            {searchQuery ? "No matching tables found" : "No tables available"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog" aria-modal="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content" style={{ backgroundColor: "#F3F3F3", border: "none" }}>
                                <div className="modal-body">
                                    <div className="text-center">
                                        <div className="m_delete" style={{ fontSize: "32px", fontWeight: 600, marginBottom: "25px" }}>
                                            Delete
                                        </div>
                                        <div className="m_sure_delete" style={{ fontSize: "25px", fontWeight: 500, marginBottom: "45px" }}>
                                            Are You Sure You Want To Delete?
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center my-3">
                                            <button type="button" className="btn b_button btn border-secondary border mx-3" onClick={handleCloseModal}>
                                                Cancel
                                            </button>
                                            <button type="button" className="btn border text-white mx-3" style={{ backgroundColor: "#4b6c52" }} onClick={() => deleteTable(tableIdToDelete)}>
                                                Yes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

        </section>
    );
}



