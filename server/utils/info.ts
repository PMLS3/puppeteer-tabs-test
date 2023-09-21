export const getNumber = (inputString: string) => {
  const regex = /\d+(,\d+)?/ // Matches one or more digits, optionally followed by a comma and more digits

  const match = inputString.match(regex)

  if (match) {
    const numberString = match[0].replace(',', '') // Remove any commas if present
    const number = parseFloat(numberString)
    return number
  } else {
    console.log('No number found in the string.')
    return 0
  }
}

export const delay = (time: any) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}

export const splitNumberText = (inputString: string) => {
  // const inputString = "FL32258";
  console.log('sple', inputString)
  // Use regular expression to split the string into letters and numbers
  const matches = inputString.match(/([A-Za-z]+)(\d+)/)

  if (matches && matches.length === 3) {
    const textPart = matches[1] // This will be "FL"
    const numberPart = matches[2] // This will be "32258"

    console.log('Text Part:', textPart)
    console.log('Number Part:', numberPart)
    return { textPart, numberPart }
  } else {
    console.log('Pattern not found in the input string.')
  }
}

export const capitalizeWords = (inputString: any) => {
  const words = inputString.split(' ')

  const capitalizedWords = words.map((word: string) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  })

  return capitalizedWords.join(' ')
}

export const replaceAddress = (addr: any) => {
  const replacements = [
    ['LANE', 'LN'],
    ['ROAD', 'RD'],
    ['AVENUE', 'AVE'],
    ['STREET', 'ST'],
    ['CIRCLE', 'CIR'],
    ['BOULEVARD', 'BLVD'],
    ['DRIVE', 'DR'],
    ['TERRACE', 'TER'],
    ['COURT', 'CT'],
    ['PLACE', 'PL'],
    ['PARKWAY', 'PKWY'],
    ['HIGHWAY', 'HWY'],
    ['SQUARE', 'SQ'],
    ['LOOP', 'LP'],
    ['RUN', 'RN'],
    ['TRAIL', 'TRL'],
    ['PARK', 'PK'],
    ['COVE', 'CV'],
    // ['CREEK', 'CRK'],
    ['CROSSING', 'XING'],
    ['POND', 'PND'],
    ['HILL', 'HL'],
    ['BEND', 'BND'],
    ['CANYON', 'CYN'],
    ['Lane', 'LN'],
    ['Road', 'RD'],
    ['Avenue', 'AVE'],
    ['Street', 'ST'],
    ['Circle', 'CIR'],
    ['Boulevard', 'BLVD'],
    ['Drive', 'DR'],
    ['Terrace', 'TER'],
    ['Court', 'CT'],
    ['Place', 'PL'],
    ['Parkway', 'PKWY'],
    ['Highway', 'HWY'],
    ['Square', 'SQ'],
    ['Loop', 'LP'],
    ['Run', 'RN'],
    ['Trail', 'TRL'],
    ['Park', 'PK'],
    ['Cove', 'CV'],
    // ['Creek', 'CRK'],
    ['Crossing', 'XING'],
    ['Pond', 'PND'],
    ['Hill', 'HL'],
    ['Bend', 'BND'],
    ['Canyon', 'CYN'],
  ]

  // const addr = {
  //   address: "123 Main LANE Street"
  // };

  replacements.forEach(([original, replacement]) => {
    addr.address = addr.address.replace(
      new RegExp(`\\b${original}\\b`, 'gi'),
      replacement,
    )
  })

  console.log('here we are and are', addr.address)
  console.log('here we are and are', addr)

  return addr
}

export const isInAddress = (address: string) => {
  const array: any = [
    'jacksonville',
    'jacksonville beach',
    'atlantic beach',
    'neptune beach',
    'baldwin',
  ]

  let found = false
  array.forEach((item: string) => {
    if (address.toLocaleLowerCase().includes(item)) {
      found = true
    }
  })
  return found
}
