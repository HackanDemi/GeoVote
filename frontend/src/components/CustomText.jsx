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

const CustomTextField = (props) => {
    return <TextField {...props} sx={textFieldStyles} />;
};

export default CustomTextField