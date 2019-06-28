# Node APK
A library to parse Android application's manifest and signature

## Installation
This library is meant to work with Node JS 4 or later. You can install it using npm:
```shell
npm install node-apk
```
The use of typescript is highly recommended for which this library has full typing support.

## Usage
Import the Apk class and instantiate it passing your APK's file path
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
Certificates can be retrieved like the following:
```javascript
apk.getCertificateInfo().then((certs) => certs.foreach((cert) => {
    console.log(`issuer = ${cert.issuer.get("CN")}`);
    console.log(`subject = ${cert.subject.get("CN")}`);
    console.log(`validUntil = ${cert.validUntil}`);
    console.log(cert.bytes.toString("base64"));
}));
```
### Application resources
Application resources can be resolved as shown below:
```javascript
const iconBytes = Promise.all<Manifest, Resources>([apk.getManifestInfo(), apk.getResources()])
    .then(([manifest, resources])) => {
        let label = manifest.applicationLabel;
        if (typeof label !== "string") {
            const all = resources.resolve(label);
            label = (all.find((res) => (res.locale && res.locale.language === "fr")) || all[0]).value;
        }
        console.log(`label = ${label}`);

        // resolve and extract the first application icon found
        return apk.extract(resources.resolve(manifest.applicationIcon)[0]);
    }
```

### Cleaning up
Once you are done, don't forget to release you Apk object:
```javascript
apk.close();
```
## License
This software is licensed under the [MIT license](LICENSE)

Copyright &#169; 2019 All rights reserved. XdevL
