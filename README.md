# Famous Quote Quiz
Main Rule App is listening http://127.0.0.1:8000 It is hardcoded in frontend, Make sure you have this port free.
## Description

Famous quote quiz where the user will have to pick
a correct answer to the asked questions. Depending on selected mode he/she will choose
from a list of answers, or simply to answer with Yes/No to the question.

You start from login page admin user is already created with email: nodaritchikadze@flatrocktech.com and password: flatrocktech.
After login you go on home page admin can see go to admin page button it is not visible for regular user.

On home page you see Select Quiz Mode and Select Action Headers, where you can select quiz mode and action.

We have two types of quiz modes: Binary and Multiple Choice. By clicking on button you can select quiz mode.
You will have 5 minutes to answer 10 questions. After 5 minutes or finishing quiz you will be redirected to ResultsView and you will see your score.
During quiz you can see timer on top. it will not be refreshed if you refresh page. 
After Submitting answer you will see if your answer is correct or not. then you can click on next question button to go to next question.
At the last question you will be able to finish quiz and will see quiz results. With restart Quiz button you will go on home page

Here are top scorers button and you will see top scorers aligned by score if score is same then by time.

Only admin can see go to admin page button. On admin page you can create quotes, edit quotes, delete quotes and see all quotes.
Admin can register users. Also on admin page you see all sessions.
When creating quotes there are rules, at least one answer must be true, you can not have same answers, 
binary questions can not have more than 2 answers, multiple choice questions can not have less than 3 answers.
When editing quotes you can not change type of question, you can not have same answers, 
binary questions can not have more than 2 answers, multiple choice questions can not have less than 3 answers.


## Prerequisites

- Node.js v20.11.0
- npm 10.2.4

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```