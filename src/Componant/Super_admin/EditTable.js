import React, { useEffect, useState } from 'react';
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
    

    useEffect(() => { 
        const editingTableId = localStorage.getItem('editingTableId');
        console.log(editingTableId, "editingTableId");


        if (editingTableId) {
            // Fetch the table data from the API
            const fetchTableData = async () => {
                const token = localStorage.getItem('authToken'); // Get the token from local storage
                try {
                    const response = await axios.get(`http://localhost:8000/api/getTable/${editingTableId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                        }
                    });
                    console.log("response", response);
                    // Set the table data in state
                    setTableName(response.data.table.tableName); // Fill the table name

                    setTableGuest(response.data.table.tableGuest); // Fill the table guest
                } catch (error) {
                    console.error("Error fetching table data:", error.response ? error.response.data : error.message);
                    alert("Failed to fetch table data. Please check the console for more details.");
                }
            };
            fetchTableData();
        } else {
            navigate('/superTable'); 
        }
    }, [navigate]);

    const handleUpdate = async (event) => {
        event.preventDefault();
        const editingTableId = localStorage.getItem('editingTableId');

        const token = localStorage.getItem('authToken');
        const tableData = {
            tableName: tableName,
            tableGuest: tableGuest,
        };

        try {
            await axios.put(`http://localhost:8000/api/updateTable/${editingTableId}`, tableData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
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
    return (
        <section id={styles.a_selectTable}>
            <SuperNavbar toggleDrawer={toggleDrawer} showSearch={false}/>
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