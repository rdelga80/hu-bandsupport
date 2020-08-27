const stripAddress = (url) => {
  url = url.replace('http://', '')
  url = url.replace('https://', '')
  
  
  if (url.endsWith('/')) { url = url.slice(0, -1) }

  return url
}

const getBandsByCity = () => {
  const bands = []

  const bandsData = bandsRaw.v2.artists

  for(const key in bandsData) {
    if (!bandsData[key].bandcamp) {
      continue
    }

    bands.push({
      name: bandsData[key].name || bandsData[key].artist,
      city: bandsData[key].city,
      bandcamp: bandsData[key].bandcamp
    })
  }

  return bands.reduce(
    (allBands, band) => {
      (allBands[band.city] || (allBands[band.city] = [])).push(band)
      return allBands
    },
    {}
  )
}

const shuffleKeys = (keys, newKeys = []) => {
  if (!keys.length) {
    return newKeys
  }

  const random = Math.floor(Math.random() * keys.length)
  newKeys.push(...keys.splice(random, 1))

  return shuffleKeys(keys, newKeys)
}

const mountBands = (bands) => {
  const newListing = document.createElement('div')

  const bandsShuffle = shuffleKeys(Object.keys(bands))

  for(const bandIndex of bandsShuffle) {
    const band = bands[bandIndex]

    const bandName = document.createElement('div')
    bandName.classList = ['band-name']
    bandName.innerText = band.name

    const bandcampAddress = document.createElement('a')
    bandcampAddress.classList = ['band-address']
    bandcampAddress.href = band.bandcamp
    bandcampAddress.target = '_blank'
    bandcampAddress.innerText = stripAddress(band.bandcamp)

    const bandCard = document.createElement('div')
    bandCard.classList = ['band-card']
    bandCard.appendChild(bandName)
    bandCard.appendChild(bandcampAddress)

    newListing.classList = ['band-info']
    newListing.appendChild(bandCard)
  }

  return newListing
}

const setBands = () => {
  const bandsByCity = getBandsByCity()

  delete bandsByCity.TEST

  const shuffledCities = shuffleKeys(Object.keys(bandsByCity))

  const holder = document.querySelector('.band-holder')

  for(const city of shuffledCities) {
    const cityTitle = document.createElement('h3')
    cityTitle.innerText = city

    const bands = mountBands(bandsByCity[city])

    const cityHold = document.createElement('div')
    cityHold.classList = ['city-hold']

    cityHold.appendChild(cityTitle)
    cityHold.appendChild(bands)

    holder.appendChild(cityHold)
  }
}

setBands()
