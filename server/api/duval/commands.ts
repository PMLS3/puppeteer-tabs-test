import { delay, isInAddress } from "../../utils/info"
export const login = async (
  page: {
    waitForSelector: (arg0: string) => any
    type: (arg0: string, arg1: any) => any
    click: (arg0: string) => any
    waitForNetworkIdle: () => any
  },
  email: any,
  password: any
) => {
  console.log("EMAIL", email)
  console.log("PASSWORD", password)
  const elementName = "ctl00$c_UsernameTextBox"
  const elementPassword = "ctl00$c_PasswordTextBox"
  const element = await page.waitForSelector(`[name="${elementName}"]`)
  const elementP = await page.waitForSelector(`[name="${elementPassword}"]`)
  if (element) {
    //write email address
    await page.type(`[name="${elementName}"]`, email)
    //write password
    await page.type(`[name="${elementPassword}"]`, password)
  } else {
    console.log("Element not found.")
  }

  // Click on <input> (selector chosen with the aid of the Elements inspector)
  // input value = "Login to CORE"
  // Select the input button inside the td element
  const tdSelector = "td.caseSearchFooter"
  await page.waitForSelector(tdSelector)

  const inputSelector = `${tdSelector} input[type="button"]`

  // Click the input button
  await page.click(inputSelector)
  // await page.click('[value="Login to CORE"]')
  // wait for 3 seconds
  await page.waitForNetworkIdle()
  console.log("clicked on login to core")
  return true
}

export const selectCaseType = async (page: any, option: string) => {
  console.log("option", option)
  // '491,492,493,627,628,629'
  try {
    const selectElements = await page.$$("select")
    for (let i = 0; i < selectElements.length; i++) {
      const selectElement = selectElements[i]
      const selectElementInnerText = await page.evaluate(
        (el: { innerText: any }) => el.innerText,
        selectElement
      )

      if (selectElementInnerText.includes("select a case type")) {
        await selectElement.select(option)
      }
    }
    await page.waitForNetworkIdle()
    const tdSelector = "td.caseSearchFooter"
    await page.waitForSelector(tdSelector)

    const inputSelector = `${tdSelector} input[type="button"]`

    // Wait for the input to be clickable
    await page.waitForSelector(inputSelector)

    // Click the input button
    const button = await page.$$(inputSelector)
    await button.click()

    // Click the input button
    await page.click(inputSelector)
    await page.waitForNetworkIdle()
    return {
      status: true,
      message: "Selection Successful",
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: "Selection Failed",
    }
  }
}

export const goToOption = async (page: any) => {
  // '491,492,493,627,628,629'
  try {
    await page.waitForNetworkIdle()
    await page.click('[value="Begin Search"]')
    await page.waitForNetworkIdle()
    return {
      status: true,
      message: "Go to Option Successful",
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: "Go to Option Failed",
    }
  }
}

export const goToCase = async (page: any, caseNumber: number) => {
  try {
    // console.log('goToCase', caseNumber)
    // const itemNum = caseNumber + 2
    // console.log('itemNum', itemNum)
    // const itemClass = `.igtab_THContent tbody:nth-child(${itemNum})`
    // console.log('itemClass', itemClass)
    // const item = await page.$(itemClass)
    // console.log('item', item)
    // await page.waitForSelector(
    //   `.igtab_THContent tbody:nth-child(${caseNumber + 2})`,
    // )
    // await page.click(
    //   `.igtab_THContent tbody:nth-child(${caseNumber + 2}) td:nth-child(1)`,
    // )
    // Evaluate the JavaScript code in the context of the page to get the table element.
    const table = await page.$("table.searchResultsTable")

    // Replace 'INDEX_HERE' with the index of the <tbody> you want to click (e.g., 0 for the first tbody).
    const indexToClick = caseNumber + 2
    console.log("indexToClick", indexToClick)
    await page.waitForSelector(
      `.igtab_THContent > .searchResultsContainer tbody:nth-child(${indexToClick}) td:nth-child(1)`
    )
    await page.click(
      `.igtab_THContent > .searchResultsContainer tbody:nth-child(${indexToClick}) td:nth-child(1)`
    )
    await page.waitForNetworkIdle()
    return {
      status: true,
      message: "Went to Case Successful",
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: "Going to case Failed",
    }
  }
}

export const checkPage = async (page: any, pgNumber: any) => {
  console.log("checkPage", pgNumber)
  try {
    await delay(500)
    // Wait for the element to appear on the page
    await page.waitForSelector(
      ".igtab_THContent:nth-child(4) .searchResultsControl_Top > .searchResultsControl_Page > input"
    )

    await page.$eval(
      ".igtab_THContent:nth-child(4) .searchResultsControl_Top > .searchResultsControl_Page > input",
      (input: { value: string }) => (input.value = "")
    )

    await page.type(
      ".igtab_THContent:nth-child(4) .searchResultsControl_Top > .searchResultsControl_Page > input",
      String(pgNumber)
    )
    await delay(500)

    await page.keyboard.press("Enter")
    return {
      status: true,
      message: "Checked Success Successful",
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: "Going to case Failed",
    }
  }
}

export const getData = async (page: any) => {
  console.log("getData")
  await page.waitForNetworkIdle()
  const newData: any = {
    addresses: [],
    phones: [],
    duval: {
      plaintiffs: [],
      defendants: [],
      caseNumber: "",
      caseType: "",
      caseStatus: "",
      caseFileDate: "",
    },
  }

  try {
    // get all tables from the page and loop through them
    // const tables = await page.$$('table')

    const caseNumber = await page.$eval(
      "#c_CaseNumberLabel",
      (el: { innerText: any }) => {
        return el.innerText
      }
    )

    const caseNumber2 = await page.evaluate(() => {
      const caseNumberElement = document.querySelector("#c_CaseNumberLabel")
      return caseNumberElement ? caseNumberElement.innerText : null
    })
    console.log("caseNumber", caseNumber)
    newData.duval.caseNumber = caseNumber ? caseNumber : ""
    newData.duval.caseNumber2 = caseNumber2 ? caseNumber2 : ""

    const caseStatus = await page.$eval(
      ".igtab_THContent > .caseInquireResult tr:nth-child(2) > td:nth-child(2)",
      (el: { innerText: any }) => {
        return el.innerText
      }
    )
    newData.duval.caseStatus = caseStatus ? caseStatus : ""

    const caseFileDate = await page.$eval(
      ".igtab_THContent > .caseInquireResult tr:nth-child(2) > td:nth-child(4)",
      (el: { innerText: any }) => {
        return el.innerText
      }
    )
    newData.duval.caseFileDate = caseFileDate ? caseFileDate : ""

    const addTable = await page.$eval(
      "#c_PartiesPanel table",
      (table: { querySelectorAll: (arg0: string) => any }) => {
        const rows = table.querySelectorAll("tr")
        const dta: any = {
          plaintiffs: [],
          defendants: [],
        }

        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
          const firstCell = rows[rowIndex].querySelector("td:first-child")
          const plaintiffDefendant =
            rows[rowIndex].querySelector("td:nth-child(2)")

          const thirdCell = rows[rowIndex].querySelector("td:nth-child(3)")
          const plaintiff =
            plaintiffDefendant?.textContent?.includes("PLAINTIFF")
          const payload: any = {
            name: firstCell.textContent.trim(),
            address: thirdCell.textContent.trim(),
          }
          // console.log('payload plaintifs', plaintiff, payload)
          if (plaintiff && rowIndex !== 0) dta.plaintiffs.push(payload)
          else if (!plaintiff && rowIndex !== 0) dta.defendants.push(payload)

          // if (
          //   !plaintiff &&
          //   rowIndex !== 0 &&
          //   payload.name.includes('UNKNOWN') &&
          //   !payload.address.includes('UNKNOWN')
          // )
          //   defId = rowIndex
        }

        return dta
      }
    )
    console.log("addTable", addTable)
    newData.duval.plaintiffs = addTable.plaintiffs
    newData.duval.defendants = addTable.defendants
    let hasUnknown = false
    for (let m = 0; m < newData.duval.defendants.length; m++) {
      const def = newData.duval.defendants[m]
      if (m === 0) {
        newData.addresses = [{ address: def.address }]
      }
      if (
        def.name.includes("UNKNOWN TENANT") &&
        !def.address.includes("UNKNOWN") &&
        isInAddress(def.address)
      ) {
        newData.addresses = [{ address: def.address }]
        hasUnknown = true
        break
      }
    }

    if (!hasUnknown) {
      for (let m = 0; m < newData.duval.defendants.length; m++) {
        const def = newData.duval.defendants[m]
        if (
          def.name.includes("UNKNOWN HEIRS") &&
          !def.address.includes("UNKNOWN") &&
          isInAddress(def.address)
        ) {
          newData.addresses = [{ address: def.address }]
          hasUnknown = true
          break
        }
      }
    }

    if (!hasUnknown) {
      for (let m = 0; m < newData.duval.defendants.length; m++) {
        const def = newData.duval.defendants[m]
        if (
          def.name.includes("UNKNOWN TENANT IN POSSESSION") &&
          !def.address.includes("UNKNOWN")
        ) {
          newData.addresses = [{ address: def.address }]
          hasUnknown = true
          break
        }
      }
    }

    if (!hasUnknown) {
      for (let m = 0; m < newData.duval.defendants.length; m++) {
        const def = newData.duval.defendants[m]
        if (
          def.name.includes("UNKNOWN PARTY IN POSSESSION") &&
          !def.address.includes("UNKNOWN") &&
          isInAddress(def.address)
        ) {
          newData.addresses = [{ address: def.address }]
          hasUnknown = true
          break
        }
      }
    }

    if (!hasUnknown) {
      for (let m = 0; m < newData.duval.defendants.length; m++) {
        const def = newData.duval.defendants[m]
        if (
          def.name.includes("UNKNOWN TENANT OWNER") &&
          !def.address.includes("UNKNOWN") &&
          isInAddress(def.address)
        ) {
          newData.addresses = [{ address: def.address }]
          hasUnknown = true
          break
        }
      }
    }

    if (!hasUnknown) {
      for (let m = 0; m < newData.duval.defendants.length; m++) {
        const def = newData.duval.defendants[m]
        if (
          def.name.includes("UNKNOWN") &&
          !def.address.includes("UNKNOWN") &&
          isInAddress(def.address)
        ) {
          newData.addresses = [{ address: def.address }]
          hasUnknown = true
          break
        }
      }
    }
    // Loop through each row

    // const rowIndexWithUnknown = await page.$eval(
    //   '#c_PartiesPanel table',
    //   (table: { querySelectorAll: (arg0: string) => any }) => {
    //     const rows = table.querySelectorAll('tr')

    //     for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    //       const firstCell = rows[rowIndex].querySelector('td:first-child')
    //       if (firstCell && firstCell.textContent.includes('UNKNOWN')) {
    //         return rowIndex // Return the index of the matching row
    //       }
    //     }

    //     return -1 // Return -1 if no matching row is found
    //   },
    // )
    // console.log('rowIndexWithUnknown', rowIndexWithUnknown)

    // const addressTags = await page.$eval(
    //   '#c_PartiesPanel table',
    //   (table: { querySelectorAll: (arg0: string) => any }) => {
    //     const addressTags: any = []

    //     const addressElements = table.querySelectorAll('address')

    //     addressElements.forEach((addressElement: any) => {
    //       addressTags.push(addressElement.innerHTML.trim())
    //     })

    //     return addressTags
    //   },
    // )
    // console.log('addressTags', addressTags)

    // for (let y = 0; y < addressTags.length; y++) {
    //   let adr: any = addressTags[y].trim()
    //   adr = adr.replace(/<br>/g, ', ')
    //   adr = capitalizeWords(adr)
    //   const adrArr = adr.split(', ')
    //   const { textPart, numberPart } = splitNumberText(
    //     adrArr[adrArr.length - 1],
    //   )
    // }

    // console.log(newData)
    return {
      status: true,
      message: "Data Successful",
      data: newData,
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: "Data Retriev Failed",
    }
  }
}

export const getIframeUrl = async (
  page: any,
  include1: string,
  include2: string
) => {
  try {
    const data: any = {}
    const tableRows = await page.$$("#c_DocketsPanel table tr")
    // Iterate through the rows to find the row that meets the conditions
    let targetRow = null
    for (const row of tableRows) {
      const lastCell: any = await row.$("td:last-child")

      const rowText = await row.evaluate(
        (element: { innerText: any }) => element.innerText
      )
      if (rowText.includes(include1) && rowText.includes(include2)) {
        const cellText = await lastCell.evaluate(
          (element: any) => element.innerText
        )
        try {
          await lastCell.click()
        } catch (error) {
          targetRow = null
          break
        }

        // await lastCell.click()
        targetRow = row
        break
      }
    }

    if (targetRow === null) return

    targetRow = null

    try {
      await page.waitForNetworkIdle()

      //wait for iframe to load
      await page.waitForSelector("iframe")
      //get iframe in page
      await page.waitForSelector("iframe")

      // Get the src attribute of the iframe using page.evaluate
      const src = await page.evaluate(() => {
        const iframe = document.querySelector("iframe")
        return iframe ? iframe.getAttribute("src") : null
      })

      console.log("PDF source:", src)
      if (src) {
        if (include1 === "COMPLAINT") {
          data["complaint"] = src
        } else {
          data["property_value"] = src
        }
      }
      // select all classes '.igtab_THClose' and click the 3rd and fourth
      const elementSelector = '.igtab_THTabSel > [alt="Close"]'
      await page.waitForSelector(elementSelector)

      // Click the element
      await page.click(elementSelector)
    } catch (error) {
      // select all classes '.igtab_THClose' and click the 3rd and fourth
      const elementSelector = '.igtab_THTabSel > [alt="Close"]'
      await page.waitForSelector(elementSelector)
    }
    return {
      status: true,
      message: "Data Successful",
      data: data,
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: "Iframe Retriev Failed",
    }
  }
}

export const closeCaseTab = async (
  page: {
    waitForNetworkIdle: () => any
    waitForSelector: (arg0: string) => any
    click: (arg0: string) => any
  },
  caseNumber: any
) => {
  try {
    await page.waitForNetworkIdle()

    // const inner = await page.evaluate(() => {
    //   const tab: any = document.querySelector('.igtab_THTabSel')
    //   //get innerText of tab
    //   return tab ? tab.innerText : null
    // })
    let extractedString = ""
    const inputString = caseNumber
    const pattern = /\d{4}-[A-Z]{2}-\d{6}/ // Regular expression pattern to match the desired format

    const match = inputString.match(pattern)

    if (match) {
      extractedString = match[0]
      console.log(extractedString) // This will output "2023-CA-010446"
    } else {
      console.log("No match found.")
    }

    const elementSelector2 = '.igtab_THTabSel > [alt="Close"]'
    try {
      // const targetInnerText = extractedString
      // console.log('targetInnerText', targetInnerText)
      // const targetAttributes = {
      //   class: 'igtab_THTab igtab_THTabSel',
      // }
      // const isElementPresent = await page.evaluate(
      //   (targetAttributes, targetInnerText) => {
      //     // Use JavaScript code to search for the element with the specified attributes and inner text.
      //     const elements = document.querySelectorAll(
      //       '[class="igtab_THTab igtab_THTabSel"][data-ig="x:348770711.4:mkr:ti3"]',
      //     )
      //     for (const element of elements) {
      //       if (element.innerText === targetInnerText) {
      //         return true
      //       }
      //     }
      //     return false
      //   },
      //   targetAttributes,
      //   targetInnerText,
      // )

      // if (isElementPresent) {
      //   console.log(
      //     'Element with specified attributes and inner text found on the page.',
      //   )
      // } else {
      //   console.log(
      //     'Element with specified attributes and inner text not found on the page.',
      //   )
      // }

      // if (isElementPresent) {
      //   console.log('Element with inner text found on the page.')
      //   await page.waitForSelector(elementSelector2)
      //   // Click the element
      //   await page.click(elementSelector2)
      // } else {
      //   console.log('Element with inner text not found on the page.')
      // }
      await page.waitForSelector(elementSelector2)
      // Click the element
      await page.click(elementSelector2)
      console.log("elementSelector2", elementSelector2)
    } catch (error) {
      console.log("error", error)
    }
    return {
      status: true,
      message: "Closed Successful",
      data: "",
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      message: "Closed Failed",
    }
  }
}
