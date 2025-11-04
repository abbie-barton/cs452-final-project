# Initial Design - Animal Shelter
The purpose of this project is to create a user friendly design for a local animal shelter, including an admin portal to make updates to the site data. 
Eventually an option to integrate with a CMS will be added so admin can be controlled and accessed from there. 
## Diagrams
<img width="858" height="543" alt="Screenshot 2025-11-03 at 7 01 22 PM" src="https://github.com/user-attachments/assets/3aabe3a5-39a9-4590-b87d-524ec922bd2f" /><br/>
- Using React and Typescript on the frontend, the site and admin portal will be built to interact with data stored in a MySQL database.
- The admin portal will use APIs from API Gateway and AWS Lambda to update the information on the site, specifically the animal listings.<br/>
<img width="730" height="422" alt="Screenshot 2025-11-03 at 10 19 36 PM" src="https://github.com/user-attachments/assets/f2727485-3342-4b09-a7ab-76899ebf67a7" /><br />
- The most data will be contained within the Animal table. Most viewers of the website won't actually be users, only those who are interested in adoption or fostering or are an admin.
- Some data will only be seen by the admin, such as the animal medical records and pending adoption requests.
## Timeline
Nov 6 - Project setup, including database, AWS, React frontend<br/>
Nov 10 - Admin Portal UX Outline<br/>
Nov 15 - Admin Portal UX Finish<br/>
Nov 16 - Put fake data in the database<br/>
Nov 20 - API creation for animal<br/>
Nov 25 - All APIs finished<br/>
Nov 30 - Authentication<br/>
Dec 10 - Finished Project<br/>
