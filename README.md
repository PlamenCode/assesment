# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

# ASSESMENT ITSELF

you are given working react app which serves as config panel for one of the algorithms for our adaptive control service (Trac).

Its pretty old, made when i was not aware of react hooks, so its class based.

**The task is to refactor the app to functional components and demonstrate it**, which means you have to create an Api with persistent layer with the corresponding endpoints found in `trac-api.ts` in services folder. Connect the api in `config.ts`

Api may be done with any technology, the only requirement if in Python - FastApi.  
You may use interfaces from the corresponding folder when designing db schema.  

Anyway, the frontend part of the assesment has more value, but only if it works - so without backend it won't go, so don't bother much with the backend, a working one is sufficient, but don't allow duplicates in db. Design improvement ot the UI sticking to used bootstrap is very welcome. 

Deliverables - a repo or 2 (for react and backend) with the code to assess and test.  
If any considerations about how to run - please provide how-to, especially on how to build db schema(sql script, migrations), if db not initialized on startup.

SINGLE commit won't be good presentation of how you've worked, please commit often.  
You may get feedback (presumably delivered as issues) along your progress if you provide repo links early in order to keep track of your work

Good luck!
