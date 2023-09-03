import {createTheme, ThemeOptions} from "@mui/material";

export const themeOptions: ThemeOptions = {
    palette: {
        primary: {main: "#4498eb"},
        secondary: {main: "#44ebeb"},
        error: {main: "#eb4444"},
        warning: {main: "#ebeb44"},
        info: {main: "#16cdcd"},
        success: {main: "#44eb98"}
    }
};

export const theme = createTheme(themeOptions)

