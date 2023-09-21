import proxyChain from "proxy-chain"
import puppeteer from "puppeteer"
// import AdblockerPlugin from "puppeteer-extra-plugin-adblocker"
// import "puppeteer-extra-plugin-stealth/evasions/chrome.app"
// import "puppeteer-extra-plugin-stealth/evasions/chrome.csi"
// import "puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes"
// import "puppeteer-extra-plugin-stealth/evasions/chrome.runtime"
// import "puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow"
// import "puppeteer-extra-plugin-stealth/evasions/media.codecs"
// import "puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency"
// import "puppeteer-extra-plugin-stealth/evasions/navigator.languages"
// import "puppeteer-extra-plugin-stealth/evasions/navigator.permissions"
// import "puppeteer-extra-plugin-stealth/evasions/navigator.plugins"
// import "puppeteer-extra-plugin-stealth/evasions/navigator.vendor"
// import "puppeteer-extra-plugin-stealth/evasions/navigator.webdriver"
// import "puppeteer-extra-plugin-stealth/evasions/sourceurl"
// import "puppeteer-extra-plugin-stealth/evasions/user-agent-override"
// import "puppeteer-extra-plugin-stealth/evasions/webgl.vendor"
// import "puppeteer-extra-plugin-stealth/evasions/window.outerdimensions"
// import StealthPlugin from "puppeteer-extra-plugin-stealth"

// puppeteer.use(StealthPlugin())
// puppeteer.use(AdblockerPlugin({ blockTrackers: true }))

export const launchBrowser = async (
  proxy: boolean,
  proxyURL: string,
  headless: boolean
) => {
  console.log("proxy", proxy)
  console.log("proxyURL", proxyURL)

  let newProxyUrl: any
  if (proxy) newProxyUrl = await proxyChain.anonymizeProxy(proxyURL)

  // code.eval
  let browser: any
  if (proxy) {
    browser = await puppeteer.launch({
      headless: headless,
      slowMo: 0, // Uncomment to visualize test
      ignoreHTTPSErrors: true,
      args: [
        "--window-size=1400,900",
        "--remote-debugging-port=9222",
        "--remote-debugging-address=0.0.0.0", // You know what your doing?
        "--disable-gpu",
        "--disable-features=IsolateOrigins,site-per-process",
        "--blink-settings=imagesEnabled=true",
        `--proxy-server=${newProxyUrl}`,
      ],
    })
  } else {
    console.log("no proxy")
    browser = await puppeteer.launch({
      headless: headless,
      slowMo: 0, // Uncomment to visualize test
      ignoreHTTPSErrors: true,
      args: [
        "--window-size=1400,900",
        "--remote-debugging-port=9222",
        "--remote-debugging-address=0.0.0.0", // You know what your doing?
        "--disable-gpu",
        "--disable-features=IsolateOrigins,site-per-process",
        "--blink-settings=imagesEnabled=true",
      ],
    })
  }

  const page = await browser.newPage()
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
  )

  return { browser, page }
}
