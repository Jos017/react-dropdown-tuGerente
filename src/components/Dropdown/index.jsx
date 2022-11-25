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

  // Set seach states
  const [companies, setCompanies] = useState([]);
  const [searchBy, setSearchBy] = useState('name');
  const [showSearch, setShowSearch] = useState(false);
  const [noMoreValues, setNoMoreValues] = useState(false);

  // Set states for Loaders
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);

  // Control inputs from dropdown search bar, and add new Item form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [formInputs, setFormInputs] = useState({
    name: '',
    businessName: '',
    nit: '',
    phone: '',
    code: '',
  });

  // Control Inputs from search bar and forms
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

  // Updates Companies status from data from firebase
  // Consider: searchValue, searchBy, queryLimit (string, string, number)
  const handleCompaniesBySearch = async (searchValue, searchBy, queryLimit) => {
    setIsLoadingList(true);
    const data = await getCompaniesBySearch(
      searchValue.toUpperCase(),
      searchBy,
      queryLimit
    );
    // Update Companies list depending on data value
    if (data) {
      setCompanies([...data]);
      setNoMoreValues(false);
    } else {
      setCompanies([]);
      setNoMoreValues(true);
    }
    setIsLoadingList(false);
  };

  // Adds more companies from data from firebase (pagination)
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

  // Creates a new company from object
  // Object value should have at least 5 properties, 6 if need custom company code
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

  // Reloads search considering new parameter
  const handleFilterChange = async (e) => {
    setIsLoadingList(true);
    setSearchBy(e.target.value);
    await handleCompaniesBySearch(inputValue, e.target.value, queryLimit);
    setIsLoadingList(false);
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

  // First letter of words with Capital, from a string
  const changeNameToCapitalLetter = (string) => {
    const nameInArray = string.split(' ');
    const nameInArrayCapitalized = nameInArray.map((word) => {
      return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
    });
    return nameInArrayCapitalized.toString().replaceAll(',', ' ');
  };

  // Controls scroll position and search more data when position is at the end
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
