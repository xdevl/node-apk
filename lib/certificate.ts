/*
 * Copyright (c) 2019 XdevL. All rights reserved.
 *
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import NodeCrypto from "crypto";
import NodeForge from "node-forge";

type ForgeCertificate = NodeForge.pki.Certificate;

export default class Certificate {

  // This method is making a few assumptions: it presumes the buffer
  // only contains one signer and it takes for granted that the certificate
  // chain will necessarily be ordered in either ascending or descending order.
  // Ideally we should look up for all the signers and build up their
  // respective chain
  public static parse(buffer: Buffer): Certificate {
    const asn = NodeForge.asn1.fromDer(buffer.toString("binary"));
    const certificates = (NodeForge.pkcs7 as any).messageFromAsn1(asn)
        .certificates as ForgeCertificate[];
    return Certificate.orderChain(certificates).reduce((parent, certificate) =>
        // Not sure why typescript won't except undefined as the initial value
        new Certificate(certificate, parent), undefined as unknown as Certificate);
  }

  private static orderChain(chain: ForgeCertificate[]): ForgeCertificate[] {
    const cn = (fields: {getField: (field: string) => any}) => fields.getField("CN").value;
    return chain.length > 1 && cn(chain[0].issuer) === cn(chain[1].subject) ?
      chain.reverse() : chain;
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

  constructor(input: Buffer | ForgeCertificate, parent?: Certificate) {
    const certificate = (input instanceof Buffer) ? Certificate.certificateFromBytes(input) : input;
    this.serial = certificate.serialNumber;
    this.validFrom = certificate.validity.notBefore;
    this.validUntil = certificate.validity.notAfter;
    this.issuer = Certificate.attributesToMap(certificate.issuer.attributes);
    this.subject = Certificate.attributesToMap(certificate.subject.attributes);
    this.bytes = (input instanceof Buffer) ? input : Certificate.certificateToBytes(certificate);
    this.parent = parent;
  }

  get chain(): Certificate[] {
    return this.parent ? this.parent.chain.concat(this) : [this];
  }
}
