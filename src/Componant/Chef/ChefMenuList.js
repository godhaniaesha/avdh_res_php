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

function ChefMenuList() {
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dishIdToDelete, setDishIdToDelete] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();



  const fetchCategories = () => {
    axios.post("http://localhost/avadh_api/chef/category/view_category.php")
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        setCategories(response.data.categories);
        // console.log(response.data.categories)
      })
      .catch((error) => console.error("Error fetching categories:", error));
  };


  const fetchDishes = () => {
    axios.post("http://localhost/avadh_api/chef/dish/view_dish.php")
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data.data)
          setDishes(response.data.data)
        } else {
          console.error("Expected an array of dishes but received:", response.data);
        }
      })
      .catch((error) => console.error("Error fetching dishes:", error));
  };

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
    // localStorage.setItem("dishIdToDelete", dishId);
  };


  const handleDeleteConfirm = () => {
    // const dishId = localStorage.getItem("dishIdToDelete");
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("dish_id", dishIdToDelete);
    if (dishIdToDelete) {
      axios
        .post(`http://localhost/avadh_api/chef/dish/delete_dish.php`,formData, {
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer token for authorization
          },
        })
        .then((response) => {
          if (response.status === 200) {

            fetchDishes();
          }
        })
        .catch((error) => console.error("Error deleting dish:", error));
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchDishes();
  }, []);

  const handleEditClick = (dish) => {
    localStorage.setItem("dishId", dish.id);
    localStorage.setItem("dishData", JSON.stringify(dish));
    window.location.href = "/editDish";
  };

  // ... existing code ...

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

  const getSortedDishes = () => {
    const filteredDishes = dishes.filter(dish =>
      dish.dishName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortOrder === "A") {
      return [...filteredDishes].sort((a, b) => a.dishName.localeCompare(b.dishName));
    } else if (sortOrder === "B") {
      return [...filteredDishes].sort((a, b) => b.dishName.localeCompare(a.dishName));
    } else if (sortOrder === "C") {
      return [...filteredDishes].sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortOrder === "D") {
      return [...filteredDishes].sort((a, b) => a.status.localeCompare(b.status));
    } else if (sortOrder === "E") {
      return [...filteredDishes].sort((a, b) => {
        const categoryA = categories.find(category => category._id === a.dishCategory)?.categoryName || "";
        const categoryB = categories.find(category => category._id === b.dishCategory)?.categoryName || "";
        return categoryA.localeCompare(categoryB);
      });
    } else if (sortOrder === "F") {
      return [...filteredDishes].sort((a, b) => {
        const categoryA = categories.find(category => category._id === a.dishCategory)?.categoryName || "";
        const categoryB = categories.find(category => category._id === b.dishCategory)?.categoryName || "";
        return categoryB.localeCompare(categoryA);
      });
    }
    return filteredDishes;
  };

  return (
    <section id={styles.a_selectTable}>
      <ChefNavbar toggleDrawer={toggleDrawer} showSearch={false} toggleNotifications={toggleNotifications} />
      <ChefSidePanel isOpen={isSidebarOpen} isChefMenu={true} />

      <div id={styles['a_main-content']}>
        <div className={styles["db_content-container"]}>
          <div className={`container-fluid ${styles.a_main}`}>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="text-nowrap" style={{ fontSize: "30px", fontWeight: "600" }}>
                Dish List
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
                <div>
                  <select className={styles.v_search1} value={sortOrder} onChange={handleSortChange}>
                    <option value="">Sort by</option>
                    <option value="A">Name A-Z</option>
                    <option value="B">Name Z-A</option>
                    <option value="E">Category A-Z</option>
                    <option value="F">Category Z-A</option>
                    <option value="C">Price</option>
                    <option value="D">Status</option>

                  </select>
                </div>
                <div>
                  <Link to={"/addDiah"}>
                    <button
                      type="button"
                      className={`btn border text-white me-3 ${styles.v_btn_size2}`}
                      style={{ backgroundColor: "#4B6C52" }}
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-white me-2" /> Add New
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.m_table} style={{ padding: "30px 10px", borderRadius: "5px" }}>
            <table border="0" width="100%" data-bs-spy="scroll">
              <thead>
                <tr align="center" bgcolor="#F3F3F3" className={styles.m_table_heading} >
                  <td className='fw-normal'>Image</td>
                  <td className='fw-normal'>Name</td>
                  <td className='fw-normal'>Category</td>
                  <td className='fw-normal'>Price</td>
                  <td className='fw-normal'>Status</td>
                  <td className='fw-normal'>Action</td>
                </tr>
              </thead>
              <tbody>
                {getSortedDishes().map((dish) => (
                  <tr key={dish.id} align="center">
                    <td className="text-center">
                      <img
                        src={`http://localhost/avadh_api/images/${dish.dishImage}`}
                        className={styles.v_menu_rowmar}
                        alt="Dish"
                      />
                    </td>
                    <td className="text-center">{dish.dishName}</td>
                    <td className="text-center">
                      {
                        categories.find(category => String(category.id) === String(dish.dishCategory))?.categoryName
                      }
                    </td>
                    <td className="text-center">₹ {dish.sellingPrice}</td>
                    <td className={dish.status === "Available" ? "text-success" : "text-danger"}>
                      {dish.status}
                    </td>
                    <td>
                      <div className={styles.m_table_icon}>


                        <div className={styles.m_pencile}>
                          <Link to={"/editDish"} onClick={() => handleEditClick(dish)} >
                            <button aria-label="Edit Chef" className={`${styles['delete-button']} ${styles.v_btn_edit}`}>
                              <i className="fa-solid fa-pencil"></i>
                            </button>
                          </Link>
                        </div>

                        <div className={styles.m_trash}>
                          <button
                            className={`${styles['delete-button']} ${styles.v_btn_edit}`}
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            onClick={() => handleDeleteClick(dish.id)}
                          >
                            <i className="fa-regular fa-trash-can"></i>
                          </button>
                        </div>
                      </div>
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
  );
}

export default ChefMenuList;