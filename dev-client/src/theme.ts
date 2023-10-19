import {extendTheme} from 'native-base';

export const theme = extendTheme({
  colors: {
    primary: {
      main: '#276749',
      contrast: '#FFFFFF',
      lightest: '#9AE6B4',
      dark: '#22543D',
      // TODO: This is used for the colorScheme value for Radio
      // We should figure out how the color scheme stuff works and see if we can
      // map our current variables to 100, 200 values etc.
      600: '#276749',
    },
    background: {
      default: '#FFFFFF',
    },
    secondary: {
      main: '#C05621',
    },
    error: {
      main: '#D32F2F',
      contrast: '#FFFFFF',
    },
    grey: {
      200: '#EEEEEE',
      300: '#E0E0E0',
      800: '#424242',
    },
    action: {
      active: '#1A202C',
      active_subtle: '#1A202CB2',
    },
    text: {
      primary: '#1A202C',
      secondary: '#1A202CCC',
    },
    m3: {
      sys: {
        light: {
          outline: '#79747E',
        },
      },
    },
  },
  radii: {
    md: 4,
  },
  components: {
    Box: {
      variants: {
        card: {
          borderRadius: '4px',
          backgroundColor: 'background.default',
          padding: '16px',
          shadow: 1,
        },
      },
    },
    Badge: {
      variants: {
        chip: {
          borderRadius: '100px',
          padding: '4px',
        },
      },
    },
    Button: {
      sizes: {
        sm: {
          px: '10px',
          py: '4px',
          _text: {
            fontSize: '13px',
            fontWeight: 500,
            lineHeight: '22px',
            letterSpacing: '0.46px',
          },
        },
        md: {
          px: '16px',
          py: '6px',
          _text: {
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: '24px',
            letterSpacing: '0.4px',
          },
          _icon: {
            size: 'md',
          },
        },
        lg: {
          _text: {
            fontSize: '15px',
            fontWeight: 500,
            lineHeight: '26px',
            letterSpacing: '0.46px',
          },
          px: '22px',
          py: '8px',
        },
      },
      variants: {
        speedDial: {
          size: 'md',
          borderRadius: '50px',
          shadow: 6,
          backgroundColor: 'primary.contrast',
          _icon: {
            size: 'sm',
            color: 'text.primary',
          },
          _text: {
            color: 'text.primary',
          },
        },
        fullWidth: {
          borderRadius: '0px',
          width: 'full',
          justifyContent: 'start',
        },
        confirmModal: {
          py: '10px',
          px: '24px',
          borderRadius: '4px',
          _text: {
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '20px',
          },
        },
      },
    },
    FAB: {
      baseStyle: {
        px: '22px',
        py: '8px',
        rounded: 'md',
        _text: {
          fontSize: 15,
          lineHeight: 26,
        },
        right: '24px',
        bottom: '24px',
        shadow: 6,
      },
    },
    Select: {
      baseStyle: {
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
      },
    },
    FormControlLabel: {
      baseStyle: {
        _text: {
          color: 'text.primary',
          fontSize: '16px',
          fontWeight: 700,
          lineHeight: '24px',
          letterSpacing: '0.15px',
        },
      },
      variants: {
        subtle: {
          _text: {
            color: 'text.secondary',
            fontSize: '12px',
            fontWeight: 400,
            lineHeight: '12px',
            letterSpacing: '0.15px',
          },
        },
        secondary: {
          _text: {
            color: 'text.secondary',
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '24px',
            letterSpacing: '0.15px',
          },
        },
      },
      defaultProps: {
        _text: {
          variant: 'body1-strong',
        },
      },
    },
    Input: {
      defaultProps: {
        size: 'lg',
      },
    },
    Icon: {
      sizes: {
        sm: '20px',
        md: '24px',
        lg: '35px',
      },
      defaultProps: {
        size: 'md',
      },
    },
    IconButton: {
      sizes: {
        xs: {
          padding: '0px',
        },
        sm: {
          padding: '4px',
        },
        md: {
          padding: '12px',
        },
        lg: {
          padding: '16px',
        },
      },
      defaultProps: {
        size: 'sm',
        _icon: {
          size: 'md',
        },
      },
      variants: {
        FAB: {
          shadow: 2,
          borderRadius: 'full',
          backgroundColor: 'primary.main',
          _icon: {
            color: 'primary.contrast',
            size: 'md',
          },
        },
      },
    },
    RadioGroup: {
      baseStyle: {
        colorScheme: 'primary',
      },
      variants: {
        oneLine: {
          direction: 'row',
          space: '26px',
        },
      },
    },
    Radio: {
      baseStyle: {
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '0.15px',
        m: '8px',
        mr: '0px',
      },
    },
    Text: {
      variants: {
        body1: {
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '24px',
          letterSpacing: '0.15px',
        },
        body2: {
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '20px',
          letterSpacing: '0.17px',
        },
        subtitle1: {},
        subtitle2: {
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '22px',
          letterSpacing: '0.1px',
        },
        caption: {
          fontSize: '12px',
          fontWeight: 400,
          lineHeight: '20px',
          letterSpacing: '0.4px',
        },
      },
    },
    Heading: {
      variants: {
        h1: {},
        h2: {},
        h3: {
          fontSize: '48px',
          fontWeight: 400,
          lineHeight: '56px',
        },
        h4: {},
        h5: {
          fontSize: '24px',
          fontWeight: 400,
          lineHeight: '32px',
        },
        h6: {
          fontSize: '20px',
          fontWeight: 500,
          lineHeight: '32px',
        },
      },
    },
    Link: {
      baseStyle: {
        _text: {
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '24px',
          letterSpacing: '0.15px',
          color: 'primary.main',
        },
      },
    },
    Image: {
      variants: {
        profilePic: {
          size: '50px',
          borderRadius: 100,
        },
      },
    },
    Modal: {
      defaultProps: {
        avoidKeyboard: true,
      },
    },
    FormControlHelperText: {
      baseStyle: {
        _text: {
          fontSize: '12px',
          lineHeight: '19.92px',
          fontWeight: 400,
          color: 'text.primary',
          letterSpacing: '0.4px',
        },
      },
    },
  },
});

type CustomThemeType = typeof theme;

declare module 'native-base' {
  interface ICustomTheme extends CustomThemeType {}
}
