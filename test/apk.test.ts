import http from "http";
import https from "https";
import Apk from "../lib/apk"

test("Can read APK information", async () => {
    const apk = new Apk(await downloadApk("https://f-droid.org/repo/com.android.music_1.apk"))
    const info = await apk.getManifestInfo();
    const resources = await apk.getResources();

    expect(info.package).toBe("com.android.music")
    expect(info.versionCode).toBe(1)
    expect(info.versionName).toBe("android-4.2.2_r1.2")
    expect(resources.resolve(info.applicationLabel as number)[0].value).toBe("Music")
});

async function downloadApk(url: string): Promise<Buffer> {
    return bufferize(await request(url));
}

function request(url: string): Promise<http.IncomingMessage> {
    return new Promise((resolve, reject) => {
        const req = https.get(url, (response) => {
            if (response.statusCode == 200) {
                resolve(response);
            } else {
                reject(new Error(`Invalid status code: ${response.statusCode}`))
            }
        }).on("error", (error) => reject(error));
        req.end();
    });
}

function bufferize(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const buffers: Buffer[] = [];
      stream.on("data", (buffer) => buffers.push(buffer));
      stream.on("end", () => resolve(Buffer.concat(buffers)));
      stream.on("error", (error) => reject(error));
    });
  }