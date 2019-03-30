/*Copyright (c) 2019 XdevL. All rights reserved.

This work is licensed under the terms of the MIT license.
For a copy, see <https://opensource.org/licenses/MIT>.*/

declare module "node-apk" {

  interface XmlElement {
      readonly tag: string;
      readonly attributes: {
          [key: string]: any;
      };
      readonly children: BinaryXml;
  }

  interface BinaryXml {
      [key: string]: XmlElement[];
  }

  interface Certificate {
      readonly fingerprint: string;
      readonly issuer: string;
      readonly serial: string;
      readonly subject: string;
      readonly validFrom: Date;
      readonly validUntil: Date;
  }

  class Apk {
      constructor(path: string);
      getCertificateInfo(): Promise<Certificate[]>;
      getManifestInfo(): Promise<BinaryXml>;
      close(): Promise<void>;
  }
}
