Covid19 cases summary by country.
Data from api.covid19api.com.
Made with vanilla web components and D3.js.

Demo: https://covid19-23cb7.firebaseapp.com/
(works in Chrome and Firefox, Edge will likely fail due to lack of web component support - TODO: add polyfills)
 
Use: download this repository and run index.html in a local web server.
For example if you have Node installed simply run http-server from the folder you downloaded the repo in.

Test:
- npm install for Karma, Jasmine and other dependencies
- karma start
I didn't have time for a full test suite, but made an example for the bar chart component to illustrate how I would go about testing these components.
