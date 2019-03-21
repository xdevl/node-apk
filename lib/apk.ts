/*Copyright (c) 2019 XdevL. All rights reserved.

This work is licensed under the terms of the MIT license.
For a copy, see <https://opensource.org/licenses/MIT>.*/

import NodeZip from "yauzl-promise";
import BinaryXml from "./binaryXml";
import Certificate from "./certificate";
import Source from "./source";

export default class Apk {
  private path: string;
  private promise: Promise<NodeZip.ZipFile>;

  constructor(path: string) {
    this.path = path;
    this.promise = NodeZip.open(path);
  }

  public lookupEntry(key: string): Promise<NodeZip.Entry> {
    return new Promise((resolve, reject) => {
      let found: NodeZip.Entry;
      this.promise.then((zip) => zip.walkEntries((entry) => {
        if (entry.fileName === key) {found = entry; }
      })).then(() => found !== undefined ? resolve(found) : reject("Entry not found: " + key));
    });
  }

  public getCertificateInfo(): Promise<Certificate[]> {
    return this.lookupEntry("META-INF/CERT.RSA")
      .then((entry) => entry.openReadStream())
      .then((stream) => this.bufferize(stream))
      .then((buffer) => Certificate.parse(buffer));
  }

  public getManifestInfo(): Promise<BinaryXml> {
    return this.lookupEntry("AndroidManifest.xml")
      .then((entry) => entry.openReadStream())
      .then((stream) => this.bufferize(stream))
      .then((buffer) => new BinaryXml(new Source(buffer)));
  }

  public close() {
    return this.promise.then((zip) => zip.close());
  }

  private bufferize(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const buffers: Buffer[] = [];
      stream.on("data", (buffer) => buffers.push(buffer));
      stream.on("end", () => resolve(Buffer.concat(buffers)));
      stream.on("error", (error) => reject(error));
    });
  }
}
