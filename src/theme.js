const breakpoints = ['640px', '960px', '1600px']
breakpoints.sm = breakpoints[0]
breakpoints.md = breakpoints[1]
breakpoints.lg = breakpoints[2]

const space = [4, 8, 16, 24, 32, 40, 48, 56, 64, 80]
const radii = [4, 8, 16, 24]

const fontSizes = [
  '10px',
  '12px',
  '13px',
  '15px',
  '19px',
  '22px',
  '26px',
  '30px',
  '36px',
  '44px',
  '60px',
  '14px',
  '24px',
  '72px',
  '56px',
  '16px',
]

const zIndices = [0, 1, 2, 3, 4, 5]

const lineHeights = [
  '12px',
  '16px',
  '16px',
  '20px',
  '24px',
  '32px',
  '36px',
  '40px',
  '48px',
  '56px',
  '72px',
  '18px',
  '88px',
  '14px',
]

const fonts = {
  bold: 'NotoSans-Bold',
  book: 'NotoSans-Regular',
  medium: 'NotoSans-SemiBold',
  condensed: 'NotoSans-Regular',
}

export const defaultColor = { H: 250, S: 100, L: 65 }

export function themeWrapper(
  color = defaultColor,
  isLightTheme = false,
  eventBranding = {},
  primaryButtonTextColor = '',
  landingPageBranding = {}
) {
  const accentPrimary = []
  const accentSecondary = []
  const semantic = []
  const ambience = []
  const lighting = []

  const accentSpring = []
  const accentSun = []
  const accentCarrot = []
  const accentBrick = []
  const accentBlush = []

  const accentSea = []
  const accentRose = []
  const accentOrchid = []
  const accentSky = []
  const accentMidnight = []

  const accentGradient = []
  const ambienceGrey = []

  const ambienceBasePrimary = []

  const ambienceBase = isLightTheme ? { H: 250, S: 100, L: 64 } : defaultColor
  const black = 'hsl(0,0%,0%)'
  const white = 'hsl(0,0%,100%)'
  const accentQuaternary = 'hsl(248, 83%, 99%)'
  const accentDisable = 'hsl(250, 10%, 68%)'
  const accentContentDisable = 'hsl(250, 10%, 76%)'
  const accentContentPrimary = 'hsl(255, 10%, 8%)'
  const accentContentTertiary = 'hsl(251, 10%, 44%)'
  const premiumColor = 'hsl(43deg 53% 66%)'
  const darkTertiary = 'hsl(252, 10%, 20%)'
  const darkContentTertiary = 'hsl(250, 10%, 76%)'
  const darkContentSecondary = 'hsla(250, 10%, 96%, 1)'
  const accentOrange = 'hsl(19, 73%, 84%)'
  const lightWhite = []

  const setColors = (updateColor) => {
    accentPrimary[0] =
      'hsl(' +
      updateColor.H +
      ',' +
      (updateColor.S + 20) +
      '%,' +
      (updateColor.L + 10) +
      '%)'
    accentPrimary[1] =
      'hsl(' + updateColor.H + ',' + updateColor.S + '%,' + updateColor.L + '%)'
    accentPrimary[2] =
      'hsl(' +
      updateColor.H +
      ',' +
      (updateColor.S - 20) +
      '%,' +
      (updateColor.L - 10) +
      '%)'

    accentSecondary[0] =
      'hsl(' +
      (updateColor.H - 50) +
      ',' +
      (updateColor.S + 20) +
      '%,' +
      (updateColor.L + 10) +
      '%)'
    accentSecondary[1] =
      'hsl(' +
      (updateColor.H - 50) +
      ',' +
      updateColor.S +
      '%,' +
      updateColor.L +
      '%)'
    accentSecondary[2] =
      'hsl(' +
      (updateColor.H - 50) +
      ',' +
      (updateColor.S - 20) +
      '%,' +
      (updateColor.L - 10) +
      '%)'

    semantic[0] = 'hsl(40,90%,50%)'
    semantic[1] = 'hsl(0,79%,60%)'
    semantic[2] = 'hsl(145,65%,50%)'
    semantic[3] = 'hsl(360,80%,60%)'
    semantic[4] = 'hsl(36,100%,75%)'
    semantic[5] = 'hsl(32,87%,61%)'
    semantic[6] = 'hsl(0,80%,60%)'
    semantic[7] = 'hsl(159,99%,38%)' // Green

    lighting[0] = 'hsl(148,44%,60%)'
    lighting[1] = 'hsl(184,44%,55%)'
    lighting[2] = 'hsl(220,86%,64%)'
    lighting[3] = 'hsl(245,57%,69%)'
    lighting[4] = 'hsl(0,92%,74%)'
    lighting[5] = 'hsl(345,100%,81%)'
    lighting[6] = 'hsl(10,89%,75%)'
    lighting[7] = 'hsl(36,100%,75%)'
    lighting[8] = 'hsl(240,1%,74%)'

    // Functional Colors
    accentSpring[0] = 'hsl(144,62%,90%)' //Spring/100
    accentSpring[1] = 'hsl(159,99%,38%)' //Spring/600
    accentSpring[2] = 'hsl(159,100%,20%)' //Spring/00
    accentSpring[3] = 'hsl(159,100%,30%)' //Spring/800
    accentSpring[5] = 'hsl(159,100%,26%)'

    accentSun[0] = 'hsl(44,100%,83%)' //Sun/100
    accentSun[1] = 'hsl(44,100%,50%)' //Sun/600
    accentSun[2] = 'hsl(44,100%,25%)' //Sun/00
    accentSun[4] = 'hsla(44, 100%, 25%, 0.4)' //Sun/00 with opacity 0.4
    accentSun[3] = 'hsl(44,100%,40%)' //Sun/800

    accentCarrot[0] = 'hsl(32,86%,89%)' //Carrot/100
    accentCarrot[1] = 'hsl(32,87%,61%)' //Carrot/600
    accentCarrot[2] = 'hsl(32,87%,30%)' //Carrot/00
    accentCarrot[3] = 'hsl(31,87%,45%)' //Carrot/800

    accentBrick[0] = 'hsl(352,76%,92%)' // Brick/100
    accentBrick[1] = 'hsl(353,69%,50%)' // Brick/600
    accentBrick[2] = 'hsl(353,73%,40%)' // Brick/800
    accentBrick[3] = 'hsl(353,74%,28%)' // Brick/00

    accentBlush[0] = 'hsl(251,79%,95%)' // Blush/100
    accentBlush[1] = 'hsl(251,78%,67%)' // Blush/600
    accentBlush[2] = 'hsl(251,79%,30%)' // Blush/00
    accentBlush[3] = 'hsl(251,78%,55%)' // Blush/800

    // Accents

    accentSea[0] = 'hsl(184,67%,92%)' // Sea/100
    accentSea[1] = 'hsl(185,68%,50%)' // Sea/600
    accentSea[2] = 'hsl(185,68%,36%)' // Sea/800
    accentSea[3] = 'hsl(186,69%,25%)' // Sea/00

    accentOrchid[0] = 'hsl(278,54%,93%)' // Orchid/100
    accentOrchid[1] = 'hsl(276,56%,60%)' // Orchid/600
    accentOrchid[2] = 'hsl(277,56%,22%)' // Orchid/00
    accentOrchid[3] = 'hsl(276,56%,45%)' // Orchid/800

    accentSky[0] = 'hsl(208,100%,94%)' // Sky/100
    accentSky[1] = 'hsl(207,97%,62%)' // Sky/600
    accentSky[2] = 'hsl(208,98%,17%)' // Sky/00
    accentSky[3] = 'hsl(208,98%,34%)' // Sky/800

    accentRose[0] = 'hsl(323,81%,94%)' // Rose/100
    accentRose[1] = 'hsl(324,82%,63%)' // Rose/600
    accentRose[2] = 'hsl(325,83%,21%)' // Rose/00
    accentRose[3] = 'hsl(324,82%,42%)' // Rose/800

    accentMidnight[0] = 'hsl(237,39%,88%)' // Midnight/100
    accentMidnight[1] = 'hsl(237,38%,42%)' // Midnight/600
    accentMidnight[2] = 'hsl(237,39%,9%)' // Midnight/00
    accentMidnight[3] = 'hsl(237,38%,30%)' // MidNight/800

    ambienceGrey[0] = 'hsl(0,0%,20%)'
    ambienceGrey[1] = 'hsl(0,0%,25%)'
    ambienceGrey[2] = 'hsl(0,0%,50%)'
    ambienceGrey[3] = 'hsl(0,0%,75%)'
    ambienceGrey[4] = 'hsl(0,0%,81%)'
    ambienceGrey[5] = 'hsl(240deg,9%,14%)'
    ambienceGrey[6] = 'hsl(240,10%,92%)'
    ambienceGrey[7] = 'hsl(240,3%,26%)'
    ambienceGrey[8] = 'hsl(240deg,15%,15%)'
    ambienceGrey[9] = 'hsl(250deg,10%,12%)'
    ambienceGrey[10] = 'hsl(0deg,0%,59%)'
    ambienceGrey[11] = 'hsl(0,0%,85%)'
    ambienceGrey[12] = 'hsl(0,0%,77%)'
    ambienceGrey[13] = 'hsl(185, 17%, 87%)'
    ambienceGrey[14] = 'hsl(250, 10%, 36%)'
    ambienceGrey[15] = 'hsl(252, 10%, 20%)'

    accentGradient[1] =
      'linear-gradient(135deg, #826AED 0%, #D4F5E1 100%), linear-gradient(0deg, #606060, #606060)'
    accentGradient[2] =
      'linear-gradient(135deg, #6ADB95 0%, #3EA5FC 100%), linear-gradient(0deg, #606060, #606060)'
    accentGradient[4] =
      'linear-gradient(135deg, #FFB900 0%, #D7293E 100%), linear-gradient(0deg, #606060, #606060)'
    accentGradient[5] = 'linear-gradient(135deg, #D9790F 0%, #FFB900 100%)'
    accentGradient[6] =
      'linear-gradient(132.33deg, #C2137B -0.67%, #3EA5FC 102.54%)'
    accentGradient[8] =
      'linear-gradient(132.33deg, #5332E6 -0.67%, #A45FD2 102.54%), linear-gradient(0deg, #FFFFFF, #FFFFFF)'
    accentGradient[9] =
      'linear-gradient(132.33deg, #6ADB95 -0.67%, #FFB900 102.54%), linear-gradient(0deg, #606060, #606060)'
    accentGradient[10] =
      'linear-gradient(45.4deg, #F4426C 6.41%, #FBF2B1 98.99%), linear-gradient(0deg, #606060, #606060)'
    accentGradient[11] = 'linear-gradient(135deg, #FFACC6 2.88%, #B6E0F5 100%)'
    accentGradient[12] = 'linear-gradient(135deg, #7EAEFF 2.88%, #FCA6E9 100%);'
    accentGradient[13] = 'linear-gradient(180deg, #DFF4FF 0%, #A2C7E8 100%)'
    accentGradient[14] =
      'linear-gradient(156.18deg, #75B48E -41.78%, #698B9C 4.6%, #67859E 12.08%, #6479A3 26.29%, #5C61AB 53.97%, #5854B0 68.93%, #5038BA 101.84%)'

    lightWhite[0] = 'hsl(0, 0%, 93%)'
    lightWhite[1] = 'hsl(227, 44%, 91%)'

    ambienceBasePrimary[0] = 'hsl(250, 100%, 75%)'

    let ambienceL = 0
    ambience.length = 0

    while (ambienceL < 96) {
      ambienceL += 4
      ambience.push(
        'hsl(' +
          ambienceBase.H +
          ',' +
          (ambienceBase.S - 90) +
          '%,' +
          (ambienceBase.L - 65 + ambienceL) +
          '%)'
      )
    }

    ambience.push('hsl(0,0%,99%)')
    if (!isLightTheme) ambience.reverse()
  }

  setColors(color)

  const shadows = [
    `0 0 2px ${ambience[23]}`,
    `0 4px 8px ${ambience[23]}`,
    `0 10px 12px ${ambience[23]}`,
    `0 16px 20px ${ambience[23]}`,
    `0px 2px 2px rgba(95, 92, 112, 0.08)`,
  ]

  return {
    breakpoints,
    space,
    radii,
    borders: [`none`, `1px solid ${ambience[0]}`],
    fontSizes,
    lineHeights,
    zIndices,
    colors: {
      accentPrimary,
      accentSecondary,
      semantic,
      ambience,
      black,
      white,
      accentSea,
      accentOrchid,
      accentSky,
      lighting,
      accentQuaternary,
      accentDisable,
      accentContentDisable,
      accentCarrot,
      accentRose,
      accentBlush,
      accentSpring,
      accentBrick,
      accentSun,
      accentGradient,
      accentMidnight,
      accentContentPrimary,
      accentContentTertiary,
      ambienceGrey,
      premiumColor,
      lightWhite,
      darkTertiary,
      darkContentTertiary,
      darkContentSecondary,
      accentOrange,
    },
    fonts,
    shadows,
    setColors,
    isLightTheme,
    eventBranding,
    primaryButtonTextColor,
    landingPageBranding,
  }
}

const defaultTheme = themeWrapper()

export default defaultTheme
