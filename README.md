# Node APK
A library to parse Android application's manifest and signature

## Installation
This library is meant to work with Node JS 4 or later. You can install it using npm:
```shell
npm install node-apk
```
## Usage
Import the Apk class and instanciate it passing your APK's file path
```javascript
import {Apk} from "node-apk";
const apk = new Apk("yourapplication.apk");
```
Application manifest details can be accessed using:
```javascript
apk.getManifestInfo()
    .then((manifest) => console.log(JSON.stringify(manifest, null, 4)));
```
Signature details can be retrieved with:
```javascript
apk.getCertificateInfo()
    .then((certInfo) => console.log(JSON.stringify(certInfo, null, 4)))
```
Once you are done, don't forget to release you Apk object:
```javascript
apk.close();
```
## License
This software is licensed under the [MIT license](LICENSE)

Copyright &#169; 2019 All rights reserved. XdevL
