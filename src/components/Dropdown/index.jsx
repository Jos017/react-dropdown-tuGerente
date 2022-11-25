import React, { useState } from 'react';
import {
  getCompaniesBySearch,
  getMoreCompanies,
  createCompany,
} from '../../services/firebase-api';
import { Loader } from '../Loader';
import { Modal } from '../Modal';
import styles from './styles.module.css';

export const Dropdown = (props) => {
  const { queryLimit } = props;

  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [searchBy, setSearchBy] = useState('name');
  const [inputValue, setInputValue] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [noMoreValues, setNoMoreValues] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formInputs, setFormInputs] = useState({
    name: '',
    businessName: '',
    nit: '',
    phone: '',
    code: '',
  });

  const handleFormInputs = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormInputs({
      ...formInputs,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleCreateCompany(formInputs);
    setIsModalOpen(false);
    clearFormInputs();
  };

  const handleCompaniesBySearch = async (searchValue, searchBy, queryLimit) => {
    const data = await getCompaniesBySearch(
      searchValue.toUpperCase(),
      searchBy,
      queryLimit
    );
    if (data) {
      setCompanies([...data]);
      setNoMoreValues(false);
    } else {
      setCompanies([]);
      setNoMoreValues(true);
    }
  };

  const handleMoreCompanies = async () => {
    !isLoadingList && setIsLoadingItems(true);
    const data = await getMoreCompanies(inputValue, searchBy, queryLimit);
    if (data) {
      setCompanies([...companies, ...data]);
      setNoMoreValues(false);
    } else {
      setNoMoreValues(true);
    }
    setIsLoadingItems(false);
  };

  const handleCreateCompany = async (newCompanyObj) => {
    const { name, businessName, nit, phone, code } = newCompanyObj;
    const newCompany = await createCompany(
      name,
      businessName,
      nit,
      phone,
      code
    );
    alert(`Se creo la compañía: ${name}, con código: ${newCompany.code}`);
    handleShowSearch();
  };

  const handleFilterChange = async (e) => {
    setSearchBy(e.target.value);
    console.log(inputValue, e.target.value, queryLimit);
    await handleCompaniesBySearch(inputValue, e.target.value, queryLimit);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setFormInputs({
      ...formInputs,
      [searchBy]: e.target.value,
    });
    if (showSearch) {
      handleCompaniesBySearch(e.target.value, searchBy, queryLimit);
    }
  };

  const clearFormInputs = () => {
    const clearedInputs = {
      name: '',
      businessName: '',
      nit: '',
      phone: '',
      code: '',
    };
    setFormInputs({ ...clearedInputs });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    clearFormInputs();
  };

  const handleShowSearch = async () => {
    const isOpen = showSearch;
    setShowSearch(!isOpen);
    setIsLoadingList(true);
    if (!isOpen) {
      await handleCompaniesBySearch(
        inputValue.toUpperCase(),
        searchBy,
        queryLimit
      );
    }
    if (isOpen) {
      setInputValue('');
      setCompanies([]);
    }
    setIsLoadingList(false);
  };

  const changeNameToCapitalLetter = (string) => {
    const nameInArray = string.split(' ');
    const nameInArrayCapitalized = nameInArray.map((word) => {
      return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
    });
    return nameInArrayCapitalized.toString().replaceAll(',', ' ');
  };

  const handleScroll = async (e) => {
    if (!showSearch) {
      e.currentTarget.scrollTo({ top: 0 });
    }
    const offsetHeight =
      e.currentTarget.scrollHeight - e.currentTarget.offsetHeight - 10;
    if (e.currentTarget.scrollTop >= offsetHeight && !noMoreValues) {
      await handleMoreCompanies();
    }
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.dropdownFilter}>
        <label>Buscar por: </label>
        <select value={searchBy} onChange={handleFilterChange}>
          <option value="name">Nombre</option>
          <option value="businessName">Razón Social</option>
          <option value="nit">NIT</option>
          <option value="phone">Teléfono</option>
          <option value="code">Código</option>
        </select>
      </div>
      <div className={styles.dropdownSearchBar}>
        <input
          placeholder="Buscar..."
          value={inputValue}
          onChange={handleInputChange}
          className={styles.dropdownInput}
        />
        <button onClick={handleShowSearch} className={styles.dropdownButton}>
          {showSearch ? (
            <span className="material-icons">expand_less</span>
          ) : (
            <span className="material-icons">expand_more</span>
          )}
        </button>
      </div>
      <div
        className={showSearch ? `${styles.dropdownList}` : `${styles.hidden}`}
        onScroll={handleScroll}
      >
        {isLoadingList ? (
          <Loader />
        ) : (
          <ul className={styles.dropdownListUl}>
            <li
              className={`${styles.dropdownListLi} ${styles.dropdownAdd}`}
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Añadir Empresa{' '}
              {inputValue ? (
                <strong>{': ' + inputValue}</strong>
              ) : (
                <strong>{' +'}</strong>
              )}
            </li>
            {companies.map((company) => (
              <li key={company.id} className={styles.dropdownListLi}>
                {changeNameToCapitalLetter(company[searchBy])}
              </li>
            ))}
          </ul>
        )}
      </div>
      {isLoadingItems && (
        <div className={styles.dropdownLoad}>
          <Loader />
        </div>
      )}
      <Modal
        isModalOpen={isModalOpen}
        handleFormSubmit={handleFormSubmit}
        formInputs={formInputs}
        handleFormInputs={handleFormInputs}
        handleCloseModal={handleCloseModal}
      />
    </div>
  );
};
