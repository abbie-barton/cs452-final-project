# Final Report - 12/10/25
# Project Summary
My project is an admin portal for an animal shelter website. It handles animals and their information, and in the future users and the relationships between users and animals.  <br/><br/>
Deployment: https://cs452-final-project.vercel.app/animals
# Diagrams
<img width="687" height="575" alt="Screenshot 2025-12-10 at 2 06 14 PM" src="https://github.com/user-attachments/assets/e86c91d4-09b1-4058-b366-b9eaef6713a5" /> <br/>

Current tables supported: <br/>
<img width="410" height="431" alt="Screenshot 2025-12-10 at 2 08 48 PM" src="https://github.com/user-attachments/assets/e4be5ad4-253c-4205-9933-41fc15471926" /> <br/>

Future functionality: <br />
<img width="839" height="500" alt="Screenshot 2025-12-10 at 2 11 29 PM" src="https://github.com/user-attachments/assets/b827b641-598e-4afc-aeee-f093c5b46e50" /> <br/>

GIF showing add animal functionality:  <br />
![cs452-website](https://github.com/user-attachments/assets/79d0675c-5e27-4e26-9d13-cc543d54d388) <br/>

# What did you learn in this project?
I learned a lot about AWS and how it works with a CDK. I initially created a CDK that worked well, but it cost a lot of money (about $60 per month), so I redesigned it so it has a much lower cost. I learned about how cloud technologies work, how they scale, and how they can be implemented in a small or potentially large project. I also have never done vibe coding before which I did a lot of on the frontend, and I learned that there are a lot of cool things AI can do especially if you are giving it good guidance.
# How did you use AI to assist in building your project?
I relied heavily on AI to help me build my project. I've never built a backend that used primarily AWS, and so I used AI to help me know how to build the backend as well as design parts of the frontend. It did lead me astray a couple of times, and made my AWS costs pretty high, but that was all fixable once I knew the correct prompts to use.
# Why is this project interesting to you?
A couple of months ago I was interested in volunteering with the community somehow and the local animal shelter website caught my eye. It wasn't well designed and initially I just thought it would be fun to redesign, but now I feel like it could be a good opportunity to help the local animal shelter if I offer up what I've built as something they could potentially use.
# Key learnings
 - How to use a CDK in code
 - How to write services and lambdas that work with MySQL and AWS
 - How to use AI as a coding tool
 # Scaling, performance, and authentication
 Most of my scaling is handled by AWS since all of my services are handled there. If the database gets sufficiently big enough, the RDS scaling would have to be turned on or it could auto-scale. Eventually I want to add login and authentication to the site, and that would also be handled by AWS Cognito and an authentication table in the database. 
