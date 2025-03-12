import React, { useEffect, useState } from "react";
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

import WaiterNavbar from "./WaiterNavbar";
import WaiterSidePanel from "./WaiterSidePanel";
import "bootstrap/dist/css/bootstrap.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import styles from "../../css/WaiterMenu.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styl from "../../css/BillPayment.module.css"; // Import styles for the modal

function WaiterMenu() {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  // const [variants, setVariants] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [orderItems, setOrderItems] = useState([]);
  const [isOrderListOpen, setIsOrderListOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [variants, setVariants] = useState([]);
  const [variantsData, setVariantsData] = useState([]);
  const [selectedDishName, setSelectedDishName] = useState("");
  const [selectedDishId, setSelectedDishId] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [tableName, setTableName] = useState('');
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  let token;

  useEffect(() => {
    token = localStorage.getItem("authToken");

    fetchCategories();
    fetchDishes();
    fetchvariants();
    console.log("setOrderItems", orderItems);
  }, []);

  useEffect(() => {
    const storedTableId = localStorage.getItem('tableId');
    if (storedTableId) {
      fetchTableName(storedTableId);
    }
  }, []);

  useEffect(() => {
    const $ = window.$;
    if (categories.length > 0) {
      $(".a_categorySlider").owlCarousel({
        loop: false,
        margin: 19,
        nav: false,
        dots: false,
        responsive: {
          0: { items: 2 },
          500: { items: 3 },
          678: { items: 4 },
          769: { items: 3 },
          998: { items: 4 },
          1200: { items: 5 },
          1440: { items: 6 },
          1600: { items: 7 },
          1850: { items: 9 },
        },
      });
    }
  }, [categories]);

  const fetchTableName = async (tableId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/getTable/${tableId}`);
      console.log("response.data.table", response.data.table);
      console.log("response.data.tableName", response.data.table.tableName);

      if (response.data && response.data.table.tableName) {
        setTableName(response.data.table.tableName);
      } else {
        console.error("Table name not found in response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching table name:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.post("http://localhost/avadh_api/chef/category/view_category.php", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // if (!response.ok) throw new Error("Failed to fetch categories");
      // const data = await response.json();
      // if (Array.isArray(data.category)) {
      setCategories(response.data.categories);
      // } else {
      //   console.error("Fetched data is not an array:", data.category);
      //   setCategories([]);
      // }
      fetchDishes()
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchDishes = async () => {
    try {
      const response = await axios.post("http://localhost/avadh_api/chef/dish/view_dish.php", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // if (!response.ok) throw new Error("Failed to fetch dishes");
      // const data = await response.json();
      // console.log("Fetched dishes data:", data);
      // if (Array.isArray(data.dish)) {
      // console.log("Dishes fetched",response.data.data)



      setDishes(response?.data?.data);
      // } else {
      // console.error("Fetched dishes data is not an array:", data.dish);
      // setDishes([]);
      // }
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  };

  const fetchvariants = async (categoryId) => {
    token = localStorage.getItem("authToken");
    try {
      const formData = new FormData();
      // formData.append("cat_id", categoryId);
      const response = await axios.post(
        `http://localhost/avadh_api/chef/variant/view_variant.php`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("VARIANTS fetched", response.data.variants);
      setVariants(response.data.variants);
      // setDishes(response?.data?.data);
    } catch (error) {
      console.error("Error fetching dishes by category:", error);
    }
  };

  const fetchDishesByCategory = async (categoryId) => {
    token = localStorage.getItem("authToken");
    try {
      const formData = new FormData();
      formData.append("cat_id", categoryId);
      const response = await axios.post(
        `http://localhost/avadh_api/waiter/cat_dish_fetch/cat_dish.php`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Dishes fetched", response);
      setDishes(response?.data?.data);
    } catch (error) {
      console.error("Error fetching dishes by category:", error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    fetchDishesByCategory(categoryId);
  };

  // const toggleDrawer = () => {
  //   document.getElementById("a_drawer").classList.toggle("open");
  // };

  const toggleDrawer = () => {
    setIsSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    console.log("Updated orderItems:", orderItems);
  }, [orderItems]);
  const handleAddToOrder = (dish, variants) => {
    if (!dish) {
      console.error("Dish is undefined. Cannot add to order.");
      return;
    }

    const totalVariantPrice = variants.reduce((total, variant) => total + parseFloat(variant.Price), 0);

    if (dish.sellingPrice === undefined) {
      console.error("Dish sellingPrice is undefined for dish:", dish);
      return;
    }

    const newTotalPrice = parseFloat(dish.sellingPrice) + totalVariantPrice;

    setOrderItems(prevOrderItems => {
      const updatedOrderItems = [...prevOrderItems, { ...dish, variants, totalPrice: newTotalPrice, quantity: 1 }];
      return updatedOrderItems;
    });

    setTotalPrice(prev => Number(prev) + newTotalPrice);
    setTotalItems(prev => prev + 1);
  };

  const toggleAddbtn = () => {
    setIsOrderListOpen(false);
  }

  const toggleOrderList = () => {
    setIsOrderListOpen((prev) => !prev);
    setIsPopupOpen(false);
  };

  const toggleAddVariant = async (dishId) => {
    console.log("dishId", dishId);
    const selectedDish = dishes.find(dish => dish.id === dishId);
    console.log("selectedDish", selectedDish);
    if (selectedDish) {
      setSelectedDishName(selectedDish.dishName);
      console.log("selectedDishName", selectedDishName);
      var variantfilter = variants.filter(variant => variant.dish.id === parseInt(dishId));
      console.log("variantfilter", variantfilter);
      setVariantsData(variantfilter);
    }

    setSelectedDishId(dishId);
    setIsPopupOpen(prev => !prev);
    setSelectedVariants([]);

  
  };

  const handleVariantSelection = (variantId) => {
    setSelectedVariants((prev) => {
      if (prev.includes(variantId)) {
        return prev.filter(id => id !== variantId);
      } else {
        return [...prev, variantId];
      }
    });
  };

  const addItemToOrder = () => {
    console.log("Adding", selectedVariants);
    const selectedDish = dishes.find(dish => dish.id === selectedDishId);
    if (!selectedDish) {
      console.error("Selected dish not found for id:", selectedDishId);
      return;
    }
    const selectedVariantDetails = variants.filter(variant => selectedVariants.includes(variant.id));
    handleAddToOrder(selectedDish, selectedVariantDetails);
    toggleOrderList();
  };

  let isUpdating = false; // Flag to prevent multiple updates

  const updateQuantity = (index, change) => {
    if (isUpdating) return; // Prevent further execution if already updating
    isUpdating = true; // Set the flag to true

    setOrderItems((prev) => {
      const updatedItems = [...prev];
      const currentItem = updatedItems[index];

      const newQuantity = currentItem.quantity + change;

      if (newQuantity < 1) {
        isUpdating = false; // Reset the flag before returning
        return prev; // Prevent quantity from going below 1
      }

      currentItem.quantity = newQuantity;

      const totalVariantPrice = currentItem.variants.reduce((total, variant) => total + parseFloat(variant.Price), 0);
      currentItem.totalPrice = (parseFloat(currentItem.sellingPrice) + totalVariantPrice) * currentItem.quantity;

      const newTotalPrice = updatedItems.reduce((total, item) => total + item.totalPrice, 0);
      setTotalPrice(newTotalPrice);
      setTotalItems(updatedItems.reduce((total, item) => total + item.quantity, 0));

      isUpdating = false;
      return updatedItems;
    });
  };

  const removeItemFromOrder = (index) => {
    setOrderItems((prev) => {
      const updatedOrderItems = prev.filter((_, i) => i !== index);
      const newTotalPrice = updatedOrderItems.reduce((total, item) => total + item.totalPrice, 0);
      const newTotalItems = updatedOrderItems.length;
      setTotalPrice(newTotalPrice);
      setTotalItems(newTotalItems);
      return updatedOrderItems;
    });
  };

  const handleOrderSend = async () => {
    token = localStorage.getItem("authToken");
    // Get the email value from the input field
    const email = document.getElementById("email").value;
    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const contactno = document.getElementById("contactno").value;
    console.log("Email", email, firstName, lastName, contactno);

    if (firstName && lastName && contactno && contactno) {
      try {
        // Retrieve the table ID from local storage
        const tableId = localStorage.getItem("tableId");
        // Calculate the total price of the order
        const totalPrice = calculateTotalOrderPrice();

        // Prepare the order data in the required format
        const orderData = {
          email: email, // Include the email in the order data
          firstName: firstName,
          lastName: lastName,
          phone: contactno, 
          tableNo: tableId, // Include the table ID
          orderDish: orderItems.map(item => ({
            dish: item.id, // Get the dish ID
            variant: item.variants.map(variant => variant.id), // Get the variant IDs
            qty: item.quantity // Get the quantity
          })),
          totalAmount: totalPrice, // Total price of the order
          orderStatus: "Pending", // Set the order status
          paymentStatus: "Unpaid" // Set the payment status
        };
        const formData = new FormData();
        formData.append("tableNo", orderData.tableNo);
        formData.append("email", orderData.email);
        formData.append("firstName", orderData.firstName);
        formData.append("lastName", orderData.lastName);
        formData.append("phone", orderData.phone);

        // Append order dishes in the required format
        orderData.orderDish.forEach(item => {
          formData.append("dish_id[]", item.dish);
          formData.append("quantity[]", item.qty);
          if(item?.variant.length > 0 ){
            formData.append("varaints_id[]", item.variant); // Stored as a comma-separated string
          }
        });
        console.log("Order Data to be Sent:", orderData); // Debugging: Check the structure of your orderData

        // Make the POST request to create the order
        const response = await axios.post("http://localhost/avadh_api/waiter/order/add_order.php", formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

        console.log('Order Data', response);
        navigate('/waiter_order');
     
      } catch (error) {
        console.error("Error while sending order:", error);
        if (error.response) {
          console.error("Backend Error Data:", error.response.data); // Log any backend error data
        }
      }
    }
    else {
      alert("Please enter your customer detail");
    }
  };
  const calculateTotalOrderPrice = () => {
    return orderItems.reduce((total, item) => {
      const itemTotalPrice = parseFloat(item.sellingPrice) + item.variants.reduce((variantTotal, variant) => variantTotal + parseFloat(variant.price), 0);
      return total + itemTotalPrice * item.quantity;
    }, 0);
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

    // window.history.pushState(null, '', window.location.href);
  };

  const debounce = (func, delay) => {
    let timeoutId;
    // console.log(func)
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedUpdateQuantity = debounce(updateQuantity, 300);

  

  // Filter dishes based on the search query
  const filteredDishes = dishes.filter(dish =>
    dish.dishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get unique category IDs from both default categories and filtered dishes
  const uniqueCategoryIds = new Set([
    ...categories.map(cat => cat._id), // Default categories
    ...filteredDishes.map(dish => dish.categoryId) // Categories from filtered dishes
  ]);

  // Convert Set back to an array to use in rendering
  const uniqueCategories = Array.from(uniqueCategoryIds)
    .map(id => categories.find(cat => cat._id === id))
    .filter(Boolean); // Filter out any undefined categories

  return (
    <section id={styles.a_selectTable}>
      <WaiterNavbar toggleDrawer={toggleDrawer} showSearch={false} />
      <WaiterSidePanel isOpen={isSidebarOpen} iswaiterdashboard={false} iswaitermenu={true} />

      <div id={styles["a_main-content"]}>
        <div className={`container-fluid ${styles.a_main}`}>
          <div className={`${styles.a_newOrder} d-flex justify-content-end`}>
            <div className={`${styles.a_search} ${styles.v_search} me-2`}>
              <input
                type="search"
                placeholder="Search by Dish Name..."
                className="search-input"
                value={searchQuery} // Bind the input to searchQuery
                onChange={(e) => { setSearchQuery(e.target.value) }} // Update searchQuery on input change
              />
            </div>
            <a>
              <button
                type="button"
                className="btn"
                onClick={() => toggleOrderList()}
              >
                Order List
              </button>
            </a>
          </div>

          <div className={styles.a_category}>
            <div className="d-flex justify-content-between">
              <h3 className={styles.a_title}>Category</h3>
            </div>
            <div className={`owl-carousel owl-theme d-block a_categorySlider ${styles.a_categorySlider1}`}>
              {categories.map((category) => (
                <div className={`item ${styles.item}`} key={category.id} onClick={() => handleCategoryClick(category.id)}>
                  <div className={` ${styles.a_slide}`} style={selectedCategoryId == category.id ? { backgroundColor: '#4B6C52', color: 'white' } : {}}>
                    <div className={styles.a_img}>
                      <img
                        src={category?.categoryImage ? `http://localhost/avadh_api/images/${category.categoryImage}` : ''}
                        alt={category.categoryName}
                      />
                    </div>
                    <p className={styles.catName} style={selectedCategoryId == category.id ? { color: 'white' } : {}}>{category.categoryName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.a_subcategory}>
            <div className="d-flex justify-content-between">
              <h3 className={styles.a_title}>All Dishes</h3>
            </div>
            <div className={`${styles.a_listsubCategory} row row-cols`} id="cat">
              {filteredDishes.map((dish) => (
                <div className={styles.a_card_category} key={dish.id}>
                  <div className={`${styles.a_img} d-flex justify-content-center`}>
                    <img
                      src={dish?.dishImage ? `http://localhost/avadh_api/images/${dish?.dishImage}` : ''}
                      alt={dish?.dishName}
                    />
                  </div>
                  <div className={`${styles.a_rating} d-flex g-2`}>
                    {[...Array(5)].map((_, index) => (
                      <i key={index} className={index < dish.rating ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                    ))}
                  </div>
                  <p>{dish.dishName}</p>
                  <div className={`${styles.a_price} d-flex justify-content-between`}>
                    <p>₹ {parseFloat(dish.sellingPrice).toFixed(2)}</p>
                    <button
                      type="button"
                      className="btn"
                      onClick={() => toggleAddVariant(dish.id)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <form action="">
        <div className={`${styles.a_orderList} ${isOrderListOpen ? styles.open : ''}`} id="a_orderList">
          <div className={`${styles['a_list-header']} position-relative`}>
            <div className={styles.a_addItems} onClick={toggleAddbtn}>
              <button>+</button>
              <p>Add Items</p>
            </div>
            <h2>Order List ({tableName || '01'})</h2>
            {/* <div className="">
              <input type="email" name="email" id="email" className="form-control w-100" placeholder="Enter User's Email" required />
            </div> */}
            <form className="x_formc">
              <div className="row mb-3">
                <div className="col-md-6 col-12 mb-md-0 mb-3">
                  <label className={`${styles['x_lab']}`} >First Name</label><br />
                  <input type="text" className={`${styles['x_fcon']}  w-100`} id="firstname" />
                </div>
                <div className="col-md-6 col-12  mb-md-0">
                  <label className={`${styles['x_lab']}`} >Last Name</label><br />
                  <input type="text" className={`${styles['x_fcon']} w-100 `} id="lastname" />
                </div>
              </div>
              <div className="mb-3">
                <label className={`${styles['x_lab']}`} >Email ID</label><br />
                <input type="email" className={`${styles['x_fcon']}  w-100 `} id="email" />
              </div>
              <div className="mb-3">
                <label className={`${styles['x_lab']}`} >Contact No.</label><br />
                <input type="tel" className={`${styles['x_fcon']}  w-100 `} id="contactno" />
              </div>
            </form>
          </div>
          <div className={styles.a_listBody}>
            {orderItems.map((item, index) => (
              <div className={`${styles.a_order} d-flex mt-3`} key={index}>
                <div className={styles.a_orderImg}>
                  <img src={`http://localhost/avadh_api/images/${item.dishImage}`} alt={item.dishName} />
                </div>
                <div className={styles.a_orderdata}>
                  <div className="text-dark">
                    {item.variants.length > 0 &&
                      `+ ${item.variants.map(v => `₹${parseFloat(v.price).toFixed(2)} ${v.variantName}`).join(', ')}`}
                  </div>
                  <h3>{item.dishName}</h3>
                  <p>₹ {(parseFloat(item.sellingPrice) + item.variants.reduce((total, variant) => total + parseFloat(variant.price), 0)).toFixed(2)}</p>
                  <div className={`${styles.a_orderqd} d-flex justify-content-between align-items-center`}>
                    <div className={`${styles.a_ordercounter} d-flex align-items-center`}>
                      <button
                        type="button"
                        className={styles['quantity-btn']}
                        onClick={(e) => {
                          e.stopPropagation();
                          debouncedUpdateQuantity(index, -0.5);
                        }}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        className={styles['quantity-btn']}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent event bubbling
                          debouncedUpdateQuantity(index, 0.5);
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div onClick={() => removeItemFromOrder(index)}>
                      <i className="fa-regular fa-trash-can"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white ">
            <div className={styles.a_ordersummry}>
              <div className={styles['summary-item']}>Total Items: {totalItems}</div>
              <div className={styles['summary-item']}>Total Price: ₹ {calculateTotalOrderPrice().toFixed(2)}</div>
            </div>

            <div className={styles.a_orderSend}>
              <button type="submit" id="btn_order" className={styles['a_add-item-btn']} onClick={handleOrderSend}>
                <span className="text-white">
                  <Link to="#" className="text-white text-decoration-none">Order Send</Link>
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {isPopupOpen && <div className={styles.a_overlay} id={styles.overlay} onClick={toggleAddVariant}></div>}

      {isPopupOpen && (
        <div className={styles.a_popup} id="a_popup">
          {/* Popup Header */}
          <div className={styles['a_popup-header']}>
            <div>
              <h2><span id="ae_pro">{selectedDishName}</span> Customization</h2>
              <p className={styles['a_customize-text']}>Customize</p>
            </div>
            {/* Close button */}
            <button className={styles['a_close-btn']} onClick={toggleAddVariant}>&times;</button>
          </div>

          {/* Customization Options */}
          <div className={styles['a_customization']}>
            <p>Customization</p>
            <div className="d-flex">
              <div id={styles.a_cust}>
                <div className="d-flex  flex-column w-100 mt-2 overflow-auto">
                  {/* Mapping through variants to display each option */}
                  {variantsData.map(variant => (
                    <div className="d-flex  justify-content-between align-items-center mt-2 " key={variant._id}>
                      <div className="d-flex align-items-center">
                        {/* Display variant image and name */}
                        <img
                          src={`http://localhost/avadh_api/images/${variant.variantImage}`}
                          alt={variant.variantName}
                          className={styles['a_option-img']}
                        />
                        <label className="text-nowrap">{variant.variantName}</label>
                      </div>
                      <div className="d-flex justify-content-end align-items-center ms-3  flex-nowrap">
                        {/* Display variant price */}
                        <span className={`${styles['a_option-price']} text-nowrap mb-0`}>+ ₹ {parseFloat(variant.price).toFixed(2)}</span>
                        {/* Checkbox for variant selection */}
                        <input
                          type="checkbox"
                          id={`a_${variant._id}`} // Unique ID for each checkbox
                          className={styles['a_option-checkbox']}
                          onChange={() => handleVariantSelection(variant.id)}
                        />
                        <div className={styles.circle}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Add Item Button */}
            <div className="text-center p-4">
              <button className={styles['a_add-item-btn']} id="a_add-item-btn" onClick={addItemToOrder}>
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      

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

export default WaiterMenu;