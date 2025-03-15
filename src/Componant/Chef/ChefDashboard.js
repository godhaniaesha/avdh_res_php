import React, { useEffect, useState } from 'react';
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

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
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [update,setUpdate] = useState(""); // State for update
  useEffect(() => {
    fetchOrders(); // Commented out for now
    // fetchTablebook(); // Commented out for now
    fetchTables(); // Fetch tables on component mount
  }, [update]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post("http://localhost/avadh_api/chef/dashboard/view_order.php",{},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      // if (!response.ok) throw new Error("Network response was not ok");
      // const data = await response.json();
      console.log('responseorder', response.data.orders)
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };



  const fetchTables = async () => {
    try {
      // Make an API call to fetch all tables
      const response = await axios.post("http://localhost/avadh_api/super_admin/tables/view_tables.php");
      
      // Log the full response data for debugging
      console.log(response.data, "zdfsfgdhgj");

      // Check if the response is an array and filter for tables with status true
      const activeTables = Array.isArray(response.data.tables)
        ? response.data.tables.filter(table => table.status === 'true') // Keep only tables where status is true
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


  const handleTableClick = async (tableId ,tableName) => {
    setSelectedTableId(tableId);
    // alert("Table " + tableName.replace());

    try {
      const ordersForTable = await fetchOrdersForTable(tableId);
      console.log(ordersForTable);
      setOrderDetails(ordersForTable);
      console.log('orderDetailsswww ', ordersForTable);

      calculateTotalPrice(ordersForTable);
    } catch (error) {
      console.error("Error fetching orders for the selected table:", error);
    }
  };

  const fetchOrdersForTable = async (tableId) => {
    // alert(typeof(tableId));
    try {
      var data = orders.filter(order => parseInt(order.tableNo) === parseInt(tableId));
      console.log('orderdetails', orders);
      return data;
      // // Update the API endpoint to the correct one
      // const response = await axios.get(`http://localhost:8000/api/getOrderTableId/${tableId}`);
      // console.log(response.data.order, 'responsetablewise')

      // // Check if the response is ok (status code 200)
      // if (response.status !== 200) {
      //   throw new Error(`Unexpected response code: ${response.status}`);
      // }

      // Return the orders associated with the specified table ID
      // return response.data.order; // Assuming the response data is an array of orders
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
      console.log(orderDetails[0]);
  
      await Promise.all(
        orderDetails[0].orderDish.map(async (order) => {
          var formData = new FormData();
          formData.append("order_id", order.id);
          formData.append("orderStatus", "Accepted");
  
          try {
            const response = await axios.post(
              "http://localhost/avadh_api/chef/dashboard/update_order.php",
              formData,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                  "Content-Type": "multipart/form-data", // Corrected content type
                },
              }
            );
            console.log(`Order ${order.id} updated successfully:`, response.data);
          } catch (apiError) {
            console.error(`Error updating order ID ${order.id}:`, apiError);
          }
        })
      );
      console.log("All orders processed.");

      setUpdate('true')
      fetchOrders(); // Update the orders state after updating status
      const ordersForTable = await fetchOrdersForTable(orderDetails[0].tableNo.replace(/\D/g, ""));
      setOrderDetails(ordersForTable);
      // fetchOrdersForTable(orderDetails[0].tableNo.replace(/\D/g, ""))
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const calculateTotalPrice = (orders) => {
    const total = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    setTotalPrice(total);
  }; 

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
                          key={table.Id}
                          className={`${styles.v_chef_border} p-3 d-flex justify-content-between align-items-center mt-1 mb-4 rounded`}
                          onClick={() => handleTableClick(table.id , table.tableName)}
                          data-table-id={table.Id}
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

              <div className="col-md-12 col-lg-12 col-xl-8 col-sm-12 col-xs-12">
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
                      {/* {
                        tables.map(table => (
                          table._id === selectedTableId && ( // Assuming each table has an 'id' property */}
                            <div key={order.id} className={`${styles.v_bold_order} text-nowrap`}>
                              (Table : <span>{order.tableNo}</span>)
                            </div>
                          {/* )
                        )) */}
                      {/* } */}
                    </div>
                    <div className="border-bottom border-top p-2">
                      <div style={{ fontWeight: '600' }} className='mb-2'>Order Menu</div>
                      <div id={styles['order-details']}>
                        {order.orderDish.map((dishItem, dishIndex) => {


                          const dishTotal = (dishItem.sellingPrice * dishItem.qty);
                          const totalPriceForDish = dishTotal; // Adjust as needed

                          return (
                            <div key={dishIndex} style={{opacity : dishItem.orderStatus === 'Accepted' ? '0.5' :'1'}}>
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="my-0 d-flex align-items-center">
                                  <img src={`http://localhost/avadh_api/images/${dishItem.dishImage}`} alt="" className={`me-3 ${styles.v_order_img}`} />
                                  <div>
                                    <div style={{ fontWeight: '600' }}>{dishItem.dishName || "Unknown Item"}</div>
                                    <div>Qty: {dishItem.qty || 0}</div>
                                  </div>
                                </div>
                                <div style={{ fontWeight: '600' }}>₹{totalPriceForDish.toFixed(2)}</div>
                              </div>
                              {dishItem.variant.length > 0 && (
                                <div>
                                  {dishItem.variant.map((variant, variantIndex) => (
                                    <div key={variantIndex}>{variant.name}: ₹{variant.price}</div>
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