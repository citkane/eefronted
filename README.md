# Frontend technical challenge for Electricity Exchange

## Assumptions
Built and tested with:
- Ubuntu 18.04
- Node v8.12.0
- NPM 6.4.1
- Firefox 63.0 (64-bit)
- Chromium Version 70.0.3538.77

Both API and static server running on Localhost, ports 3000 and 3001.


## How to install
```
mkdir <yourdir>
cd <yourdir>
git clone https://github.com/citkane/eefronted ./
npm install
```
## How to run
```
cd <yourdir>
npm start
```
This will start both the API server and the web server at ports 3000 and 3001 respectively.

Browse to http://localhost:3001 to view the frontend.

## Notes
I have not packaged or minified the project, so please use the above method on localhost for serving as it resolves issues with resource locations and CORS.

It includes a modification to the provided API `app.js` script:
`res.header("Access-Control-Allow-Methods", "*, PUT");`

Without explicit declaration of `PUT` my Firefox (not Chromium) was rejecting `PUT` requests as `invalid method for CORS` (`GET` was working fine).

