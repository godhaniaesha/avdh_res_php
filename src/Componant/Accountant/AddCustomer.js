import React, { useEffect, useState } from "react";
import bootstrap from  'bootstrap/dist/js/bootstrap.bundle.min.js';

import styles from "../../css/AddCustomer.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";
import SidePanel from "./SidePanel";
import axios, { Axios } from "axios";
import { useNavigate } from "react-router-dom";
import styl from "../../css/BillPayment.module.css";


function AddCustomer() {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const clearForm = () => {
    document.getElementById("add_customer").reset();
  };

  const addCustomer = async (event) => {
    event.preventDefault();

    try {
      const firstName = document.getElementById("fname").value.trim();
      const lastName = document.getElementById("lname").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const city = document.getElementById("city").value;
      const state = document.getElementById("state").value;
      const country = document.getElementById("country").value;
      const date = document.getElementById("cvdate").value;
      const billAmount = document.getElementById("ammount").value;

      const customerData = {
        firstName,
        lastName,
        email,
        phone,
        city,
        state,
        country,
        date,
        billAmount,

      };

      console.log("Customer Data:", customerData);

      const token = localStorage.getItem('authToken');
      console.log("Token:", token);

      const response = await axios.post("http://localhost:8000/api/cerateCustomer", customerData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      console.log("Response:", response);

      if (response.status === 200) {
        console.log("Customer added successfully!");
        clearForm();
        setShowSuccessModal(true);
      } else {
        throw new Error("Failed to add customer");
      }

    } catch (error) {
      console.error("Error adding customer:", error.response ? error.response.data : error.message);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  
  
  return (
    <section id="a_selectTable">
      <Navbar toggleDrawer={toggleDrawer} showSearch={false} />
      <SidePanel isOpen={isSidebarOpen} isCustomerPage={true} />
      <div id={styles["a_main-content"]}>
        <div className={`container-fluid ${styles.a_main}`}>
          <div className={`${styles.m_add}`}>
            <span>Add Customer</span>
          </div>
        </div>
        <form id="add_customer" className={styles.m_add_chef} onSubmit={addCustomer}>
          <div className={`row d-flex ${styles.m_add_input} ${styles.m_chef_details}`}>


            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
              <div className={`input-group ${styles.m_add_input_mar}`}>
                <input
                  className="form-control"
                  type="text"
                  placeholder="First Name"
                  id="fname"
                  required
                />
              </div>
            </div>
            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
              <div className={`input-group ${styles.m_add_input_mar} ${styles.m_option} `}
              >
                <input
                  className="form-control"
                  type="text"
                  placeholder="Last Name"
                  id="lname"
                  required
                />
              </div>

            </div>
            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
              <div className={`input-group ${styles.m_add_input_mar}`}>
                <input className="form-control"
                  type="email" placeholder="Email" id="email" required />
              </div>
            </div>
            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
              <div className={`input-group ${styles.m_add_input_mar} ${styles.m_option}`}
              >
                <input
                  className="form-control"
                  type="text"
                  placeholder="Phone"
                  id="phone"
                  maxLength="10"
                  required
                />
              </div>

            </div>
            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
              <div className={`input-group ${styles.m_add_input_mar} `}>
                <input className="form-control"
                  type="date" placeholder="Date" id="cvdate" required />
              </div>
            </div>
            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
              <div className={`input-group ${styles.m_add_input_mar} ${styles.m_option}`}
              >
                <input
                  className="form-control"
                  type="text"
                  placeholder="Bill Amount"
                  id="ammount"
                  maxLength="10"
                  required
                />
              </div>
            </div>
            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
              <div className={`input-group ${styles.m_add_input_mar} `}>
                <select id="city" className="form-control" required>
                  <option disabled selected>
                    City
                  </option>
                  <option value="Surat">Surat</option>
                  <option value="Vapi">Vapi</option>
                  <option value="Baroda">Baroda</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
              </div>
            </div>
            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
              <div className={`input-group ${styles.m_add_input_mar} ${styles.m_option} `}
              >
                <select id="state" className="form-control" required>
                  <option disabled selected>
                    State
                  </option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                </select>
              </div>
            </div>
            <div className={`col-xs-12 col-md-6 ${styles.m_add_input_pad}`}>
              <div className={`input-group ${styles.m_add_input_mar} `}>
                <select id="country" className="form-control" required>
                  <option disabled selected>
                    Country
                  </option>
                  <option value="India">India</option>
                  <option value="China">China</option>
                  <option value="Japan">Japan</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
            </div>
            <div className={styles.m_btn_clear_save}>
              <div className={styles.m_btn_clear}>
                <button type="button" onClick={clearForm}>
                  <i className="fa-solid fa-eraser"></i>Clear
                </button>
              </div>
              <div className={styles.m_btn_save}>
                <button type="submit">
                  <i className="fa-regular fa-floppy-disk"></i>Save
                </button>
              </div>
            </div>
          </div>
        </form>


        {/* Add Successfully Modal */}
        {showSuccessModal && (
          <div
            className={`${styles.m_add_successfully} modal fade`}
            id="imgModal"
            tabIndex="-1"
            aria-labelledby="deleteModalLabel"
            aria-hidden="true"
          >
            <div className={`${styles.m_model} modal-dialog modal-dialog-centered`}>
              <div className={`modal-content ${styles.m_save}`} style={{ border: "none", backgroundColor: "#f6f6f6" }}>
                <div className={`modal-body ${styles.m_save_text}`}>
                  <span>Add Successfully!</span>
                </div>
                <div className={styles.m_save_img}>
                  <img src={require('../../Image/right.png')} alt="Success" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AddCustomer;

