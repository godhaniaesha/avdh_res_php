import React, { useEffect, useState } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import SuperNavbar from './SuperNavbar';
import SuperSidePanel from './SuperSidePanel';
import styles from "../../css/AddTable.module.css"; // Use the same styles as AddTable
import axios from 'axios';
import style from "../../css/BillPayment.module.css";

import { useNavigate } from 'react-router-dom'; // Import useNavigate

function EditTable() {
    const [tableName, setTableName] = useState('');
    const [tableGuest, setTableGuest] = useState('');
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState(""); // Initialize navigate
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changepasswordmodal, setChangepasswordmodal] = useState(false)
    const editingTableId = JSON.parse(localStorage.getItem('tableData'));

    useEffect(() => {
        console.log(editingTableId, "editingTableId");


        // if (editingTableId) {
        //     // Fetch the table data from the API
        //     const fetchTableData = async () => {
        //         const token = localStorage.getItem('authToken'); // Get the token from local storage
        //         try {
        //             const response = await axios.get(`http://localhost:8000/api/getTable/${editingTableId}`, {
        //                 headers: {
        //                     'Authorization': `Bearer ${token}`,
        //                     'Accept': 'application/json',
        //                 }
        //             });
        //             console.log("response", response);
        //             // Set the table data in state
        //         } catch (error) {
        //             console.error("Error fetching table data:", error.response ? error.response.data : error.message);
        //             alert("Failed to fetch table data. Please check the console for more details.");
        //         }
        //     };
        //     fetchTableData();
        // } else {
        //     // navigate('/superTable'); 
        // }
        setTableName(editingTableId.tableName); // Fill the table name

        setTableGuest(editingTableId.tableGuest); // Fill the table guest
    }, [navigate]);

    const handleUpdate = async (event) => {
        event.preventDefault();
        // const editingTableId = JSON.parse(localStorage.getItem('editingTableId'));
        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('table_id', editingTableId.id);
        formData.append('tableNumber', tableName.replace(/[^0-9.\s]/g, ''));
        formData.append('tableGuest', tableGuest);

        try {
            await axios.post(`http://localhost/avadh_api/super_admin/tables/update_tables.php`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            });


            localStorage.removeItem('editingTableId');
            navigate('/superTable');
        } catch (error) {
            console.error("Error updating table:", error.response ? error.response.data : error.message);
            alert("Failed to update table. Please check the console for more details.");
        }
    };
    const toggleDrawer = () => {
        setIsSidebarOpen(prev => !prev);
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
    return (
        <section id={styles.a_selectTable}>
            <SuperNavbar toggleDrawer={toggleDrawer} showSearch={false} />
            <SuperSidePanel isOpen={isSidebarOpen} isTAble={true} />

            <div id={styles['a_main-content']}>
                <div className={`container-fluid ${styles.a_main}`}>
                    <div className={styles.m_add}>
                        <span>Edit Table</span>
                    </div>
                    <form onSubmit={handleUpdate}>
                        <div className={`row d-flex ${styles.m_add_input}`}>
                            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                                <div className={`input-group ${styles.m_add_input_mar}`}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tableName"
                                        placeholder="Table Name"
                                        aria-label="Table Name"
                                        value={tableName} // Bind the input value to state
                                        onChange={(e) => setTableName(e.target.value)} // Update state on change
                                        required
                                    />
                                </div>
                            </div>
                            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
                                <div className={`input-group ${styles.m_add_input_mar}`}>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="tableGuest"
                                        placeholder="Guest"
                                        aria-label="Guest"
                                        value={tableGuest} // Bind the input value to state
                                        onChange={(e) => setTableGuest(e.target.value)} // Update state on change
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <div className={styles.m_btn_save}>
                            <button type="submit">
                                <i className="fa-regular fa-floppy-disk"></i> Save
                            </button>
                        </div> */}
                        <div className={styles.m_btn_clear_save}>
                            <div className={styles.m_btn_save}>
                                <button type="submit" className={`btn ${styles.btn_save}`}>
                                    Save Changes
                                </button>
                            </div>
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

        </section>
    );
}

export default EditTable;