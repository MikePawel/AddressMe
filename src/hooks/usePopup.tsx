import { VariantType, useSnackbar } from "notistack";

export const useCustomSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showPopup = (variant: VariantType, message: string) => {
    enqueueSnackbar(message, { variant }); // Variant can be: default, success, error, warning, or info
  };

  return {
    showPopup,
  };
};

// How to use this hook:

// in a different component add the import  "import { useCustomSnackbar } from...."
// add a constant "const { showPopup } = useCustomSnackbar();"
// and then use the showPopup(x,y) function as needed
