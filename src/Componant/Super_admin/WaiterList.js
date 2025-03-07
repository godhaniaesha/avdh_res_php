import React, { useEffect, useState } from "react";
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import { Link, useNavigate } from "react-router-dom";
import SuperNavbar from "./SuperNavbar";
import SuperSidePanel from "./SuperSidePanel";
import styles from "../../css/WaiterList.module.css";
import style from "../../css/BillPayment.module.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";


function WaiterList(props) {
  const [waiters, setWaiters] = useState([]); // State to hold waiter data
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [waiterIdToDelete, setWaiterIdToDelete] = useState(null); // ID of the waiter to delete
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changepasswordmodal, setChangepasswordmodal] = useState(false)
  const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query

  useEffect(() => {
    const fetchWaiter = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.post(
          "http://localhost/avadh_api/super_admin/waiter/view_waiter.php",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data.data);


        setWaiters(response.data.data); // Store the filtered waiters

      } catch (error) {
        console.error("Error fetching waiters:", error);
      }
    };

    fetchWaiter();
  }, []);

  // Function to delete a waiter by ID
  const deleteWaiterById = async (waiterId) => {
    try {
      const deleteUrl = `http://localhost:8000/api/deleteUser/${waiterId}`;
      const response = await fetch(deleteUrl, { method: "DELETE" }); // Send DELETE request
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Update waiters state after deletion
      setWaiters(waiters.filter((waiter) => waiter._id !== waiterId)); // Use _id for filtering
      handleCloseModal(); // Close modal after deletion
    } catch (error) {
      console.error("Error deleting waiter record:", error); // Handle any errors
    }
  };

  // Function to handle delete button click
  const handleDeleteClick = (waiterId) => {
    setWaiterIdToDelete(waiterId); // Set the ID of the waiter to delete
    setShowDeleteModal(true); // Show the delete confirmation modal
  };

  // Function to close the delete confirmation modal
  const handleCloseModal = () => {
    setShowDeleteModal(false); // Close the modal
    setWaiterIdToDelete(null); // Reset the waiter ID
  };

  const toggleDrawer = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleEditClick = (waiter) => {
    localStorage.setItem("waiterData", JSON.stringify(waiter)); // Store entire waiter object in localStorage
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
    <div>
      <SuperNavbar toggleDrawer={toggleDrawer} showSearch={false} />
      <SuperSidePanel isOpen={isSidebarOpen} isWaiter={true} />

      <div id={styles["a_main-content"]}>
        <div className={styles["db_content-container"]}>
          <div className={`container-fluid ${styles.a_main}`}>
            <div className={styles.m_chef_list}>
              <div className={styles.m_chef}>
                <span>Waiter List</span>
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
                <Link to={"/addwaiter"}>
                  <button>
                    <i className="fa-solid fa-plus"></i>Add New
                  </button>
                </Link>
              </div>
            </div>
          </div>

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
                {waiters.length > 0 ? (
                  waiters
                    .filter(waiter =>
                      `${waiter.firstName} ${waiter.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) // Filter based on search query
                    )
                    .map((waiter) => (
                      <tr key={waiter._id} align="center">
                        <td >
                          <img style={{ "width": "50px" }}
                            src={waiter?.image ? `http://localhost/avadh_api/images/${waiter.image}` : ''}
                            alt={waiter.image}
                          />
                        </td>
                        <td className="text-center pb-2 pt-2">
                          {waiter.firstName} {waiter.lastName}
                        </td>
                        <td className="text-center pb-2 pt-2">{waiter.phone}</td>
                        <td className="text-center pb-2 pt-2">{waiter.email}</td>
                        <td className="text-center pb-2 pt-2">
                          {new Date(waiter.dateOfBirth).toLocaleDateString("en-GB")}
                        </td>
                        <td className="text-center pb-2 pt-2">{waiter.city}</td>
                        <td className="text-center pb-2 pt-2">
                          <div className={styles.m_table_icon}>
                            <div className={styles.m_pencile}>
                              <Link to={"/editwaiter"} onClick={() => handleEditClick(waiter)} className={styles['edit-button']}>
                                <button>
                                  <i className="fa-solid fa-pencil"></i>
                                </button>
                              </Link>
                            </div>
                            <div className={styles.m_trash}>
                              <button
                                className={styles["delete-button"]}
                                onClick={() => handleDeleteClick(waiter._id)}
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
                    <td colSpan="7" className="text-center">
                      No waiters found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showDeleteModal && (
            <div>
              <div className="modal-backdrop fade show"></div>
              <div
                className="modal fade show"
                style={{ display: "block" }}
                aria-labelledby="deleteModalLabel"
                aria-hidden="false"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div
                    className="modal-content x_model_contant"
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
                            onClick={() => deleteWaiterById(waiterIdToDelete)}
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


          {/* Logout Modal */}
          <div
            className={`modal fade ${styles.m_model_logout}`}
            id="logoutModal"
            tabIndex="-1"
            aria-labelledby="logoutModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className={`modal-content ${styles.m_model_con}`}
                style={{ border: "none", backgroundColor: "#f6f6f6" }}
              >
                <div className={styles.m_log}>
                  <div className={styles.m_logout}>
                    <span>Logout</span>
                  </div>
                  <div className={styles.m_text}>
                    <span>Are You Sure You Want To Logout?</span>
                  </div>
                  <div className={styles.m_btn_cancel_yes}>
                    <div className={styles.m_btn_cancel_logout}>
                      <button id="cancelBtn" data-bs-dismiss="modal">
                        Cancel
                      </button>
                    </div>
                    <div className={styles.m_btn_yes}>
                      {/* <button id="yesBtn">Yes</button> */}
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
      </div>
    </div>
  );
}

export default WaiterList;