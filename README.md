# joe-juice-lovers


## Getting started

npm install
node app.js

localhost:3000



## Mobile view explanations

1. the mobile view is multi-pages which means there are sever vue instances are used. Different pages uses localstorage of browser to store and pass data.

2. 
mobile-cart.js contains the vue instance for the mobile-cart.html

mobile-create.js contains the vue instance for mobile-create.html (which includes 3 pages in one page)(read seminar note 1 BONUS: CREATE "PAGES" WITHIN A PAGE for more information)

mobile-recommendations contains the vue instance for mobile-recommendation.html

mobile-common contains a component (shared between vue instances)for the small shopping cart button

the multi-language functionality is implemented in juicifer-main.js


