# TRAD client panel

### Web App for Credit Risk Assessment

##Introduction:
The TRAD is a financial services company who provides credit assessments for large businesses to protect financial health of the business.

- Purpose of this project:

  - Decrease the financial risk for large businesses with the system that allow to send information to the customers about their clients.
  - Automations on the credit limit.
  - Good user interface (UI).

- What we have archived with this project:
  - A dynamic system with integration of different services like ABR Lookup, New Zealand Lookup, RSS, Illion.

##Module:

- TRAD Client Portal

###1. Purpose of the module:

- TRAD Client Portal is client panel connected with risk panel which will used to manage application, credit-limit and profile by client.
- Clients will be managed by using TRAD Risk Portal.

###2. Features of the module:

- Client can manage application, credit-limit, overdues, claims and task.
- Dashboard – gives annual analytics of business.
- Access to the client portal can only manage by using risk portal.

###3. Technical stack of module:

- Front-end Framework: ReactJS

###4. Configure Module:

- Configure back-end point
  - In **source/client-panel/. env-cmdrc** (environment file) replace the ‘REACT_APP_BASE_URL’ with the generated Api URL pointing to your backend according to environments.

###5. Get up and running:

- Install Requirements
- Go to source/client-panel directory and open terminal for that directory
  - Run **“npm I”** to install dependencies.
  - Run **“npm run <environment name>”** to run project and client-panel loads on port available with your system default is port: 3000, **ex: npm run dev**.
  - Login into panel from browser at **“localhost:<port number>”** by providing credentials.
  - Dashboard will load once authentication done.
