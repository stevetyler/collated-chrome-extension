TESTING:
set isProduction to false in eventPage.js

open extension with security disabled :
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-web-security --user-data-dir=~/Projects/collated-chrome-extension


DEPLOYMENT:
set isProduction to true
update version in manifest.json
