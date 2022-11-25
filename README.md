# Dropdown search bar

This dropdown search bar was created as a component in a project using ReactJs.

<p align="center">
  <img src="https://user-images.githubusercontent.com/101021656/204050128-1066430b-4574-4b8e-8ac6-e65d78c01db0.png" width=50% height=50%>
</p>

## Considerations before running the app

Its completely necesary to configure the environment variables and conect to firebase.

### Environment variables

You must configure environment variables with the following key names:
```
REACT_APP_apiKey=value
REACT_APP_authDomain=value
REACT_APP_projectId=value
REACT_APP_storageBucket=value
REACT_APP_messagingSenderId=value
REACT_APP_appId=value
REACT_APP_measurementId=value
```
You obtain the key values from the info in your database in Firebase, you must replace instead of `value`.

### Firebase DB
There are some considerations you must have when conecting to the database in Firebase.
* The collection name is `companies`
* All the documents properties values are type `string`
* The documents properties fields must be the following:
  * `name`
  * `businessName`
  * `nit`
  * `phone`
  * `code`

## How does it work?

This is a dropdown search bar.

### 1. Make a search

You can write what you want to search in the search bar, after that you press the arrowdown icon to begin the search.
Once you have clicked the icon a list with the results will show. (20 results)

<p align="center">
  <img src="https://user-images.githubusercontent.com/101021656/204051935-27a755e2-a376-4915-8f37-8dd07d1c5c01.png" width=50% height=50%>
</p>

In case you did not write anything to search, and pressed the arrowdown icon. It will show 20 results.

<p align="center">
  <img src="https://user-images.githubusercontent.com/101021656/204052170-7d330509-364b-4cda-b2d1-6e5573a6e9ed.png" width=50% height=50%>
</p>

If you write a new search while the dropdown list is open it will refresh the data obtained.

The list has a scroll down and if there are more results in the database that matches the search,
it will load more items if the scrollbar reaches the end of the list

<p align="center">
  <img src="https://user-images.githubusercontent.com/101021656/204052666-960f9c23-19d8-4221-921a-3a604cf96086.png" width=50% height=50%>
</p>

### 2. Filter search by parameter
In this dropdown menu you can change the parameter of the search, the search will find matches depending on the parameter value.
You only need to change the Search By Input.

<p align="center">
  <img src="https://user-images.githubusercontent.com/101021656/204052925-4885d29e-19ae-47dd-9359-61a5100c2204.png" width=50% height=50%>
</p>

### 3. Add new company
In every search, the first result is for adding a new company, if you click it a modal will appear and allow you to create a new company.
The value of the search is used to fill in the form according to its parameter. You can edit it.

<p align="center">
  <img src="https://user-images.githubusercontent.com/101021656/204053208-02ce224e-3873-4032-b02e-ebc6ee8b8976.png" width=50% height=50%>
</p>

Once you added the data and press the button `Add Company`, a new Item is created into the database.
To close the modal only click on `Cancel`.

## Created By
Jose Bernabe Rios Nuñez (jrbernabe@gmail.com)
