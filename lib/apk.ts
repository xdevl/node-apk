/*
 * Copyright (c) 2021 XdevL. All rights reserved.
 *
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

import NodeFs from "fs";
import {Manifest, Receiver} from "./android";
import Certificate from "./certificate";
import {Resources} from "./resources";
import Source from "./source";
import XmlElement from "./xml";
import {BufferLoader, ZipEntry} from "./zip";

export default class Apk {

  private loader: BufferLoader;

  constructor(input: string|Buffer) {
    if (typeof input === "string") {
      this.loader = () => NodeFs.promises.readFile(input);
    } else {
      this.loader = () => Promise.resolve(input);
    }
  }

  public getCertificateInfo(): Promise<Certificate[]> {
    return ZipEntry.index(this.loader).then((map) => {
      return Promise.all(Array.from(map.values())
        .filter((entry) => entry.name.startsWith("META-INF/") && entry.name.endsWith(".RSA"))
        .map((certEntry) => this.bufferize(certEntry.stream()).then((buffer) => Certificate.fromPkcs7(buffer))),
      ).then((certs) => ([] as Certificate[]).concat(...certs));
    });
  }

  public getManifestInfo(): Promise<Manifest> {
    return this.extract("AndroidManifest.xml")
      .then((buffer) => new Manifest(new XmlElement(new Source(buffer))));
  }

  public getResources(): Promise<Resources> {
    return this.extract("resources.arsc")
      .then((buffer) => new Resources(new Source(buffer)));
  }

  public extract(key: string): Promise<Buffer> {
    return ZipEntry.lookup(this.loader, key)
      .then((entry) => entry.stream())
      .then((stream) => this.bufferize(stream));
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
