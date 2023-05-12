import _ from 'lodash';
import { createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { blue, green, purple, red, yellow } from '@mui/material/colors';
import typography from './Typography';
import components from './Override';
import shadows from './Shadows';

// ##############################import {
import {
  BLUE_THEME,
  GREEN_THEME,
  RED_THEME,
  BLACK_THEME,
  PURPLE_THEME,
  INDIGO_THEME,
  ORANGE_THEME,
} from '../../redux/constants';
// // // Global Variables
// ##############################

const SidebarWidth = 265;
const TopbarHeight = 70;

const baseTheme = {
  direction: 'ltr',
  palette: {
    primary: {
      main: '#1a97f5',
      light: '#e6f4ff',
      dark: '#1682d4',
    },
    secondary: {
      main: '#1e4db7',
      light: '#ddebff',
      dark: '#173f98',
    },

    success: {
      main: '#00c292',
      light: '#ebfaf2',
      dark: '#00964b',
      contrastText: '#ffffff',
    },
    danger: {
      main: '#e46a76',
      light: '#fdf3f5',
    },
    info: {
      main: '#0bb2fb',
      light: '#a7e3f4',
    },
    error: {
      main: '#e46a76',
      light: '#E91E63',
      dark: '#e45a68',
    },
    warning: {
      main: '#fec90f',
      light: '#fff4e5',
      dark: '#dcb014',
      contrastText: '#ffffff',
    },
    text: {
      secondary: '#777e89',
      danger: '#fc4b6c',
    },
    grey: {
      A100: '#ecf0f2',
      A200: '#99abb4',
      A400: '#767e89',
      A700: '#e6f4ff',
    },
    action: {
      disabledBackground: 'rgba(73,82,88,0.12)',
      hoverOpacity: 0.02,
      hover: 'rgba(0, 0, 0, 0.03)',
    },
    charts: {
      red: red[200],
      darkRed: red[800],
      yellow: yellow[200],
      green: green[200],
      purple: purple[200],
      blue: blue[200],
    },
    extra: { main: '#00cec3', light: '#d7f8f6', dark: '#02b3a9' },
    collections: {
      c1: {
        color1: '#FF6D60',
        color2: '#F7D060',
        color3: '#F3E99F',
        color4: '#98D8AA',
      },
      c2: {
        color1: '#7AA874',
        color2: '#F7DB6A',
        color3: '#EBB02D',
        color4: '#D864A9',
      },
      c3: {
        color1: '#00235B',
        color2: '#E21818',
        color3: '#FFDD83',
        color4: '#98DFD6',
      },
      c4: {
        color1: '#F7C8E0',
        color2: '#DFFFD8',
        color3: '#B4E4FF',
        color4: '#95BDFF',
      },
      c5: {
        color1: '#453C67',
        color2: '#6D67E4',
        color3: '#46C2CB',
        color4: '#F2F7A1',
      },
      c6: {
        color1: '#EA047E',
        color2: '#FF6D28',
        color3: '#FCE700',
        color4: '#00F5FF',
      },
      c7: {
        color1: '#781C68',
        color2: '#319DA0',
        color3: '#FFD39A',
        color4: '#FFF5E1',
      },
      c8: {
        color1: '#53BF9D',
        color2: '#F94C66',
        color3: '#BD4291',
        color4: '#FFC54D',
      },
      c9: {
        color1: '#37E2D5',
        color2: '#590696',
        color3: '#C70A80',
        color4: '#FBCB0A',
      },
      c10: {
        color1: '#FFD36E',
        color2: '#FFF56D',
        color3: '#99FFCD',
        color4: '#9FB4FF',
      },
      c11: {
        color1: '#544179',
        color2: '#6166B3',
        color3: '#32C1CD',
        color4: '#17D7A0',
      },
      c12: {
        color1: '#B983FF',
        color2: '#94B3FD',
        color3: '#94DAFF',
        color4: '#99FEFF',
      },
    },
  },
  shape: {
    borderRadius: 2,
  },
  mixins: {
    toolbar: {
      color: '#949db2',
      '@media(min-width:1280px)': {
        minHeight: TopbarHeight,
        padding: '0 30px',
      },
      '@media(max-width:1280px)': {
        minHeight: '64px',
      },
    },
  },
  status: {
    danger: '#e53e3e',
  },
  components,
  typography,
  shadows,
};

const themesOptions = [
  {
    name: BLUE_THEME,
    palette: {
      primary: {
        main: '#1a97f5',
        light: '#e6f4ff',
        dark: '#1682d4',
      },
      secondary: {
        main: '#1e4db7',
        light: '#b5cef3',
        dark: '#173f98',
      },
    },
  },
  {
    name: GREEN_THEME,
    palette: {
      primary: {
        main: '#00cec3',
        light: '#d7f8f6',
        dark: '#02b3a9',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#066a73',
      },
    },
  },
  {
    name: PURPLE_THEME,
    palette: {
      primary: {
        main: '#7352ff',
        light: '#e5e0fa',
        dark: '#5739d6',
      },
      secondary: {
        main: '#402e8d',
        light: '#b0c9ed',
        dark: '#173f98',
      },
    },
  },
  {
    name: INDIGO_THEME,
    palette: {
      primary: {
        main: '#1e4db7',
        light: '#e6f4ff',
        dark: '#0c399e',
      },
      secondary: {
        main: '#11397b',
      },
    },
  },
  {
    name: ORANGE_THEME,
    palette: {
      primary: {
        main: '#03c9d7',
        light: '#e5fafb',
        dark: '#05b2bd',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#fb9678',
        light: '#d7aa9a',
        dark: '#e67e5f',
        contrastText: '#ffffff',
      },
    },
  },
  {
    name: RED_THEME,
    palette: {
      primary: {
        main: '#ff5c8e',
        light: '#fce6ed',
        dark: '#d43653',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#5e244d',
        light: '#d7aa9a',
        dark: '#e67e5f',
        contrastText: '#ffffff',
      },
    },
  },
  {
    name: BLACK_THEME,
    palette: {
      primary: {
        main: '#1c2025',
      },
    },
  },
];

export const BuildTheme = (config = {}) => {
  let themeOptions = themesOptions.find((theme) => theme.name === config.theme);
  const customizer = useSelector((state) => state.CustomizerReducer);

  const baseMode = {
    palette: {
      mode: customizer.activeMode,
      background: {
        default: customizer.activeMode === 'dark' ? '#20232a' : '#fafbfb',
        dark: customizer.activeMode === 'dark' ? '#1c2025' : '#ffffff',
        paper: customizer.activeMode === 'dark' ? '#282C34' : '#ffffff',
        ripple: customizer.activeMode === 'dark' ? '#8b8b8b' : '#1c2025',
      },
      text: {
        primary: customizer.activeMode === 'dark' ? '#e6e5e8' : 'rgba(0, 0, 0, 0.87)',
        secondary: customizer.activeMode === 'dark' ? '#adb0bb' : '#777e89',
      },
    },
  };
  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    [themeOptions] = themesOptions;
  }

  const theme = createTheme(
    _.merge({}, baseTheme, baseMode, themeOptions, {
      direction: config.direction,
    }),
  );
  return theme;
};

export { TopbarHeight, SidebarWidth, baseTheme };
