import Certificate from "../lib/certificate";

// openssl req -x509 -newkey rsa:2048 -keyout ca.key -out ca.pem -days 365
const CA = `MIIDbDCCAlQCCQDUd4jhuZxkrDANBgkqhkiG9w0BAQsFADB4MQswCQYDVQQGEwJV
    SzEPMA0GA1UECAwGTG9uZG9uMQ8wDQYDVQQHDAZMb25kb24xFTATBgNVBAoMDFRl
    c3QgY29tcGFueTESMBAGA1UECwwJVGVzdCB1bml0MRwwGgYDVQQDDBNUZXN0IENB
    IGNlcnRpZmljYXRlMB4XDTIxMDcwMTEzMjgwMFoXDTIyMDcwMTEzMjgwMFoweDEL
    MAkGA1UEBhMCVUsxDzANBgNVBAgMBkxvbmRvbjEPMA0GA1UEBwwGTG9uZG9uMRUw
    EwYDVQQKDAxUZXN0IGNvbXBhbnkxEjAQBgNVBAsMCVRlc3QgdW5pdDEcMBoGA1UE
    AwwTVGVzdCBDQSBjZXJ0aWZpY2F0ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC
    AQoCggEBANI6FjBUaV+v/VloHfA1MsWU9t0PFHoUFlVnpU2XcvIBgDae6J612veh
    pHb7uN4Bs5/cku7dJt5L1f8i+0HgCm3ZkitqvGEwDqDLv33ELCWDpMd246V2s4VC
    pPxd46Xnope8SZXvyP8HU10/Hr3vEKzQs9/5M8lGiyj84k/Hye0CE0RTFHbqcHt+
    KwGu6y+C65es2KYAhYw2DWa49k+xJrnXN/qqqsaz0XrSowdq5NrpMt/zdfA6TTUk
    dd3K05P51xziZwixZGRyf92iFvZQjH1kpadqiyj3QNX4jQP8jCGoCl4hkZ6A1L47
    CqCc9C5QXkrSeDTd6c4ZE98/uOukmgcCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEA
    qajdHnXm7jgkRkEtLoCugoLAG/QZE86oRKlLGBmgUMyubjPLRKlVuxBcegzocCg4
    sbsJQXcEW9euUOtYrl0UZRREACorkiePfKXz30BWMO+2xfqg0LHgUCZZxo5s2kQY
    xKUGBn0Kn9Subi1Or4Jix26sbew7AubIwjV7gJC7LHwdIwSBkjLnjc8V962JNsgl
    KC20TkPJ3RpvodJhhlK3ecPtRPz1S2UJWxvUljXnEN4nWF4KsNgVL0eFiqPM69up
    4/MKGzIGYBgMlCTx1YaQjwly2ehNuBhfoBcL59C8rZf5jCy7B9djBq2qoamsnKr2
    cgHYPgZWg5krtduKkMzHYw==`;


// openssl req -newkey rsa:2048 -nodes -keyout intermediate.key -out intermediate.csr
// openssl x509 -req -days 360 -in intermediate.csr -CA ca.pem -CAkey ca.key -CAcreateserial -out intermediate.pem
const INTERMEDIATE = `MIIDljCCAn4CCQCQK77i55JljDANBgkqhkiG9w0BAQUFADB4MQswCQYDVQQGEwJV
    SzEPMA0GA1UECAwGTG9uZG9uMQ8wDQYDVQQHDAZMb25kb24xFTATBgNVBAoMDFRl
    c3QgY29tcGFueTESMBAGA1UECwwJVGVzdCB1bml0MRwwGgYDVQQDDBNUZXN0IENB
    IGNlcnRpZmljYXRlMB4XDTIxMDcwMTE0MzkzNFoXDTIyMDYyNjE0MzkzNFowgaEx
    CzAJBgNVBAYTAlVLMQ8wDQYDVQQIDAZMb25kb24xDzANBgNVBAcMBkxvbmRvbjEn
    MCUGA1UECgweVGVzdCBpbnRlcm1lZGlhdGUgb3JnYW5pemF0aW9uMR8wHQYDVQQL
    DBZUZXN0IGludGVybWVkaWF0ZSB1bml0MSYwJAYDVQQDDB1UZXN0IGludGVybWVk
    aWF0ZSBjZXJ0aWZpY2F0ZTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
    ANDcYW27vGgKy3eU2+I/cxk4W4VCYiOeMung3CV1lfE/Ac5xErn6e3pU3V//u30f
    YmmXE2bEbM319kp/d6XWTx7BGhVdJDULcpV0PL7r+cAey2Lwvjruu6bdZjiJKaBr
    I+xf2quxU3zV/KpMRdlVxhLk7B5KadLl2TaQy4JQ+Y7Y+EKfbrOLfJL3VwZNvvFj
    L91tLDdbAu91As8O4LBzuF/dFk9+dVu5ukPIn0dsyTqYfj1ddLF8yDbMg85sPBRf
    Uxbdf6Zlf+GZLEr2XcRNT1sI5vjwk7GVsGs8ZCRt183F7Fm7JREgUSNXgMwOM5HW
    MrmCN1wHhKXr3tWOKy1tTf0CAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAY4bdeWna
    E878WjuDZeTgrUkndUoAnBbjLWznro0C8WA021WGPwkoVUCRDQpa8RXI3jKsf5gA
    +L1XPB3vRPOqx/wPRc0dQH6evBct4ffrieoPs/WpBImsStSi5r81/jysard+/zNw
    8V1hWT+uFMSNduUvduxpBqYb7WjEGBXqzzEzvC9fXE1USJOsbdNMKYdkH2kfkQmL
    uSxVmjURJSL8w0HfNWZDruJu7PHr6FLVT75uVkYJD8rZUXcg5ECEg4iTARY+conW
    N71fNZu6Ofypk/7D22l4IlOq+Pitl3QjLzT+V1q6NjhvYjA86WodeUz5AO9U3LdY
    GvttFAkkMCEXUg==`;

// openssl req -newkey rsa:2048 -nodes -keyout client.key -out client.csr
// openssl x509 -req -days 360 -in client.csr -CA intermediate.pem -CAkey intermediate.key -CAcreateserial -out client.pem
const LEAF = `MIIDqDCCApACCQDj5loJiy1YPzANBgkqhkiG9w0BAQUFADCBoTELMAkGA1UEBhMC
    VUsxDzANBgNVBAgMBkxvbmRvbjEPMA0GA1UEBwwGTG9uZG9uMScwJQYDVQQKDB5U
    ZXN0IGludGVybWVkaWF0ZSBvcmdhbml6YXRpb24xHzAdBgNVBAsMFlRlc3QgaW50
    ZXJtZWRpYXRlIHVuaXQxJjAkBgNVBAMMHVRlc3QgaW50ZXJtZWRpYXRlIGNlcnRp
    ZmljYXRlMB4XDTIxMDcwMTE0NDIzOVoXDTIyMDYyNjE0NDIzOVowgYkxCzAJBgNV
    BAYTAlVLMQ8wDQYDVQQIDAZMb25kb24xDzANBgNVBAcMBkxvbmRvbjEfMB0GA1UE
    CgwWVGVzdCBsZWFmIG9yZ2FuaXNhdGlvbjEXMBUGA1UECwwOVGVzdCBsZWFmIHVu
    aXQxHjAcBgNVBAMMFVRlc3QgbGVhZiBjZXJ0aWZpY2F0ZTCCASIwDQYJKoZIhvcN
    AQEBBQADggEPADCCAQoCggEBAJLa3eSt87VaibxUDD5vHFORasQBOMwNjIGNh9DI
    D0LjI4Hf6fC3YKpaG6X1YRPDSAuYucEdhQnlGmsOzot6+Gp/zFjQgxZyQClS927l
    VZ3bTZl1TNrjoGm9F9FNQqRa4ZVNkgm9FVGQgj8l1z7yphfwye0ggkiufishRVvG
    QvQz0a3lna+j4HMKKTjvYB83bPejru4B0khYAJgQVSteZmDZdOR8Ds6F1bZcllOc
    tt+eyDEGSg+RHBhAX+MQpHbKR4371sfvtaWR1zaXlIuYfPM3+rNgNos6gGnw0HqZ
    o3oS+/VloB4h+arLJBv1zevowlpLokuxFLV43FaL3++QJksCAwEAATANBgkqhkiG
    9w0BAQUFAAOCAQEAHUHB18VA6lXs1Tllq6GhgDQn7Zdwz7+MDWb2B4LtOMfLHBiR
    pozjYfeL2a9CnputjPKwkQWqqNosUixUw2m00kr7FozuvvCr/pNdNLbvFBkvIVuJ
    7HDBEupjhqpQRxxbFiHLJxmZPVpyE4CtgdRWPw0iOBy5HoM+plze85gv4pI1X7Jf
    VwsR2nM4UtX7bYIWG1pctnZwmXbpTzka32x01kBCN4OKdSOs1CSzt+xebd8pZO3I
    f9PQePrOkae5vOPXAvJegAJC0GMzsH4gBFgeQe/NQ8cmpmktWcf+xh69zVeHidZI
    X0BU5Yv+AhnoByC65hb2T1PwkYMNnQ06enax7A==`;

test("Self-signed certificate", () => {
    const certs = Certificate.fromDer(Buffer.from(CA, "base64"));
    expect(certs.length).toBe(1);
    const cert = certs[0];
    expect(cert.parent).toBeUndefined();
    expect(cert.subject.get("CN")).toBe("Test CA certificate");
});

test("Simple chain", () => {
    const certs = Certificate.fromDer(Buffer.from(INTERMEDIATE, "base64"), Buffer.from(CA, "base64"));
    expect(certs.length).toBe(1);
    const cert = certs[0];
    expect(cert.subject.get("CN")).toBe("Test intermediate certificate");
    expect(cert.parent!.subject.get("CN")).toBe("Test CA certificate");
});

test("Complex chain", () => {
    const certs = Certificate.fromDer(Buffer.from(CA, "base64"), Buffer.from(LEAF, "base64"), Buffer.from(INTERMEDIATE, "base64"));
    expect(certs.length).toBe(1);
    const cert = certs[0];
    expect(cert.subject.get("CN")).toBe("Test leaf certificate");
    expect(cert.parent!.subject.get("CN")).toBe("Test intermediate certificate");
    expect(cert.parent!.parent!.subject.get("CN")).toBe("Test CA certificate");
});

test("Multiple certificates", () => {
    const certs = Certificate.fromDer(Buffer.from(CA, "base64"), Buffer.from(LEAF, "base64"));
    expect(certs.length).toBe(2);
});