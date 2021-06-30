import { useMemo } from "react";
import {
    unstable_createMuiStrictModeTheme as createMuiTheme,
    ThemeProvider,
} from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { blue, pink, red, orange, green } from "@material-ui/core/colors"

const Theme = ({ children }) => {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

    const theme = useMemo(
        () =>
            createMuiTheme({
                palette: {
                    type: prefersDarkMode ? "dark" : "light",
                    primary: {
                        main: blue[200]
                    },
                    secondary: {
                        main: pink[200]
                    },
                    warning: orange,
                    error: red,
                    info: blue,
                    success: green
                },
            }),
        [prefersDarkMode]
    );


    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>

    )
};

export default Theme