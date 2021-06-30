/*
 * Copyright (c) 2021 XdevL. All rights reserved.
 *
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */
import NodeForge from "node-forge";

type ForgeCertificate = NodeForge.pki.Certificate;

const cn = (fields: {getField: (field: string) => any}) => fields.getField("CN").value;

class CertificateStore {
  private store = new Map<string, ForgeCertificate>();


  constructor(...certificates: ForgeCertificate[]) {
    certificates.forEach((cert) => this.store.set(cn(cert.subject), cert));
  }

  getByCommonName(commonName: string): ForgeCertificate|undefined {
    return this.store.get(commonName);
  }

  leaves(): ForgeCertificate[] {
    const leaves = new Set(this.store.keys());
    this.store.forEach((cert) => !cert.isIssuer(cert) && leaves.delete(cn(cert.issuer)));
    return Array.from(leaves).map((cn) => this.getByCommonName(cn)!);
  }

  chain<T>(certificate: ForgeCertificate, create: (cert: ForgeCertificate, parent?: T) => T): T {
    const issuer = this.getByCommonName(cn(certificate.issuer));
    if (issuer == null || certificate.isIssuer(certificate)) {
      return create(certificate)
    } else {
      return create(certificate, this.chain(issuer, create));
    }
  }
}

export default class Certificate {

  public static fromPkcs7(buffer: Buffer): Certificate[] {
    const asn = NodeForge.asn1.fromDer(buffer.toString("binary"));
    const certificates = (NodeForge.pkcs7 as any).messageFromAsn1(asn)
        .certificates as ForgeCertificate[];
    return Certificate.from(...certificates);
  }

  public static fromDer(...certificates: Buffer[]): Certificate[] {
    return Certificate.from(...certificates.map((der) => Certificate.certificateFromBytes(der)));
  }

  private static from(...certificates: ForgeCertificate[]): Certificate[] {
    const store = new CertificateStore(...certificates);
    return store.leaves().map((leaf) => store.chain(leaf, (cert, parent) => new Certificate(cert, parent)));
  }

  private static attributesToMap(attributes: any[]): Map<string, string> {
    return new Map((attributes as NodeForge.pki.CertificateField[])
      .map((attr) => [attr.shortName, attr.value])
      .filter((pair): pair is [string, string] => !!pair[0] && !!pair[1]));
  }

  private static certificateToBytes(certificate: ForgeCertificate): Buffer {
    return Buffer.from(NodeForge.asn1.toDer(NodeForge.pki.certificateToAsn1(certificate))
        .getBytes(), "binary");
  }

  private static certificateFromBytes(bytes: Buffer): ForgeCertificate {
    return NodeForge.pki.certificateFromAsn1(
        NodeForge.asn1.fromDer(bytes.toString("binary")));
  }

  public readonly parent?: Certificate;
  public readonly serial: string;
  public readonly validFrom: Date;
  public readonly validUntil: Date;
  public readonly issuer: Map<string, string>;
  public readonly subject: Map<string, string>;
  public readonly bytes: Buffer;

  constructor(input: ForgeCertificate, parent?: Certificate) {
    const certificate = input;
    this.serial = certificate.serialNumber;
    this.validFrom = certificate.validity.notBefore;
    this.validUntil = certificate.validity.notAfter;
    this.issuer = Certificate.attributesToMap(certificate.issuer.attributes);
    this.subject = Certificate.attributesToMap(certificate.subject.attributes);
    this.bytes = Certificate.certificateToBytes(certificate);
    this.parent = parent;
  }

  get chain(): Certificate[] {
    return this.parent ? this.parent.chain.concat(this) : [this];
  }
}
