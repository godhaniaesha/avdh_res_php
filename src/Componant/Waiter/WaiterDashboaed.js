import React, { useEffect, useState,useRef } from "react";
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import "bootstrap/dist/css/bootstrap.min.css";
import WaiterNavbar from "./WaiterNavbar";
import WaiterSidePanel from "./WaiterSidePanel";
import { Link } from "react-router-dom";
import styles from "../../css/WaiterDashboaed.module.css";
import "owl.carousel";
import axios from "axios";
import styl from "../../css/BillPayment.module.css";

function WaiterDashboaed(props) {
  const [waiterName, setWaiterName] = useState("");
  const [categories, setCategories] = useState([]);
  const [dishesData, setdishesData] = useState([]);
  let token;
  // Hardcoded dishes data
  // const dishesData = [
  //   {
  //     id: 1,
  //     name: "Spaghetti",
  //     price: "₹7.29",
  //     image: "Spaghetti.png",
  //     rating: 3,
  //   },
  //   {
  //     id: 2,
  //     name: "Vegetable Pizza",
  //     price: "₹5.49",
  //     image: "Vegetable Pizza.png",
  //     rating: 4,
  //   },
  //   {
  //     id: 3,
  //     name: "Mushroom Pizza",
  //     price: "₹7.29",
  //     image: "Mushroom Pizza.png",
  //     rating: 5,
  //   },
  //   { id: 4, name: "Sweets", price: "₹7.29", image: "Sweets.png", rating: 4 },
  // ];

  useEffect(() => {
    // alert('');
    // const loggedInUser = localStorage.getItem("loggedInUser");
    // fetch("http://localhost:209/Waiters")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     const matchingWaiter = data.find(
    //       (waiter) => waiter.email === loggedInUser
    //     );
    //     if (matchingWaiter) {
    //       localStorage.setItem("loginWaiterId", matchingWaiter.id);
    //       setWaiterName(matchingWaiter.firstName);
    //     }
    //   })
      // .catch((error) => console.error("Error:", error));
    token = localStorage.getItem("authToken");
    // console.log(token1);
    // setToken(token1);
    fetchCategories();
  }, []);
  

  const carouselRef = useRef(null);
  useEffect(() => {
    const $ = window.$;
    if (window.$ && window.$.fn.owlCarousel && dishesData.length > 0) {
      // Destroy existing carousel if it exists
      if ($(carouselRef.current).data('owl.carousel')) {
        $(carouselRef.current).owlCarousel('destroy');
      }

      // Initialize Owl Carousel
      $(carouselRef.current).owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: false,
        responsive: {
          0: { items: 1 },
          425: { items: 2 },
          650: { items: 3 },
          769: { items: 2 },
          998: { items: 3 },
          1350: { items: 4 },
          1600: { items: 5 },
          1850: { items: 6 },
        },
      });
    }

    // Cleanup function
    return () => {
      if (carouselRef.current && $(carouselRef.current).data('owl.carousel')) {
        $(carouselRef.current).owlCarousel('destroy');
      }
    };
  }, [dishesData]);

  useEffect(() => {
    const $ = window.$;
    // Initialize Owl Carousel for categories after categories are fetched
    if (categories.length > 0) {
      $(".a_categorySlider").owlCarousel({
        loop: true,
        margin: 19,
        nav: false,
        dots: false,
        responsive: {
          0: {
            items: 2,
          },
          500: {
            items: 3,
          },
          678: {
            items: 4,
          },
          769: {
            items: 3,
          },
          998: {
            items: 4,
          },
          1200: {
            items: 5,
          },
          1440: {
            items: 6,
          },
          1600: {
            items: 7,
          },
          1850: {
            items: 9,
          },
        },
      });
    }
  }, [categories]);
   const fetchCategories = async () => {
    // console.log('token', token);
    // try {
    const response = await axios.post("http://localhost/avadh_api/chef/category/view_category.php", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // if (!response.ok){ throw new Error("Failed to fetch categories")};


    // const data = await response.json();
    console.log('hey', response.data.categories);
    setCategories(response.data.categories);
    fetchDishes()
  };
  const fetchDishes = async () => {
    console.log('fetch dishes called');
    console.log('token', token);

    const response = await axios.post("http://localhost/avadh_api/chef/dish/view_dish.php", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('response', response);
    setdishesData(response?.data?.data)
  }

  const toggleDrawer = () => {
    document.getElementById("a_drawer").classList.toggle("open");
  };

  const toggleNotifications = () => {
    const panel = document.getElementById("notification-panel");
    panel.style.display =
      panel.style.display === "none" || panel.style.display === ""
        ? "block"
        : "none";
  };

  return (
    <section id="a_selectTable">
      <WaiterNavbar
        toggleDrawer={toggleDrawer}
        toggleNotifications={toggleNotifications}
        waiterName={waiterName}
      />
      <WaiterSidePanel iswaiterdashboard={true} />

      <div id={styles["a_main-content"]}>
        <div className={`container-fluid ${styles.a_main}`}>
          <div className={`${styles.a_newOrder} d-flex justify-content-end`}>
            <Link to={"/Select_Table"}>
              <button type="button" className="btn">
                <i className="fa-solid fa-plus text-white"></i> New Order
              </button>
            </Link>
          </div>

          <div className={styles.a_category}>
            <div className="d-flex justify-content-between">
              <h3 className={styles.a_title}>Category</h3>
              <p>View all</p>
            </div>
            <div className={`owl-carousel owl-theme d-block a_categorySlider ${styles.a_categorySlider1}`}>
              {categories.map((category) => (
                <div className={`item ${styles.item}`} key={category.id}>
                  <div className={styles.a_slide}>
                    <div className={styles.a_img}>
                      <img
                        src={category?.categoryImage ? `http://localhost/avadh_api/images/${category.categoryImage}` : ''}
                        alt={category.categoryName}
                      />
                    </div>
                    <p className={styles.catName}>{category.categoryName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Updated Popular Dishes Section without Swiper */}
          <div className={styles.a_dish}>
            <div className="d-flex justify-content-between">
              <h3 className={styles.a_title}>Popular Dishes</h3>
              <p>View all</p>
            </div>
            <div
              ref={carouselRef}
              className={`owl-carousel owl-theme d-block a_dishSlider ${styles.a_dishSlider}`}
            >
              {dishesData.map((dish) => (
                <div className={`item ${styles.item}`} key={dish.id}>
                  <div className={styles.a_dslide}>
                    <div className={styles.a_img}>
                      <img
                        src={dish?.dishImage ? `http://localhost/avadh_api/images/${dish?.dishImage}` : ''}
                        alt={dish?.dishName}
                      />
                    </div>
                    <p>{dish.dishName}</p>
                    {dish?.rating && (
                      <div className={`${styles.a_rating} d-flex g-2`}>
                        {[...Array(5)].map((_, index) => (
                          <i
                            key={index}
                            className={
                              index < dish?.rating
                                ? "fa-solid fa-star"
                                : "fa-regular fa-star"
                            }
                          ></i>
                        ))}
                      </div>
                    )}

                    <div className={`${styles.a_price} d-flex justify-content-between`}>
                      <p>₹ {dish.sellingPrice}</p>
                      <button>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Change Password Modal */}
     
      

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
                  <button data-bs-dismiss="modal">Cancel</button>
                </div>
                <div className={styles.m_btn_yes}>
                  <button>Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WaiterDashboaed;