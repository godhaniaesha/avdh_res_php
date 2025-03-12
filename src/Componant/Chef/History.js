import React, { useEffect, useState } from "react";
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import styles from "../../css/ChefMenuList.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ChefNavbar from "./ChefNavbar";
import ChefSidePanel from "./ChefSidePanel";
import { Link, useNavigate } from "react-router-dom";
import style from "../../css/BillPayment.module.css";
import axios from "axios";

export default function History() {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dishIdToDelete, setDishIdToDelete] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [history, setHistory] = useState([])


  const token = localStorage.getItem("authToken");

  const fetchOrder = () => {
    axios.post("http://localhost/avadh_api/chef/history/history.php", {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.data)
          setHistory(response.data.data)
        } else {
          console.error("Expected an array of dishes but received:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching dishes:", error));
  };

  const fetchCategories = () => {
    axios.post("http://localhost/avadh_api/chef/category/view_category.php")
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        setCategories(response.data.category);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };


  const fetchDishes = () => {
    axios.post("http://localhost/avadh_api/chef/dish/view_dish.php")
      .then((response) => {
        if (response.status === 200 && Array.isArray(response.data.dish)) {
          setDishes(response.data.dish);
        } else {
          console.error("Expected an array of dishes but received:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching dishes:", error));
  };

  useEffect(() => {
    // fetchCategories();
    // fetchDishes();
    fetchOrder();
  }, []);

  const toggleDrawer = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const toggleNotifications = () => {
    const panel = document.getElementById("notification-panel");
    panel.style.display =
      panel.style.display === "none" || panel.style.display === ""
        ? "block"
        : "none";
  };


  const handleDeleteClick = (dishId) => {
    setDishIdToDelete(dishId);
    localStorage.setItem("dishIdToDelete", dishId);
  };


  const handleDeleteConfirm = () => {
    const dishId = localStorage.getItem("dishIdToDelete");
    if (dishId) {
      axios
        .delete(`http://localhost:8000/api/deleteDish/${dishId}`)
        .then((response) => {
          if (response.status === 200) {

            fetchDishes();
          }
        })
        .catch((error) => console.error("Error deleting dish:", error));
    }
  };



  const handleEditClick = (dish) => {
    localStorage.setItem("dishId", dish._id);
    localStorage.setItem("dishData", JSON.stringify(dish));
    window.location.href = "/editDish";
  };

  // ... existing code ...
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

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const getSortedHistory = () => {
    const sortedHistory = [...history];

    if (sortOrder === "A") {
      // Sort by Order ID (Ascending)
      return sortedHistory.sort((a, b) => a.id.localeCompare(b.id));
    } else if (sortOrder === "B") {
      return sortedHistory.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortOrder === "C") {
      return sortedHistory.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === "D") {
      return sortedHistory.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOrder === "E") {
      return sortedHistory.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (sortOrder === "F") {
      return sortedHistory.sort((a, b) => b.firstName.localeCompare(a.firstName));
    } else if (sortOrder === "G") {
      return sortedHistory.sort((a, b) => a.totalAmount - b.totalAmount);
    } else if (sortOrder === "H") {
      return sortedHistory.sort((a, b) => b.totalAmount - a.totalAmount);
    } 

    return history;
  };

  return (
    <section id={styles.a_selectTable}>
      <ChefNavbar toggleDrawer={toggleDrawer} showSearch={false} toggleNotifications={toggleNotifications} />
      <ChefSidePanel isOpen={isSidebarOpen} isHistory={true} />

      <div id={styles['a_main-content']}>
        <div className={styles["db_content-container"]}>
          <div className={`container-fluid ${styles.a_main}`}>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="text-nowrap" style={{ fontSize: "30px", fontWeight: "600" }}>
                History
              </div>
              <div className={`d-flex justify-content-between align-items-center ${styles.v_new_addz}`}>
                <div className={`${styles.a_search} ${styles.v_search} m-0`}>
                  <input
                    type="search"
                    placeholder="Search..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="me-3">
                  <select className={styles.v_search1} value={sortOrder} onChange={handleSortChange}>
                    <option value="">Sort by</option>
                    <option value="A">Order ID (A-Z)</option>
                    <option value="B">Order ID (Z-A)</option>
                    <option value="C">Date (Newest First)</option>
                    <option value="D">Date (Oldest First)</option>
                    <option value="E">Customer Name (A-Z)</option>
                    <option value="F">Customer Name (Z-A)</option>
                    <option value="G">Amount (Low to High)</option>
                    <option value="H">Amount (High to Low)</option>
                  </select>
                </div>
                {/* <div>
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
          </div>
          <div className={styles.m_table} style={{ padding: "30px 10px", borderRadius: "5px" }}>
            <table border="0" width="100%" data-bs-spy="scroll">
              <thead>
                <tr align="center" bgcolor="#F3F3F3" className={styles.m_table_heading} >
                  <td className='fw-normal'>Order ID</td>
                  <td className='fw-normal'>Date</td>
                  <td className='fw-normal'>Customer Name</td>
                  <td className='fw-normal'>Amount</td>
                  <td className='fw-normal'>Status</td>
                </tr>
              </thead>
              <tbody>
                {getSortedHistory().map((history) => (
                  <tr key={history.id} align="center">
                    <td className="text-center">
                      {history.id}
                    </td>
                    <td className="text-center">{new Date(history.createdAt).toLocaleDateString("en-GB")}</td>
                    <td className="text-center">
                      {history.firstName}
                    </td>
                    <td className="text-center">₹ {history.totalAmount}</td>
                    <td className={history.orderStatus === "Accepted" ? "text-success" : "text-danger"}>
                      {history.orderStatus}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            {/* Modal for delete confirmation */}
            <div
              className="modal fade"
              id="exampleModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content" style={{ border: "none", backgroundColor: "#f6f6f6" }}>
                  <div className="modal-body">
                    <div className="text-center">
                      <div style={{ fontSize: "35px", fontWeight: "700", marginBottom: "20px" }}>
                        Delete
                      </div>
                      <div style={{ fontSize: "22px", fontWeight: "600", marginBottom: "35px" }}>
                        Are You Sure You Want To Delete?
                      </div>
                      <div className="d-flex justify-content-center align-items-center my-3">
                        <button type="button" className="btn border-secondary border mx-3" data-bs-dismiss="modal">
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn border text-white"
                          style={{ backgroundColor: "#4B6C52" }}
                          onClick={handleDeleteConfirm}
                          data-bs-dismiss="modal"
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
  )
}
