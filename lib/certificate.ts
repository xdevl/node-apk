/*Copyright (c) 2019 XdevL. All rights reserved.

This work is licensed under the terms of the MIT license.
For a copy, see <https://opensource.org/licenses/MIT>.*/

import NodeCrypto from "crypto";
import NodeForge from "node-forge";

export default class Certificate {

  public static parse(buffer: Buffer): Certificate[] {
    const asn = NodeForge.asn1.fromDer(NodeForge.util.createBuffer(buffer));
    return ((NodeForge.pkcs7 as any).messageFromAsn1(asn)
        .certificates as NodeForge.pki.Certificate[])
        .map((certificate) => new Certificate(certificate));
  }

  private static getBytes(certificate: NodeForge.pki.Certificate): Buffer {
    return Buffer.from(NodeForge.pki.pemToDer(NodeForge.pki.certificateToPem(certificate)).getBytes(), 'binary');
  }

  private static md5sum(buffer: Buffer): string {
    const md5Hash = NodeCrypto.createHash("md5");
    md5Hash.update(buffer);
    return md5Hash.digest("hex");
  }

  private static attributesToString(attributes: any[]) {
    return (attributes as NodeForge.pki.CertificateField[]).map((attr) => `${attr.shortName}=${attr.value}`).join(", ");
  }

  public readonly bytes: Buffer;
  public readonly fingerprint: string;
  public readonly issuer: string;
  public readonly serial: string;
  public readonly subject: string;
  public readonly validFrom: Date;
  public readonly validUntil: Date;

  constructor(certificate: NodeForge.pki.Certificate) {
    this.bytes = Certificate.getBytes(certificate);
    this.fingerprint = Certificate.md5sum(this.bytes);
    this.issuer = Certificate.attributesToString(certificate.issuer.attributes);
    this.serial = certificate.serialNumber;
    this.subject = Certificate.attributesToString(certificate.subject.attributes);
    this.validFrom = certificate.validity.notBefore;
    this.validUntil = certificate.validity.notAfter;
  }
}
