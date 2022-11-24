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

const QUERY_LIMIT = 20;
const FILTER_BY = 'name';

export const Dropdown = () => {
  const [companies, setCompanies] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [lastItem, setLastItem] = useState(null);

  const companiesCollectionRef = collection(db, 'companies');

  // Obtains companies from firebase
  const getCompanies = async () => {
    const firstPage = query(
      companiesCollectionRef,
      orderBy(FILTER_BY),
      limit(QUERY_LIMIT)
    );
    const data = await updateCompaniesList(firstPage);
    setCompanies([...companies, ...data]);
  };

  const getCompaniesBySearch = async (searchValue) => {
    const search = query(
      companiesCollectionRef,
      where(FILTER_BY, '>=', searchValue),
      where(FILTER_BY, '<=', searchValue + '\uf8ff'),
      orderBy(FILTER_BY),
      limit(QUERY_LIMIT)
    );
    const data = await updateCompaniesList(search);
    if (data) {
      setCompanies([...data]);
    } else {
      setCompanies([]);
    }
  };

  // Get the initial companies
  const getMoreCompanies = async () => {
    const nextPage = query(
      companiesCollectionRef,
      orderBy(FILTER_BY),
      startAfter(lastItem),
      where(FILTER_BY, '>=', inputValue.toUpperCase()),
      where(FILTER_BY, '<=', inputValue.toUpperCase() + '\uf8ff'),
      limit(QUERY_LIMIT)
    );
    const data = await updateCompaniesList(nextPage);
    if (data) {
      setCompanies([...companies, ...data]);
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
    return nameInArrayCapitalized.toString().replace(',', ' ');
  };

  useEffect(() => {
    getCompanies();
  }, []);

  return (
    <div>
      <input
        placeholder="Buscar..."
        value={inputValue}
        onChange={handleInputChange}
      />
      <button onClick={handleShowSearch}>Show List</button>
      <div className={showSearch ? 'list' : `${styles.hidden}`}>
        <ul>
          {companies.map((company, index) => (
            <li key={company.id}>
              {index}: {changeNameToCapitalLetter(company.name)}
            </li>
          ))}
        </ul>
        <button onClick={getMoreCompanies}>LoadMore</button>
      </div>
    </div>
  );
};
