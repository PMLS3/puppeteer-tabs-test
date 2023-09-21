import { delay } from "../../utils/info"
import { launchBrowser } from "../../utils/puppeteer/commands"
import {
  checkPage,
  closeCaseTab,
  getData,
  getIframeUrl,
  goToCase,
  goToOption,
  login,
  selectCaseType,
} from "./commands"
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log("body", body)

  // Set up the proxy details
  const email = body.email
  const password = body.password
  const perPage = Number(body.perPage)
  const pageNumber = Number(body.page)
  const option = body.option
  const proxy = body.proxy
  const headless = body.headless
  const proxyURL = body.proxyURL
  const record = body.record
  const scrapeWebsite = async () => {
    const newData: any = []
    //flquckselltasks@gmail.com  Peetmichael12
    try {
      const { browser, page } = await launchBrowser(proxy, proxyURL, headless)
      await page.goto(
        "https://core.duvalclerk.com/CoreCms.aspx?mode=PublicAccess"
      )

      // Resize window to 1536 x 747
      await page.setViewport({ width: 1536, height: 747 })

      const loggedInResult = await login(page, email, password)
      console.log("logged in", loggedInResult)
      await page.waitForNetworkIdle()
      await delay(1000)

      const selectResult: any = await selectCaseType(page, option)
      console.log("selected case type", selectResult, option)
      if (!selectResult.result) await goToOption(page)
      await page.waitForNetworkIdle()

      for (let i = 0; i < perPage; i++) {
        await delay(4000)
        console.log("iiiii", i)
        let data: any = {
          duval: {
            caseNumber: "",
            caseType: "",
            caseStatus: "",
            propertyValue: "",
            complaint: "",
          },
        }
        const checkPageResult: any = await checkPage(page, pageNumber)
        console.log("checkPageResult", checkPageResult)
        if (!checkPageResult.status && i == 0) {
          console.log("FAILED", i)
          await goToOption(page)
        }

        const goToResult = await goToCase(page, i)
        console.log("goToResult")
        await delay(1000)

        await page.waitForNetworkIdle()
        if (goToResult.message === "error") break
        const dt = await getData(page)
        console.log("dt", dt)
        data = dt.data

        newData.push(data)
        console.log("before waiting")
        await delay(4000)
        console.log("after waiting")
        const closeResult = await closeCaseTab(page, data.duval.caseNumber)
        console.log("closeResult", closeResult)
        await delay(4000)

        await page.waitForNetworkIdle()
      }

      await browser.close()

      console.log("newData", newData)
      return newData
    } catch (err) {
      console.error("Error:", err)
    }
  }

  const payload: any = await scrapeWebsite()
  return payload
})
