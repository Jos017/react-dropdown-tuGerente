import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase-config';
import {
  collection,
  getDocs,
  addDoc,
  query,
  limit,
  orderBy,
  startAfter,
  where,
} from 'firebase/firestore';
import styles from './styles.module.css';

export const Dropdown = (props) => {
  const { queryLimit, searchBy } = props;

  const [companies, setCompanies] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [lastItem, setLastItem] = useState(null);
  const [noMoreValues, setNoMoreValues] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
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
    const { name, businessName, nit, phone, code } = formInputs;
    createCompany(name, businessName, nit, phone, code);
    setIsModalOpen(false);
  };

  const companiesCollectionRef = collection(db, 'companies');

  // Obtains companies from firebase
  const getCompanies = async () => {
    const firstPage = query(
      companiesCollectionRef,
      orderBy(searchBy),
      limit(queryLimit)
    );
    const data = await updateCompaniesList(firstPage);
    return data;
  };

  const getCompaniesBySearch = async (searchValue) => {
    const search = query(
      companiesCollectionRef,
      where(searchBy, '>=', searchValue),
      where(searchBy, '<=', searchValue + '\uf8ff'),
      orderBy(searchBy),
      limit(queryLimit)
    );
    const data = await updateCompaniesList(search);
    if (data) {
      setCompanies([...data]);
      setNoMoreValues(false);
    } else {
      setCompanies([]);
      setNoMoreValues(true);
    }
  };

  // Get the initial companies
  const getMoreCompanies = async () => {
    const nextPage = query(
      companiesCollectionRef,
      orderBy(searchBy),
      startAfter(lastItem),
      where(searchBy, '>=', inputValue.toUpperCase()),
      where(searchBy, '<=', inputValue.toUpperCase() + '\uf8ff'),
      limit(queryLimit)
    );
    const data = await updateCompaniesList(nextPage);
    if (data) {
      setCompanies([...companies, ...data]);
      setNoMoreValues(false);
    } else {
      setNoMoreValues(true);
    }
  };

  const updateCompaniesList = async (querySearch) => {
    const documentSnapshots = await getDocs(querySearch);
    if (documentSnapshots.docs.length > 0) {
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastItem(lastVisible);
      const data = documentSnapshots.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return data;
    }
  };

  // Create a company in firebase
  const createCompany = async (name, businessName, nit, phone, code) => {
    if (!code) {
      const totalCompanies = await getCompanies();
      code = `COMPANY${totalCompanies.length + 1}`;
    }
    const newCompany = {
      name: name.toUpperCase(),
      businessName: businessName.toUpperCase(),
      nit,
      phone,
      code,
    };
    await addDoc(companiesCollectionRef, newCompany);
    const newCompaniesList = await getCompanies();
    setCompanies(newCompaniesList);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    getCompaniesBySearch(e.target.value.toUpperCase());
  };

  const handleShowSearch = () => {
    setShowSearch(!showSearch);
  };

  const changeNameToCapitalLetter = (string) => {
    const nameInArray = string.split(' ');
    const nameInArrayCapitalized = nameInArray.map((word) => {
      return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
    });
    return nameInArrayCapitalized.toString().replaceAll(',', ' ');
  };

  const handleScroll = (e) => {
    const scrollTopPosition = e.currentTarget.scrollTop;
    const offsetHeight =
      e.currentTarget.scrollHeight - e.currentTarget.offsetHeight - 10;
    if (scrollTopPosition >= offsetHeight && !noMoreValues) {
      getMoreCompanies();
      console.log('buscar');
    }
  };

  useEffect(() => {
    const handleFirstList = async () => {
      const data = await getCompanies();
      setCompanies([...companies, ...data]);
    };
  }, []);

  return (
    <div className={styles.dropdown}>
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
        <ul className={styles.dropdownListUl}>
          {inputValue && (
            <li
              className={styles.dropdownListLi}
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              Añadir Empresa: {inputValue}
            </li>
          )}
          {companies.map((company, index) => (
            <li key={company.id} className={styles.dropdownListLi}>
              {index}: {changeNameToCapitalLetter(company[searchBy])}
            </li>
          ))}
        </ul>
      </div>
      <div className={isModalOpen ? `${styles.modal}` : `${styles.hidden}`}>
        <form className={styles.modalContainer} onSubmit={handleFormSubmit}>
          <div className={styles.modalTextContainer}>
            <h3 className={styles.modalTitle}>Create new Company</h3>
            <div className={styles.formContainer}>
              <div className={styles.formInputContainer}>
                <label htmlFor="name">Nombre</label>
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
                  name="nit"
                  value={formInputs.nit}
                  onChange={handleFormInputs}
                />
              </div>
              <div className={styles.formInputContainer}>
                <label>Teléfono</label>
                <input
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
              onClick={() => setIsModalOpen(false)}
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
    </div>
  );
};
