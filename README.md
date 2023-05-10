This project uses D3.js and Geometrics.js. 


To Install:
* Download repo. 
* You'll also need to globally install <a href="https://parceljs.org/">parcel</a> on your machine with `yarn global add parcel` (this project uses v. 2.8.0 and above)
*  After you do a global install, check to make sure parcel is working: `parcel --version` should return 2.6.2. If you have a version higher than that, you may need to upgrade dependencies to get the repo working. If `parcel --version` returns nothing, check out parcel troubleshooting docs / use npm to globally install parcel.
*  cd into the repo and `yarn install` dependencies


View:
`parcel index.html`


Build (to live):
`rm -rf docs && parcel build --public-url ./ --dist-dir docs index.html`


Live: 