import React, { useState } from 'react';
import styles from '../../css/SuperProfile.module.css';
import style from "../../css/BillPayment.module.css";

function ChangePasswordModal({ show, setShow }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword) {
      // Handle password change logic here
      console.log("Password changed successfully");
      setShow(false); // Close modal after change
    } else {
      alert("Passwords do not match!");
    }
  };

  return (
    <div
      className={`modal fade ${show ? 'show' : ''} ${styles.m_model_ChangePassword}`}
      id="changepassModal"
      tabIndex="-1"
      aria-labelledby="changepassModalLabel"
      aria-hidden={!show}
      style={{ display: show ? 'block' : 'none' }}
    >
      <div className={`modal-dialog modal-dialog-centered ${styles.m_model}`}>
        <div className={`modal-content ${styles.m_change_pass}`} style={{ border: "none", backgroundColor: "#f6f6f6" }}>
          <div className={`modal-body ${styles.m_change_pass_text}`}>
            <span>Change Password</span>
          </div>
          <div className={styles.m_new}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className={styles.m_confirm}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className={styles.m_btn_cancel_change}>
            <div className={styles.m_btn_cancel}>
              <button data-bs-dismiss="modal" onClick={() => setShow(false)}>Cancel</button>
            </div>
            <div className={styles.m_btn_change}>
              <button type="button" onClick={handlePasswordChange}>Change</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;