# Node APK
A library to parse Android application's manifest and signature

## Installation
This library is meant to work with Node JS 4 or later. You can install it using npm:
```shell
npm install node-apk
```
Please note this library is still in its early stage of development and a fair amount of things are therefore subject to change in the future. If you want to be warned of any future breaking changes we highly recomend the use of typescript for which this library has full typing support.

## Usage
Import the Apk class and instanciate it passing your APK's file path
```javascript
import {Apk} from "node-apk";
const apk = new Apk("yourapplication.apk");
```
### Manifest information
Application manifest details can be accessed using:
```javascript
apk.getManifestInfo().then((manifest) => {
    console.log(`package = ${manifest.package}`);
    console.log(`versionCode = ${manifest.versionCode}`);
    console.log(`versionName = ${manifest.versionName}`);
    // for properties which haven't any existing accessors you can use the raw binary xml
    console.log(JSON.stringify(manifest.raw, null, 4));
});
```

### Certificate information
Signature details can be retrieved with:
```javascript
apk.getCertificateInfo().then((certs) => {
    console.log(`issuer = ${certs[0].issuer}`);
    console.log(`subject = ${certs[0].subject}`);
    console.log(`validUntil = ${certs[0].validUntil}`);
    console.log(`sha256sum = ${certs[0].sha256sum}`);
});
```
### Application resources
This library supports rudimentary support for application resources as shown below:
```javascript
const iconBytes = Promise.all<Manifest, Resources>([apk.getManifestInfo(), apk.getResources()])
    .then(([manifest, resources])) => {
        const label = manifest.applicationLabel;
        if (typeof label === "string") {
            console.log(`label = ${label}`);
        } else {
            console.log(`label = ${resources.resolve(label)[0]}`);
        }
        // resolve and extract the first application icon found
        return apk.extract(resources.resolve(manifest.applicationIcon)[0]);
    }
```

### Freeing resources
Once you are done, don't forget to release you Apk object:
```javascript
apk.close();
```
## License
This software is licensed under the [MIT license](LICENSE)

Copyright &#169; 2019 All rights reserved. XdevL
