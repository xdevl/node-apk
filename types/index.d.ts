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
      readonly issuer: string;
      readonly serial: string;
      readonly subject: string;
      readonly validFrom: Date;
      readonly validUntil: Date;
      readonly md5sum: string;
      readonly sha1sum: string;
      readonly sha256sum: string;
  }

  class Apk {
      constructor(input: string|Buffer);
      getCertificateInfo(): Promise<Certificate[]>;
      getManifestInfo(): Promise<BinaryXml>;
      close(): Promise<void>;
  }
}
