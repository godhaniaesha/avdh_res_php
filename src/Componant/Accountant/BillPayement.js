import React, { useEffect, useState } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import styles from '../../css/BillPayment.module.css'; // Import the CSS module
import axios from 'axios'; // Import axios
import Navbar from './Navbar';
import styl from "../../css/BillPayment.module.css";

import SidePanel from './SidePanel';
import { useNavigate } from 'react-router-dom';

const BillPayment = () => {
  const [orders, setOrders] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tables, setTables] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const navigate = useNavigate();
  useEffect(() => {
    fetchOrders(); // Fetch all orders on component mount
    // fetchTables(); // Fetch tables on component mount
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.post("http://localhost/avadh_api/Accountant/bill_payment/view_order.php", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      // if (!response.ok) throw new Error("Network response was not ok");
      // const data = await response.json();
      console.log(response.data.orders);
      setOrders(response.data.orders);
      setTables(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/allTables");
      const activeTables = Array.isArray(response.data.tables)
        ? response.data.tables.filter(table => table.status === true)
        : [];
      setTables(activeTables);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const handleTableClick = async (tableId, tableName) => {
    setSelectedTableId(tableName);
    // alert("Table " + tableName );
    try {
      const ordersForTable = await fetchOrdersForTable(tableName);
      setOrderDetails(ordersForTable);
      calculateTotalPrice(ordersForTable);
    } catch (error) {
      console.error("Error fetching orders for the selected table:", error);
    }
  };

  const fetchOrdersForTable = async (tableId) => {
    try {
      var data = orders.filter(order => order.tableNo === tableId && order.paymentStatus === 'Unpaid');
      console.log('orderdetails', data);
      return data;
      // const response = await axios.get(`http://localhost:8000/api/getOrderTableId/${tableId}`);
      // if (response.status !== 200) {
      //   throw new Error(`Unexpected response code: ${response.status}`);
      // }
      // return response.data.order; // Assuming the response data is an array of orders
    } catch (error) {
      console.error("Error fetching orders for table:", error);
      return []; // Return an empty array on error
    }
  };

  const calculateTotalPrice = (orders) => {
    const total = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    setTotalPrice(total);
  };

  const updatePaymentStatus = async () => {
    try {
      console.log('Fetching order', orderDetails)
      await Promise.all(
        orderDetails[0].orderDish.map(async (order) => {
          var formData = new FormData();
          formData.append("order_id", order.id);
          formData.append("paymentStatus", "Paid");
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
      var formData = new FormData();
      formData.append("table_id", orderDetails[0].tableNo);
      formData.append("status", "false");
        const response = await axios.post(
          "http://localhost/avadh_api/super_admin/tables/update_tables.php",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "multipart/form-data", // Corrected content type
            },
          }
        );
      console.log("All orders processed.");
      const ordersToUpdate = orderDetails.map(order => ({
        ...order,
        paymentStatus: 'Paid' // Update the status to 'Paid'
      }));
      // setTables([])
      console.log("table is free now.");
      var data = tables.map(t =>
        t._id === ordersToUpdate[0]._id
          ? { ...t, paymentStatus: 'Paid' } // Only update paymentStatus
          : t // Keep the same object if no match
      );
      console.log('data123', tables);
      console.log(ordersToUpdate);
      console.log('data', data);
      setTables(data);
      // const allUpdated = responses.every(response => response && response.ok);
      // if (allUpdated) {
      //   console.log("All orders updated successfully");
      // } else {
      //   console.error("Some orders failed to update");
      // }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // New function to delete the order
  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/deleteOrder/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete order with ID ${orderId}`);
      }

      console.log(`Order with ID ${orderId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

 
  return (
    <section id={styles.a_selectTable}>
      <Navbar toggleDrawer={() => setIsSidebarOpen(prev => !prev)} showSearch={true} />
      <SidePanel isOpen={isSidebarOpen} isbill={true} />

      <div id={styles['a_mainContent']}>
        <div className={`container-fluid ${styles.a_main}`}>
          <div className={`${styles.v_all_margin} mx-4`}>
            <div className="row">
              <div className="col-md-4 px-md-0 pe-md-2 px-0">
                <div className={`${styles.a_search} text-start ms-0 mt-1 w-100 mb-2`}>
                  <input
                    type="search"
                    placeholder="Search..."
                    className="search-input w-100 py-2"
                    style={{ maxWidth: '100%' }}
                    value={searchQuery} // Bind the input value to searchQuery
                    onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
                  />
                </div>
                <div className={`${styles.v_chef_border} p-3`} id={styles.aesh_orders}>
                  {tables.length > 0 ? (
                    tables
                      .filter(table => table?.tableNo?.toLowerCase().includes(searchQuery.toLowerCase())) // Filter tables based on search query
                      .map(table => {
                        const ordersForTable = orders.filter(order => order.tableNo?._id === table._id);
                        // const hasUnpaidOrder = ordersForTable.some(order => order.paymentStatus === "Unpaid");

                        return (
                          <div
                            key={table._id}
                            className="mb-3"
                            onClick={() => handleTableClick(table.id, table.tableNo)}
                            data-table-id={table.id}
                          >
                            <div
                              className={`${styles.v_chef_border_order}`}
                              style={{
                                backgroundColor: table.paymentStatus === "Unpaid" ? "#FFE6E6" : "#E3FCEE",
                                borderRadius: "4px",
                                padding: "12px 16px",
                                position: "relative",
                                cursor: "pointer"
                              }}
                            >
                              {/* Badge at top-left */}
                              <div
                                style={{
                                  position: "absolute",
                                  top: "-10px",
                                  left: "12px",
                                  backgroundColor: table.paymentStatus ? "#FF4D4D" : "#00A04A",
                                  color: "white",
                                  padding: "4px 12px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  fontWeight: "500"
                                }}
                              >
                                {table.paymentStatus}
                              </div>

                              {/* Content container with spacing for the badge */}
                              <div style={{ marginTop: "8px" }}>
                                {/* Order and Table info */}
                                <div style={{ marginTop: "4px" }}>
                                  <span style={{
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    marginRight: "12px"
                                  }}>
                                    Order #{table._id || "Unknown"}
                                  </span>
                                </div>

                                {/* Time */}
                                <div style={{
                                  fontSize: "13px",
                                  color: "#666",
                                  marginTop: "4px"
                                }}>
                                  {new Date().toLocaleString()}
                                </div>
                              </div>
                              {/* Right arrow */}
                              <div style={{
                                position: "absolute",
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#666"
                              }}>
                                <i className="fa-solid fa-circle-chevron-right"></i>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div>No active tables available</div>
                  )}
                </div>
              </div>

              <div className="col-md-8 px-md-0 px-0">
                <div className={`mb-2 ${styles.v_bold_order}`} style={{ fontSize: '30px', fontWeight: '600' }}>
                  Order Details
                </div>
                {orderDetails.map((order, index) => (
                  <div className={`${styles.v_chef_border_order}`} key={index}>
                    <div className={`d-flex justify-content-between ${styles.order_pading}`}>
                      <div>
                        <div className={styles.v_bold_order}>Order #{index + 1}</div>
                        <div className={`${styles.v_light_order_time} text-nowrap`}>
                          {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {

                        order.tableNo === selectedTableId && ( // Assuming each table has an 'id' property
                          <div key={order.id} className={`${styles.v_bold_order} text-nowrap`}>
                            (Table : <span>{order.tableNo}</span>)
                          </div>)}
                      {/* )) */}
                      {/* } */}
                    </div>
                    <div className="border-bottom border-top p-sm-2 p-0">
                      <div style={{ fontWeight: '600' }} className='mb-2  mt-sm-0 mt-2'>Order Menu</div>
                      <div id={styles['order-details']}>

                        {order.orderDish.map((dishItem, dishIndex) => {
                          const dishTotal = dishItem.sellingPrice * dishItem.qty;
                          const totalPriceForDish = dishTotal; // Adjust as needed

                          return (
                            <div key={dishIndex}>
                              <div className=" d-flex justify-content-between align-items-center p-1">
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
                                    <div key={variantIndex} className='d-flex justify-content-between p-1'>
                                      <span>{variant.name}</span>
                                      <span>₹{variant.price}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {dishIndex < order.orderDish.length - 1 && <div className='border-bottom' />} {/* Only display <hr> if this is not the last item */}
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
                <div className="d-flex justify-content-md-end justify-content-center align-items-center my-3">
                  <button type="button" className={`btn border-secondary border me-3 ${styles.v_btn_size}`} id={styles.aesh_Cancel} style={{ padding: '3px 20px' }}>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`btn border text-white ${styles.v_btn_size}`}
                    id={styles.aesh_Pay}
                    style={{ padding: '3px 20px', backgroundColor: '#4b6c52' }}
                    onClick={(e) => {
                      e.preventDefault();
                      updatePaymentStatus();
                    }}
                  >
                    Pay
                  </button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      {/* Add any additional modals or components here as needed */}
    </section >
  );
};

export default BillPayment;