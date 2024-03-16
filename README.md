- .env  
 commited for your simplicity
change in .env files Postgress password
---------------------------


REGISTRaION       -Company
---------------------------------------------
1.     POST:      http://localhost:3000/company/
     req Body       
11.     { "name":"CompanyNAme",
        "password":"111111",                       more than 6 symbols
        "email":"john@gmail.com"   ,          email  must be UNIQUE
        "country":"Europe,
         "industry":"Marketing"                  
        }
      Returns :created company     Message: Check email to Activate Company
--------------------------------------------------------------------------
       Aftrer Activation From Email
2.     Post:  http://localhost:3000/company/login 
     req Body  
23.     {
        "email":"company@gmail.com"
        "password":"123456",   
        }
  -  Returns :   JWT Acess Token  MUST BE USED AS BEARER token
------------------------------------------------------------------------------

### EVERYWHERE      REQUIRED  --  header   |||   Authorization     Bearer  your_acess_token
3.     PATCH:  http://localhost:3000/company/{yourCompanyId}                      changesCompany Data
    req  Body 
3.     Body: {
       "email": "33@mmm.com",
       "password": "1234566",
       "country": "Europe",
       "industry": "Marketing",
        "name": "Company Best"
}
           Not All body fields required
          If Some field specified all fields will be updated EXEPT EMAIL
           Returns: Updated Company
------------------------------------------------------------------


 5.     Get: http://localhost:3000/company/subscribe
             Returns:  Company    and Available Subscriptions
        PATCH:  http://localhost:3000/company/subscribe/{free}or{basic}or{premium}
            Company billing will be updated
---------------------------------------------------------------------------
-------------------------------------------------------------
     Only after purchasing subscription you cann add Employee To Company 
     Creates new Employee in (Company auntethicated with JWT Token)
     Subscription must be purchased before adding Employee

    Post:  http://localhost:3000/company/employee
        Body:{
       "email": "11@gmail.com",
       "name":"yourName"}
       
       
       Response : message{ activation email send on user email}
-----------------
--------------

  5.      GET:  http://localhost:3000/company/all
             Returns: Array Companies
         Get: http://localhost:3000/company/all
             Returns: All Companies and their subscriptions
  
---------------------------------------------------------
6.      GET:    http://localhost:3000/company
     Returns: Company with Subscriptions Files and Employees
------------------------------------------------------
6.          DELETE  http://localhost:3000/company/employee/{employee Id}
                 deletes  Employee from Company if it registered from company   uploaded files not affected

---------------------------------------------------
### Employee  
    Login   before you myst have activated employee from email
       Post:    http://localhost:3000/employee/login
           Body{
           "email":"nameagasi@gmail.com",
           "password":"111111"}
      
      
      Returns : EMPLOYEE Acess Token
--------------------------------------------------------------------
    Upload file
    Post :http://localhost:3000/employee/file

    Use FormData
     body{
      file:.csv.xls,
      companyId: where to upload
      access[]:  1,3,4     or   all  \\\\   1,2,3    -------users who can see file or (all) for (full access)
      }

-------------------------------------------------------------------------

       GET:   http://localhost:3000/employee/
       
        Return Logined  EMployee files     



-------------------

















