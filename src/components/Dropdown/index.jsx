import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase-config';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export const Dropdown = () => {
  const [companies, setCompanies] = useState([]);
  const companiesCollectionRef = collection(db, 'companies');

  const getCompanies = async () => {
    const response = await getDocs(companiesCollectionRef);
    const data = response.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return data;
  };

  const createCompany = async (name, businessName, nit, phone, code) => {
    if (!code) {
      const totalCompanies = await getCompanies();
      code = `COMPANY${totalCompanies.length + 1}`;
    }
    const newCompany = { name, businessName, nit, phone, code };
    await addDoc(companiesCollectionRef, newCompany);
  };

  useEffect(() => {
    const setData = async () => {
      const data = await getCompanies();
      setCompanies(data);
    };
    setData();
  }, []);

  return (
    <div>
      {companies.map((company, index) => (
        <React.Fragment key={company.id}>
          <p>
            {index}: {company.name}
          </p>
          {/* <p>Razón Social: {company.businessName}</p>
          <p>NIT: {company.businessName}</p>
          <p>Teléfono: {company.businessName}</p>
          <p>Código: {company.businessName}</p> */}
        </React.Fragment>
      ))}
      <button
        onClick={() =>
          createCompany(
            'AMERFACHADAS',
            'AMERFACHADAS CONSTRUCCIONES BOLIVIA S.R.L.',
            411988,
            77788899
          )
        }
      >
        AddCompany
      </button>
    </div>
  );
};
