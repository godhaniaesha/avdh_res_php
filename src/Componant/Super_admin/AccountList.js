import React, { useEffect, useState } from "react";
import SuperNavbar from "./SuperNavbar";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import SuperSidePanel from "./SuperSidePanel";
import styles from "../../css/AccountList.module.css"; // Adjust the path as necessary
import style from "../../css/BillPayment.module.css";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

const AccountList = () => {
  const [accountants, setAccountants] = useState([]); // State to hold accountant data
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [accountantIdToDelete, setAccountantIdToDelete] = useState(null); // ID of the accountant to delete
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changepasswordmodal, setChangepasswordmodal] = useState(false)
  const [searchQuery, setSearchQuery] = useState(""); 
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");

  // Function to handle delete button click
  const handleDeleteClick = (accountantId) => {
    console.log("Selected accountantId for deletion:", accountantId); // Log the accountantId to ensure it's being passed correctly
    setAccountantIdToDelete(accountantId); // Set the ID of the accountant to delete
    setShowDeleteModal(true); // Show the delete confirmation modal
  };

  // Function to close the delete confirmation modal
  const handleCloseModal = () => {
    setShowDeleteModal(false); // Close the modal
    setAccountantIdToDelete(null); // Reset the accountant ID
  };

  // Effect to fetch accountants data from API
  useEffect(() => {
    const fetchAccountant = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(
          "http://localhost/avadh_api/super_admin/accountant/view_accountant.php",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data.data);


        setAccountants(response.data.data); // Store the filtered waiters

      } catch (error) {
        console.error("Error fetching waiters:", error);
      }
    };

    fetchAccountant();
  }, []);

  // Function to delete accountant by ID
  const deleteAccountantById = async (accountantId) => {
    console.log("accountantId", accountantId); // Log the accountant ID to ensure it's correct

    try {
      // Ensure the delete URL is correctly formatted
      const deleteUrl = `http://localhost:8000/api/deleteUser/${accountantId}`;
      console.log("deleteUrl", deleteUrl); // Log the correctly formatted URL
      const response = await fetch(deleteUrl, { method: "DELETE" }); // Send DELETE request
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Update accountants state after deletion
      setAccountants(accountants.filter((accountant) => accountant._id !== accountantId)); // Use _id for filtering
      handleCloseModal(); // Close modal after deletion
    } catch (error) {
      console.error("Error deleting accountant record:", error); // Handle any errors
    }
  };

  // Function to handle edit button click
  const handleEditClick = (accountant) => {
    localStorage.setItem("accountantData", JSON.stringify(accountant)); // Store entire accountant object in localStorage
  };

  const toggleDrawer = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleLogout = () => {
    // Check if Bootstrap's Modal is available
    if (window.bootstrap && window.bootstrap.Modal) {
      const logoutModal = document.getElementById('logoutModal');
      const modal = new window.bootstrap.Modal(logoutModal);
      modal.hide();
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
    <section>
      <SuperNavbar toggleDrawer={toggleDrawer} showSearch={false} />
      <SuperSidePanel isOpen={isSidebarOpen} isAccountant={true} />

      <div id={styles["a_main-content"]}>
        <div className={styles["db_content-container"]}>
          <div className={`container-fluid ${styles.a_main}`}>
            <div className={styles.m_chef_list}>
              <div className={styles.m_chef}>
                <span>Accountant List</span>
              </div>
              <div className={`${styles.m_search} d-flex`}>
                <div className="pr-3">
                  <input
                    type="search"
                    placeholder="Search..."
                    className={styles["search-input"]}
                    value={searchQuery} // Bind the input value to searchQuery
                    onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
                  />
                </div>
                <Link to={"/addaccount"}>
                  <button>
                    <i className="fa-solid fa-plus"></i>Add New
                  </button>
                </Link>
              </div>
            </div>
          </div>
          {/* Accountant Table */}
          <div
            className={styles["m_table"]}
            style={{ padding: "30px 10px 300px 10px", borderRadius: "5px" }}
          >
            <table border="0" width="100%">
              <thead>
                <tr
                  align="center"
                  bgcolor="#F3F3F3"
                  className={`${styles.m_table_heading} font-weight-bold`}
                >
                  <td>Image</td>
                  <td>Name</td>
                  <td>Phone</td>
                  <td>Email</td>
                  <td>Date of Birth</td>
                  <td>City</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {accountants
                  .filter(accountant =>
                    `${accountant.firstName} ${accountant.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) // Filter based on search query
                  )
                  .map((accountant) => (
                    <tr key={accountant._id} align="center">
                      <td>
                        <img style={{ "width": "50px" }}
                          src={accountant?.image ? `http://localhost/avadh_api/images/${accountant.image}` : ''}
                          alt={accountant.image}
                        />
                      </td>
                      <td>
                        {accountant.firstName} {accountant.lastName}
                      </td>
                      <td>{accountant.phone}</td>
                      <td>{accountant.email}</td>
                      <td>
                        {new Date(accountant.dateOfBirth).toLocaleDateString("en-GB")}
                      </td>
                      <td>{accountant.city}</td>
                      <td>
                        <div className={styles.m_table_icon}>
                          <div className={styles.m_pencile}>
                            <Link to={"/editaccount"} onClick={() => handleEditClick(accountant)} className={styles['edit-button']}>
                              <button aria-label="Edit Accountant">
                                <i className="fa-solid fa-pencil"></i>
                              </button>
                            </Link>
                          </div>
                          <div className={styles.m_trash}>
                            <button onClick={() => handleDeleteClick(accountant._id)} aria-label="Delete Accountant">
                              <i className="fa-regular fa-trash-can"></i>
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div>
          <div className="modal-backdrop fade show"></div>
          <div
            className="modal fade show"
            style={{ display: "block" }}
            tabIndex="-1"
            role="dialog"
            inert // Use inert instead of aria-hidden
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content"
                style={{ backgroundColor: "#F3F3F3", border: "none" }}
              >
                <div className="modal-body">
                  <div className="text-center">
                    <div
                      className="m_delete"
                      style={{
                        fontSize: "32px",
                        fontWeight: 600,
                        marginBottom: "25px",
                      }}
                    >
                      Delete
                    </div>
                    <div
                      className="m_sure_delete"
                      style={{
                        fontSize: "25px",
                        fontWeight: 500,
                        marginBottom: "45px",
                      }}
                    >
                      Are You Sure You Want To Delete?
                    </div>
                    <div className="d-flex justify-content-center align-items-center my-3">
                      <button
                        type="button"
                        className="btn b_button btn border-secondary border mx-3"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn border text-white mx-3"
                        style={{ backgroundColor: "#4b6c52" }}
                        onClick={() => deleteAccountantById(accountantIdToDelete)} // Ensure using accountantIdToDelete
                      >
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
      {/* 
      Change Password Modal
      <div
        className={`${styles.m_model_ChangePassword} modal fade`}
        id="changepassModal"
        tabIndex="-1"
        aria-labelledby="deleteModalLabel"
        aria-hidden="true"
      >
        <div className={`${styles.m_model} modal-dialog modal-dialog-centered`}>
          <div
            className={`modal-content ${styles.m_change_pass}`}
            style={{ border: "none", backgroundColor: "#f6f6f6" }}
          >
            <div className={`modal-body ${styles.m_change_pass_text}`}>
              <span>Change Password</span>
            </div>
            <div className={styles.m_new}>
              <input type="text" placeholder="New Password" />
            </div>
            <div className={styles.m_confirm}>
              <input type="text" placeholder="Confirm Password" />
            </div>
            <div className={styles.m_btn_cancel_change}>
              <div className={styles.m_btn_cancel}>
                <button data-bs-dismiss="modal">Cancel</button>
              </div>
              <div className={styles.m_btn_change}>
                <button>Change</button>
              </div>
            </div>
          </div>
        </div>
      </div> */}

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
  );
};

export default AccountList;