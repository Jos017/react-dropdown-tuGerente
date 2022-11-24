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
} from 'firebase/firestore';
import styles from './styles.module.css';

const QUERY_LIMIT = 20;
const ORDER_BY = 'code';

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
      orderBy(ORDER_BY),
      limit(QUERY_LIMIT)
    );
    updateCompaniesList(firstPage);
  };

  // Get the initial companies
  const getMoreCompanies = async () => {
    const nextPage = query(
      companiesCollectionRef,
      orderBy(ORDER_BY),
      startAfter(lastItem),
      limit(QUERY_LIMIT)
    );
    updateCompaniesList(nextPage);
  };

  // Update list of companies according a query search
  const updateCompaniesList = async (queryResult) => {
    //a
    const documentSnapshots = await getDocs(queryResult);
    if (documentSnapshots.docs.length > 0) {
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastItem(lastVisible);
      const data = documentSnapshots.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCompanies([...companies, ...data]);
    }
  };

  // Create a company in firebase
  const createCompany = async (name, businessName, nit, phone, code) => {
    if (!code) {
      const totalCompanies = await getCompanies();
      code = `COMPANY${totalCompanies.length + 1}`;
    }
    const newCompany = { name, businessName, nit, phone, code };
    await addDoc(companiesCollectionRef, newCompany);
    const newCompaniesList = await getCompanies();
    setCompanies(newCompaniesList);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleShowSearch = () => {
    setShowSearch(!showSearch);
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
      <button onClick={handleShowSearch}>AddCompany</button>
      <div className={showSearch ? 'list' : `${styles.hidden}`}>
        <ul>
          {companies.map((company, index) => (
            <li key={company.id}>
              {index}: {company.name}
            </li>
          ))}
        </ul>
        <button onClick={getMoreCompanies}>LoadMore</button>
        {lastItem && `${lastItem?.data().code}`}
      </div>
    </div>
  );
};
