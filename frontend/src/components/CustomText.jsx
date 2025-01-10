import { TextField } from "@mui/material";

const textFieldStyles = {
    backgroundColor: 'inputbg.inputbg',
    borderRadius: '5px',
    '& .MuiInputBase-input': {
        color: 'text.primary',
    },
    '& .MuiInputLabel-root': {
        color: 'text.secondary',
    },
};

const editInputStyles = {
    backgroundColor: '#595966', 
};

const CustomTextField = ({ edit, ...props }) => {
    const combinedStyles = edit ? { ...textFieldStyles, ...editInputStyles } : textFieldStyles;
    return <TextField {...props} sx={combinedStyles} />;
};

export default CustomTextField;