# README for Chrome Extension

## Development

Set isProduction=false in eventPage.js

Need to disable web security for extension due to CORS using command:

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-web-security --user-data-dir=~/Projects/collated-chrome-extension

Chrome extension ID may change in development and needs to be set in Ember at app/extension-link/service.js

Clear browser cache after changing ID
