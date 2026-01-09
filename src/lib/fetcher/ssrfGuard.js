import dns from "dns/promises";
import net from "net";

function isPrivateIp(ip) {
  return (
    ip.startsWith("10.") ||
    ip.startsWith("127.") ||
    ip.startsWith("169.254.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.") ||
    ip === "::1"
  );
}

export async function protectAgainstSSRF(url) {
  const { hostname } = new URL(url);

  const results = await dns.lookup(hostname, { all: true });

  for (const res of results) {
    if (net.isIP(res.address) && isPrivateIp(res.address)) {
      throw new Error("SSRF_BLOCKED");
    }
  }
}
