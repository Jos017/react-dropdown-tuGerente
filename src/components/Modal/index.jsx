import React from 'react';
import styles from './styles.module.css';

export const Modal = (props) => {
  const {
    isModalOpen,
    handleFormSubmit,
    formInputs,
    handleFormInputs,
    handleCloseModal,
  } = props;
  return (
    <div className={isModalOpen ? `${styles.modal}` : `${styles.hidden}`}>
      <form className={styles.modalContainer} onSubmit={handleFormSubmit}>
        <div className={styles.modalTextContainer}>
          <h3 className={styles.modalTitle}>Create new Company</h3>
          <div className={styles.formContainer}>
            <div className={styles.formInputContainer}>
              <label>Nombre</label>
              <input
                name="name"
                value={formInputs.name}
                onChange={handleFormInputs}
              />
            </div>
            <div className={styles.formInputContainer}>
              <label>Razón Social</label>
              <input
                name="businessName"
                value={formInputs.businessName}
                onChange={handleFormInputs}
              />
            </div>
            <div className={styles.formInputContainer}>
              <label>NIT</label>
              <input
                type="number"
                name="nit"
                value={formInputs.nit}
                onChange={handleFormInputs}
              />
            </div>
            <div className={styles.formInputContainer}>
              <label>Teléfono</label>
              <input
                type="number"
                name="phone"
                value={formInputs.phone}
                onChange={handleFormInputs}
              />
            </div>
            <div className={styles.formInputContainer}>
              <label>Código</label>
              <input
                name="code"
                value={formInputs.code}
                onChange={handleFormInputs}
              />
            </div>
          </div>
        </div>
        <div className={styles.modalBtnContainer}>
          <button
            className={`${styles.modalBtn}`}
            onClick={handleCloseModal}
            type="button"
          >
            Cancel
          </button>
          <button
            className={`${styles.modalBtn} ${styles.modalBtnBlue}`}
            type="submit"
          >
            Add Company
          </button>
        </div>
      </form>
    </div>
  );
};
