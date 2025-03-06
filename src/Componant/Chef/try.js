import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChefNavbar from './ChefNavbar';
import ChefSidePanel from './ChefSidePanel';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import styles from "../../css/ChefVariant.module.css";
import style from "../../css/BillPayment.module.css"; // Import the CSS module

function ChefVariant(props) {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [variantIdToDelete, setVariantIdToDelete] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        const fetchVariants = async () => {
            const apiUrl = "http://localhost:209/variant";
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error("Failed to fetch data from the API");
                const data = await response.json();
                setVariants(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVariants();
    }, []);

    const deleteVariantById = async (variantId) => {
        const deleteUrl = `http://localhost:209/variant/${variantId}`;
        try {
            const response = await fetch(deleteUrl, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete variant");
            console.log("Variant deleted successfully");
            setVariants(variants.filter(variant => variant.id !== variantId));
            closeDeleteModal(); 
        } catch (error) {
            console.error("Error deleting variant:", error);
        }
    };

    const openDeleteModal = (variantId) => {
        setVariantIdToDelete(variantId); 
        setIsDeleteModalOpen(true); 
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false); 
        setVariantIdToDelete(null); 
    };

    const toggleDrawer = () => {
        document.getElementById("a_drawer").classList.toggle("open");
    };

    const toggleNotifications = () => {
        const panel = document.getElementById("notification-panel");
        panel.style.display = panel.style.display === "none" || panel.style.display === "" ? "block" : "none";
    };

    return (
        <section id={styles.a_selectTable}>
            <ChefNavbar toggleDrawer={toggleDrawer} toggleNotifications={toggleNotifications} />
            <ChefSidePanel isChefDashboard={false} isChefMenu={false} isChefCategory={false} isChefVariant={true} isChefProfile={false} />
            <div id={styles['a_main-content']}>
                <div className={styles['db_content-container']}>
                    <div className={`container-fluid ${styles.a_main}`}>
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div style={{ fontSize: '30px', fontWeight: '600' }}>Variant List</div>
                            <div className={`d-flex justify-content-between align-items-center ${styles.v_new_addz}`}>
                                <div className={`${styles.a_search} ${styles.v_search} m-0`}>
                                    <input type="search" placeholder="Search..." className="search-input" />
                                </div>
                                <div>
                                    <select className={styles.v_search1}>
                                        <option value="">Sort by</option>
                                        <option value="A">Name</option>
                                        <option value="B">Category</option>
                                        <option value="C">Price</option>
                                        <option value="D">Status</option>
                                    </select>
                                </div>
                                <div>
                                    <Link to={'/addVariant'}>
                                        <button type="button" className={`btn border text-white ${styles.v_btn_size2} me-3`} style={{ backgroundColor: '#4B6C52' }}>
                                            <FontAwesomeIcon icon={faPlus} className="text-white me-2" /> Add New
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.m_table} style={{ padding: '30px 10px', borderRadius: '5px' }}>
                        <table border="0" width="100%" data-bs-spy="scroll">
                            <thead>
                                <tr align="center" bgcolor="#F3F3F3" className={styles.m_table_heading}>
                                    <th>Image</th>
                                    <th>Category</th>
                                    <th>Dish Name</th>
                                    <th>Variant Name</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                                ) : (
                                    variants.map(variant => (
                                        <tr key={variant.id} align="center">
                                            <td className="text-center"><img src={require(`../../Image/${variant.imageFile}`)} style={{ width: '60px' }} alt="Variant" /></td>
                                            <td className="text-center">{variant.dishCategory}</td>
                                            <td className="text-center">{variant.dishName}</td>
                                            <td className="text-center">{variant.varName}</td>
                                            <td className="text-center">{variant.Price}</td>
                                            <td className="text-center">
                                                <div className={styles.m_table_icon}>
                                                    <div className={styles.m_pencile}>
                                                        <Link to={`/editVariant?evarId=${variant.id}`}>
                                                            <button className={`${styles['edit-butdish']} ${styles.v_btn_edit}`} onClick={() => localStorage.setItem('evarId', variant.id)}>
                                                                <i className="fa-solid fa-pencil"></i>
                                                            </button>
                                                        </Link>
                                                    </div>
                                                    <div className={styles.m_trash}>
                                                        <button onClick={() => openDeleteModal(variant.id)} className={`${styles['delete-button']} ${styles.v_btn_edit}`}>
                                                            <i className="fa-regular fa-trash-can"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {isDeleteModalOpen && (
                        <div>
                            <div className="modal-backdrop fade show"></div>
                            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content" style={{ backgroundColor: "#F3F3F3", border: "none" }}>
                                        <div className="modal-body">
                                            <div className="text-center">
                                                <div className="m_delete" style={{ fontSize: "32px", fontWeight: 600, marginBottom: "25px" }}>
                                                    Delete
                                                </div>
                                                <div className="m_sure_delete" style={{ fontSize: "25px", fontWeight: 500, marginBottom: "45px" }}>
                                                    Are You Sure You Want To Delete?
                                                </div>
                                                <div className="d-flex justify-content-center align-items-center my-3">
                                                    <button type="button" data-bs-dismiss="model" className="btn b_button btn border-secondary border mx-3" onClick={closeDeleteModal}>
                                                        Cancel
                                                    </button>
                                                    <button type="button" data-bs-dismiss="model" className="btn border text-white mx-3" style={{ backgroundColor: "#4b6c52" }} onClick={() => deleteVariantById(variantIdToDelete)}>
                                                        Yes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            {/* Change Password Modal */}
            <div className={`modal fade ${style.m_model_ChangePassword}`} id="changepassModal" tabIndex="-1" aria-labelledby="changepassModalLabel" aria-hidden="true">
                <div className={`modal-dialog modal-dialog-centered ${style.m_model}`}>
                    <div className={`modal-content ${style.m_change_pass}`} style={{ border: "none", backgroundColor: "#f6f6f6" }}>
                        <div className={`modal-body ${style.m_change_pass_text}`}>
                            <span>Change Password</span>
                        </div>
                        <div className={style.m_new}>
                            <input type="text" placeholder="New Password" />
                        </div>
                        <div className={style.m_confirm}>
                            <input type="text" placeholder="Confirm Password" />
                        </div>
                        <div className={style.m_btn_cancel_change}>
                            <div className={style.m_btn_cancel}>
                                <button data-bs-dismiss="modal">Cancel</button> {/* Updated */}
                            </div>
                            <div className={style.m_btn_change}>
                                <button>Change</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logout Modal */}
            <div className={`modal fade ${style.m_model_logout}`} id="logoutModal" tabIndex="-1" aria-labelledby="logoutModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className={`modal-content ${style.m_model_con}`} style={{ border: "none", backgroundColor: "#f6f6f6" }}>
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

export default ChefVariant;