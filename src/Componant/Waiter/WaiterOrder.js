import React, { useEffect, useState } from 'react';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import WaiterSidePanel from './WaiterSidePanel';
import WaiterNavbar from './WaiterNavbar';
import styles from "../../css/WaiterOrder.module.css";
import axios from 'axios'; // Import axios
import styl from "../../css/BillPayment.module.css";
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';



const WaiterOrder = () => {
  const [orders, setOrders] = useState([]); // State to hold orders
  const [tables, setTables] = useState([]); // State to hold table data
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(""); // State to hold search query
  const [tableSearchQuery, setTableSearchQuery] = useState(""); // State to hold table search query

  let token;


  const fetchOrders = async () => {
    token = localStorage.getItem("authToken");

    try {
      const response = axios.post("http://localhost/avadh_api/waiter/order/view_order.php", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let hello = await response;
      const newData = Array.isArray(hello.data.orders) 
      ? hello.data.orders
      : hello.data.orders ? [hello.data.orders] : [];
      console.log("Fetched data123:", hello.data.orders);
      console.log("zdfasfaefg", hello.data.orders);

      setOrders(newData); // Store the orders in state
      
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders(); // Fetch orders on component mount
    // fetchTables(); // Uncomment if you need to fetch tables
  }, []);


  const toggleDrawer = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const toggleNotifications = () => {
    const panel = document.getElementById("notification-panel");
    panel.style.display = panel.style.display === "none" || panel.style.display === "" ? "block" : "none";
  };

  console.log("ordersssss", orders); // Log the orders state
  
  // fetchOrders();

  const handleLogout = () => {
    if (window.bootstrap && window.bootstrap.Modal) {
      const logoutModal = document.getElementById('logoutModal');
      const modal = new window.bootstrap.Modal(logoutModal);
      modal.hide();
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");

    navigate("/login", { replace: true });

    window.history.pushState(null, '', window.location.href);
  };

  // Function to filter orders based on search query
  // const filteredOrders = orders.filter(order =>

  //   order.tableNo.status === true && // Only include orders with tables that have status true
  //   order.orderDish.some(dish => 
  //     dish.dish.dishName.toLowerCase().includes(searchQuery.toLowerCase())
  //   ) && (order.tableNo?.tableName.toLowerCase().includes(tableSearchQuery.toLowerCase())) // Filter by table name
  // );
  const filteredOrders = orders.filter(order =>
    order.tableNo?.status === true && // Ensure tableNo exists before accessing status
    order.orderDish.some(dish =>
      dish.dish.dishName.toLowerCase().includes(searchQuery.toLowerCase())
    ) && (order.tableNo?.tableName?.toLowerCase().includes(tableSearchQuery.toLowerCase()) ?? false) // Ensure tableName exists before accessing
  );

  return (
    <section id="a_selectTable">
      <WaiterNavbar
        toggleDrawer={toggleDrawer}
        toggleNotifications={toggleNotifications}
        showSearch={false}
      />
      <WaiterSidePanel isOpen={isSidebarOpen} iswaiterorder={true} />

      <div id={styles['a_main-content']}>
        <div className={`container-fluid ${styles.a_main}`}>
          <div className={styles.m_chef_list}>
            {/* <div className={styles.m_chef}>
              <span>Order Status</span>
            </div> */}
          </div>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="text-nowrap" style={{ fontSize: "30px", fontWeight: "600" }}>
              Order Status
            </div>
            <div className={`d-flex justify-content-between align-items-center ${styles.v_new_addz}`}>
              {/* <div className={`${styles.a_search} ${styles.v_search} m-0`}>
                  <input 
                    type="search" 
                    placeholder="Search by Dish..." 
                    className="search-input" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div> */}
              {/* <div className={`${styles.a_search} ${styles.v_search} me-2`}>
                  <input 
                    type="search" 
                    placeholder="Search by Table Name..." 
                    className="search-input" 
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)} // Update table search query
                  />
                </div> */}
              {/* <div className=' me-4'>
                  <Link to={"/addDiah"}>
                    <button
                      type="button"
                      className={`btn border text-white me-3 ${styles.v_btn_size2}`}
                      style={{ backgroundColor: "#4B6C52" }}
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-white me-2" /> Add New
                    </button>
                  </Link>
                </div> */}
            </div>
          </div>
          <div className={`${styles.m_table} ${styles.x_table} me-5`} style={{ padding: '30px 10px 0px 10px', borderRadius: '5px' }}>
            <table id={styles.orderTable} border="0" width="100%" data-bs-spy="scroll">
              <thead>
                <tr align="center" bgcolor="#F3F3F3" className={styles.m_table_heading}>
                  <td>Table Name</td>
                  <td>Item</td>
                  <td>Name</td>
                  <td>Variants</td>
                  <td>Quantity</td>
                  <td>Order Status</td>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(orders) && orders.map(order => (
                  order.orderDish.map(dish => (
                    <tr key={dish._id} align="center">
                      <td>{order.tableNo || "Unknown"}</td>
                      <td>
                        {dish.dishImage ? (
                          <img
                            src={`http://localhost/avadh_api/images/${dish.dishImage}`}
                            className="p-1 m-1"
                            alt={dish.dish.dishName}
                          />
                        ) : (
                          <span>No Image Available</span>
                        )}
                      </td>
                      <td>{dish.dishName}</td>
                      <td>
                        {dish.variant.length > 0 ? (
                          dish.variant.map(v => v.name).join(", ")
                        ) : (
                          <span style={{ color: 'red' }}>No Variants</span>
                        )}
                      </td>
                      <td>{dish.qty}</td>
                      <td>
                        <button
                          type="button"
                          className={`${styles.btn} ${dish.orderStatus === "Accepted" ? styles.btn_served : dish.orderStatus === "Pending" ? styles.btn_pending : ""}`}
                        >
                          {dish.orderStatus}
                        </button>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div
        className={`modal fade ${styl.m_model_logout}`}
        id="logoutModal"
        tabIndex="-1"
        aria-labelledby="logoutModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className={`modal-content ${styl.m_model_con}`}
            stylee={{ border: "none", backgroundColor: "#f6f6f6" }}
          >
            <div className={styl.m_log}>
              <div className={styl.m_logout}>
                <span>Logout</span>
              </div>
              <div className={styl.m_text}>
                <span>Are You Sure You Want To Logout?</span>
              </div>
              <div className={styl.m_btn_cancel_yes}>
                <div className={styl.m_btn_cancel_logout}>
                  <button data-bs-dismiss="modal">Cancel</button>
                </div>
                <div className={styl.m_btn_yes}>
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
    </section>
  );
};

export default WaiterOrder;