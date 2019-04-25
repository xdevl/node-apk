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

  private static attributesToString(attributes: any[]) {
    return (attributes as NodeForge.pki.CertificateField[]).map((attr) => `${attr.shortName}=${attr.value}`).join(", ");
  }

  public readonly issuer: string;
  public readonly serial: string;
  public readonly subject: string;
  public readonly validFrom: Date;
  public readonly validUntil: Date;
  public readonly md5sum: string;
  public readonly sha1sum: string;
  public readonly sha256sum: string;

  constructor(certificate: NodeForge.pki.Certificate) {
    this.issuer = Certificate.attributesToString(certificate.issuer.attributes);
    this.serial = certificate.serialNumber;
    this.subject = Certificate.attributesToString(certificate.subject.attributes);
    this.validFrom = certificate.validity.notBefore;
    this.validUntil = certificate.validity.notAfter;
    const bytes = NodeForge.util.binary.raw.decode(NodeForge.pki.pemToDer(
      NodeForge.pki.certificateToPem(certificate)).getBytes());
    this.md5sum = NodeCrypto.createHash("md5").update(bytes).digest("hex");
    this.sha1sum = NodeCrypto.createHash("sha1").update(bytes).digest("hex");
    this.sha256sum = NodeCrypto.createHash("sha256").update(bytes).digest("hex");
  }
}
