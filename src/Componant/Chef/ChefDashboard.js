import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import ChefNavbar from './ChefNavbar';
import ChefSidePanel from './ChefSidePanel';
import styles from '../../css/ChefDashboard.module.css';
import style from "../../css/BillPayment.module.css"; // Import the CSS module
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom';

function ChefDashboard() {
  const [orders, setOrders] = useState([]);
  const [tablebook, setTablebook] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tables, setTables] = useState([]); // State to hold table data
  const navigate = useNavigate();
 const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState(""); // State for new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [changepasswordmodal, setChangepasswordmodal] = useState(false); // State for change password modal
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    fetchOrders(); // Commented out for now
    // fetchTablebook(); // Commented out for now
    fetchTables(); // Fetch tables on component mount
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/allOrders");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log('responseorder', data.orders)
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };



  const fetchTables = async () => {
    try {
      // Make an API call to fetch all tables
      const response = await axios.get("http://localhost:8000/api/allTables");

      // Log the full response data for debugging
      console.log(response.data, "zdfsfgdhgj");

      // Check if the response is an array and filter for tables with status true
      const activeTables = Array.isArray(response.data.tables)
        ? response.data.tables.filter(table => table.status === true) // Keep only tables where status is true
        : []; // If not an array, set activeTables to an empty array


      // Log the active tables to confirm they are as expected
      console.log(activeTables);

      // Update the state with the filtered active tables
      setTables(activeTables);
    } catch (error) {
      // Handle any errors during the fetch operation
      console.error("Error fetching tables:", error);
    }
  };


  const handleTableClick = async (tableId) => {
    setSelectedTableId(tableId);

    try {
      const ordersForTable = await fetchOrdersForTable(tableId);
      setOrderDetails(ordersForTable);
      console.log('orderDetailsswww ', ordersForTable);

      calculateTotalPrice(ordersForTable);
    } catch (error) {
      console.error("Error fetching orders for the selected table:", error);
    }
  };

  const fetchOrdersForTable = async (tableId) => {
    try {
      // Update the API endpoint to the correct one
      const response = await axios.get(`http://localhost:8000/api/getOrderTableId/${tableId}`);
      console.log(response.data.order, 'responsetablewise')

      // Check if the response is ok (status code 200)
      if (response.status !== 200) {
        throw new Error(`Unexpected response code: ${response.status}`);
      }

      // Return the orders associated with the specified table ID
      return response.data.order; // Assuming the response data is an array of orders
    } catch (error) {
      console.error("Error fetching orders for table:", error);
      return []; // Return an empty array on error
    }
  };

  const toggleDrawer = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const toggleNotifications = () => {
    const panel = document.getElementById("notification-panel");
    panel.style.display = panel.style.display === "none" || panel.style.display === "" ? "block" : "none";
  };

  // Function to format date and time
  const formatDateTime = (dateString) => {
    let date;

    // Attempt to create a date from the provided string
    if (isNaN(new Date(dateString).getTime())) {
      // If the date is invalid, use today's date
      date = new Date(); // Default to today's date
    } else {
      date = new Date(dateString);
    }

    // Format the date
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleString('en-US', options);
  };


  // Function to update order status for all orders of the selected table
  const updateOrderStatus = async () => {
    try {
      const ordersToUpdate = orderDetails.map(order => ({
        ...order,
        orderStatus: 'Served' // Update the status to 'served'
      }));

      const responses = await Promise.all(ordersToUpdate.map(async (order) => {
        try {
          const response = await fetch(`http://localhost:8000/api/updateOrderStatus/${order._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderStatus: order.orderStatus }),
          });
          return response; // Return the response for further processing
        } catch (fetchError) {
          console.error(`Error updating order ID ${order._id}:`, fetchError);
          return null; // Return null if there's an error
        }
      }));

      const allUpdated = responses.every(response => response && response.ok);
      if (allUpdated) {
        console.log("All orders updated successfully");
      } else {
        console.error("Some orders failed to update");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const calculateTotalPrice = (orders) => {
    const total = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    setTotalPrice(total);
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

  // Function to handle password change
// ... existing code ...
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
      
      // Hide the modal after successful password change
      const changePasswordModal = document.getElementById('changepassModal');
      if (changePasswordModal) {
          // Remove the 'show' class directly
          changePasswordModal.classList.remove('show');
          changePasswordModal.style.display = 'none'; // Also set display to none

          // Remove the backdrop
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
              backdrop.remove(); 
          }
          // Optionally, reset the modal content
          setNewPassword("");
          setConfirmPassword("");
      }

      return response.json();
  })
  .catch(error => {
      console.error("Error changing password:", error);
  });
};
// ... existing code ...

  return (
    <section id={styles.a_selectTable}>
      <ChefNavbar toggleDrawer={toggleDrawer} toggleNotifications={toggleNotifications}/>
      <ChefSidePanel isOpen={isSidebarOpen} isChefDashboard={true}></ChefSidePanel>

      <div id={styles['a_main-content']}>
        <div className={`container-fluid ${styles.a_main_chef}`}>
          <div className={`${styles.v_all_margin} ${styles.a_d_list}`}>
            <div className="row p-0 m-0">
              <div className="col-md-12 col-lg-12 col-xl-4 col-sm-12 col-xs-12 ">
                <div className={`${styles.a_search} text-start ms-0 w-100 mb-2`}>
                  <input 
                    type="search" 
                    placeholder="Search..." 
                    className="search-input w-100" 
                    style={{ maxWidth: '100%' }} 
                    value={searchQuery} // Bind the input value to searchQuery
                    onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
                  />
                </div>
                <div className={`${styles.v_chef_border} p-3`} style={{ 'borderRadius': '5px' }} id={styles.aesh_orders}>
                  {tables.length > 0 ? (
                    tables
                      .filter(table => table.tableName.toLowerCase().includes(searchQuery.toLowerCase())) // Filter tables based on search query
                      .map(table => (
                        <div
                          key={table._Id}
                          className={`${styles.v_chef_border} p-3 d-flex justify-content-between align-items-center mt-1 mb-4 rounded`}
                          onClick={() => handleTableClick(table._id)}
                          data-table-id={table._Id}
                        >
                          <div className="v_badge_position1">
                            {/* Add the badge for payment status */}
                            <span
                              className={`badge ${styles.v_badge_position}`}
                              style={{
                                color: "white",
                                padding: "5px 20px",
                              }}
                            >

                            </span>

                            {/* Order number and time */}
                            <div className={styles.v_bold_order}>
                              Order #
                              <span>{table.tableName}</span>
                            </div>
                            <div className={styles.v_light_order_time}>
                              {formatDateTime(table.updatedAt)}
                            </div>
                          </div>

                          {/* Icon for order details */}
                          <div className={styles.v_order_color}>
                            <FontAwesomeIcon icon={faCircleChevronRight} />
                          </div>
                        </div>
                      ))
                  ) : (
                    <div>No active tables available</div>
                  )}
                </div>
              </div>

              <div className="col-md-12 col-lg-12 col-xl-8 col-sm-12 col-xs-12 ">
                <div className={`${styles.v_bold_order} ${styles.v_margin_mdscreen}`} style={{ fontSize: '30px', fontWeight: '600' }}>Order Details</div>
                {orderDetails.map((order, index) => (
                  <div className={`${styles.v_chef_border_order}`} key={index}>
                    <div className={`d-flex justify-content-between ${styles.order_pading}`}>
                      <div>
                        <div className={styles.v_bold_order}>Order</div>
                        <div className={`${styles.v_light_order_time} text-nowrap`}>
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {
                        tables.map(table => (
                          table._id === selectedTableId && ( // Assuming each table has an 'id' property
                            <div key={table.id} className={`${styles.v_bold_order} text-nowrap`}>
                              (Table : <span>{table.tableName}</span>)
                            </div>
                          )
                        ))
                      }
                    </div>
                    <div className="border-bottom border-top p-2">
                      <div style={{ fontWeight: '600' }} className='mb-2'>Order Menu</div>
                      <div id={styles['order-details']}>
                        {order.orderDish.map((dishItem, dishIndex) => {


                          const dishTotal = dishItem.dish.sellingPrice * dishItem.qty;
                          const totalPriceForDish = dishTotal; // Adjust as needed

                          return (
                            <div key={dishIndex}>

                              <div className="d-flex justify-content-between align-items-center">
                                <div className="my-0 d-flex align-items-center">
                                  <img src={`http://localhost:8000/${dishItem.dish.dishImage}`} alt="" className={`me-3 ${styles.v_order_img}`} />
                                  <div>
                                    <div style={{ fontWeight: '600' }}>{dishItem.dish.dishName || "Unknown Item"}</div>
                                    <div>Qty: {dishItem.qty || 0}</div>
                                  </div>
                                </div>
                                <div style={{ fontWeight: '600' }}>₹{totalPriceForDish.toFixed(2)}</div>
                              </div>
                              {dishItem.variant.length > 0 && (
                                <div>
                                  {dishItem.variant.map((variant, variantIndex) => (
                                    <div key={variantIndex}>{variant.variantName}: ₹{variant.price}</div>
                                  ))}
                                </div>
                              )}
                              {dishIndex < order.orderDish.length - 1 && <hr />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center m-2">
                      <div style={{ fontWeight: '700', fontSize: '20px', margin: '5px' }}>Total</div>
                      <div style={{ fontWeight: '600' }}>₹ <span id={styles.aesh_ord_total}>{totalPrice}</span></div>
                    </div>
                  </div>
                ))}
                <div className="d-flex justify-content-end align-items-center my-3">
                  <button type="button" className={`btn border-secondary border me-3 p-4 ${styles.v_btn_size}`} id={styles.aesh_Cancel} style={{ padding: '5px 30px  5px 30px  !important' }}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`btn border text-white p-4 mx-1 ${styles.v_btn_size}`}
                    id={styles.aesh_Accept}
                    style={{ padding: '10px 30px !important', backgroundColor: '#4b6c52' }}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default behavior
                      updateOrderStatus(); // Update all orders for the selected table
                    }}
                  >
                    Accept
                  </button>
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

      {/* Logout Modal */}
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
                  {/* <button onClick={handleLogout}>Logout</button> */}
                  <button type="button" data-bs-toggle="modal" data-bs-target="#logoutModal" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Successfully Modal */}
      <div className="modal fade" id="imgModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content m_save" style={{ border: 'none', backgroundColor: '#f6f6f6' }}>
            <div className="modal-body m_save_text">
              <span>Add Successfully!</span>
            </div>
            <div className="m_save_img">
              <img src="image/right.png" alt="" />
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

export default ChefDashboard;