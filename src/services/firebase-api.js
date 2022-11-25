import { db } from '../config/firebase-config';
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

const companiesCollectionRef = collection(db, 'companies');
let lastItem = null;

// Returns an Array of objects of All Companies in database
const getAllCompanies = async () => {
  let dataArray = [];
  const allCompanies = await getDocs(companiesCollectionRef);
  allCompanies.forEach((doc) => dataArray.push(doc.data()));
  return dataArray;
};

// Return a Array of objects depending on a query to firebase
const updateCompaniesList = async (querySearch) => {
  const documentSnapshots = await getDocs(querySearch);
  if (documentSnapshots.docs.length > 0) {
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1];
    lastItem = lastVisible;
    const data = documentSnapshots.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return data;
  }
};

// Returns an Array of objects of All Companies in database allowing pagination
const getCompaniesBySearch = async (searchValue, searchBy, queryLimit) => {
  const search = query(
    companiesCollectionRef,
    where(searchBy, '>=', searchValue),
    where(searchBy, '<=', searchValue + '\uf8ff'),
    orderBy(searchBy),
    limit(queryLimit)
  );
  const data = await updateCompaniesList(search);
  return data;
};

// Returns more companies from last item obtained (pagination)
const getMoreCompanies = async (searchValue, searchBy, queryLimit) => {
  const nextPage = query(
    companiesCollectionRef,
    orderBy(searchBy),
    startAfter(lastItem),
    where(searchBy, '>=', searchValue.toUpperCase()),
    where(searchBy, '<=', searchValue.toUpperCase() + '\uf8ff'),
    limit(queryLimit)
  );
  const data = await updateCompaniesList(nextPage);
  return data;
};

// Add new company to the database. All parameters must be strings
const createCompany = async (name, businessName, nit, phone, code) => {
  if (!code) {
    const totalCompanies = await getAllCompanies();
    code = `COMPANY${totalCompanies ? totalCompanies.length + 1 : 1}`;
  }
  const newCompany = {
    name: name.toUpperCase(),
    businessName: businessName.toUpperCase(),
    nit: `${nit}`,
    phone: `${phone}`,
    code,
  };
  await addDoc(companiesCollectionRef, newCompany);
  return newCompany;
};

export {
  getAllCompanies,
  getCompaniesBySearch,
  getMoreCompanies,
  updateCompaniesList,
  createCompany,
};
