# TODOs - Notification service
 backend og microservices architecture

## How to install
1. clone repo
2. run mongodb server localhost:27017
3. execute npm i --save
4. npm run dev

## Support functionalities
* node-cron schedule per 1 minute.
* query for Todos with notification registered
* set Timeout timer for each notification to trigger sendNotification
* mark sent notification
* [DELETE] http://localhost:3001/todos/:todoId - clear NodeJS.Timer in case already triggered - called by TODOs service
