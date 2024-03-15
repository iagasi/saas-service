- .env

commited for your simplicity

  

REGISTRTION -Company and login Public route all subsequent routes require  JTW token

---------------------------------------------

Create Company
regiser
--
POST:    http://localhost:3000/company/
Body: {
    "email": "33@mas.com",
    "password": "1234566",
    "country": "Europe",
    "industry": "Marketing",
  "name": "Company Best"
}; 
Returns :created company     Message: Check email to Activate Company


After Activation From  Email
Login
----
Post:  http://localhost:3000/company/login 
Body:{
    "email": "33@mas.com",
    "password": "1234566",
}
Returns :   JWT Acess Token  MUST BE USED AS BEARER token

----------------------------------------------------------------
ALL BELOW  ROUTES REQUIRE    HEADER AUTHORIZATION      BEARER  JWTTOKEN

---
Purchase SUBSCRIPTION
Patch: http://localhost:3000/company/subscribe/{free}or{basic}or{premium}

Returns Updated Company  Subscription   [after this only yon can create Employee]
PATCH:  http://localhost:3000/company/{yourCompanyId}
requres Bearer token

Body: {
    "email": "33@mmm.com",
    "password": "1234566",
    "country": "Europe",
    "industry": "Marketing",
  "name": "Company Best"
}
Not All body fields required
If Some field specified all fields will be updated
Returns: Updated Company

----

Get: http://localhost:3000/company/subscribe
Returns:  Company    and Available Subscriptions

-------
GET:  http://localhost:3000/company/all
Returns: Array Companies

GET:  http://localhost:3000/company
Returns: Company with Subscriptions Files and Employees






--------------------------------------------------------
Get: http://localhost:3000/company/all
Returns: All Companies and their subscriptions

-------------------------------------
Get: http://localhost:3000/company/files
Returns:Logined Company   all Files

------------------------------------------------------------------------------
EMPLOYEE
-------------
Creates new Employee in (Company auntethicated with JWT Token)
Subscription must be purchased before adding Employee
Post:  http://localhost:3000/company/employee
Body:{
"email": "11@gmail.com",
"name":"yourName"
}
Response : message{ activation email send on user email}

---
Login 
Post:http://localhost:3000/employee/login
Body{

"email":"nameagasi@gmail.com",

"password":"111111"

}
Returns :Acess Token
--------------------------------------------------------------------------------Upload file
Post :http://localhost:3000/employee/file

Use FormData
body{
file:.csv.xls,
companyId: where to upload
access[]:  1,3,4     or   all        -------users who can see file or all for (full access)
}


