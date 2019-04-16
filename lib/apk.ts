/*Copyright (c) 2019 XdevL. All rights reserved.

This work is licensed under the terms of the MIT license.
For a copy, see <https://opensource.org/licenses/MIT>.*/

import NodeFs from "fs";
import BinaryXml from "./binaryXml";
import Certificate from "./certificate";
import Source from "./source";
import ZipEntry from "./zip";

export default class Apk {
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  public lookupEntry(key: string): Promise<NodeJS.ReadableStream> {
    return ZipEntry.lookup(this.path, key).then((entry) => entry.stream());
  }

  public getCertificateInfo(): Promise<Certificate[]> {
    return this.lookupEntry("META-INF/CERT.RSA")
      .then((stream) => this.bufferize(stream))
      .then((buffer) => Certificate.parse(buffer));
  }

  public getManifestInfo(): Promise<BinaryXml> {
    return this.lookupEntry("AndroidManifest.xml")
      .then((stream) => this.bufferize(stream))
      .then((buffer) => new BinaryXml(new Source(buffer)));
  }

  public close() {
    return undefined;
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
