import Swal from "sweetalert2";

export const isEmailValid = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const addminAddDonationError = (props) => {
  const validationRules = {
    amount: {
      required: "Amount is required",
      minValue: {
        value: 0,
        message: "Donation Amount can not be less than zero",
      },
      notZero: "Donation Amount can not be zero",
    },
    donor_first_name: {
      required: "First Name is required",
    },
    donor_email: {
      required: "Email is required",
      validate: (value) => !value || isEmailValid(value),
      errorMessage: "Please enter a valid email address",
    },
    email: {
      validate: (value) => !value || isEmailValid(value),
      errorMessage: "Please enter a valid email address",
    },
    donor_phone: {
      required: "Mobile Number is required",
      validate: (value) => !value || value.length === 10,
      errorMessage: "Mobile Number must be 10 digits",
    },
    donation_date: {
      required: "Donation Date is required",
    },
    payment_method: {
      required: "Donation type is required",
    },
  };
  const newErrors = {};

  Object.entries(props).forEach(([fieldName, value]) => {
    const rules = validationRules[fieldName];
    if (!rules) return; // No rules defined for the field

    if (rules.required && !value) {
      newErrors[fieldName] = rules.required;
    } else if (rules.minValue && value <= rules.minValue.value) {
      newErrors[fieldName] = rules.minValue.message;
    } else if (rules.notZero && value === 0) {
      newErrors[fieldName] = rules.notZero;
    } else if (rules.validate && !rules.validate(value)) {
      newErrors[fieldName] = rules.errorMessage || "Invalid input.";
    }
  });

  return newErrors;
};

export const addDonatErrorSchema = (props) => {
  const validationRules = {
    amount: {
      required: "Amount is required",
      minValue: {
        value: 0,
        message: "Invalid amount",
      },
      notZero: "Donation Amount can not be zero",
    },
    donor_name: {
      required: "First Name is required",
    },
    donor_email: {
      required: "Email is required",
      validate: (value) => !value || isEmailValid(value),
      errorMessage: "Please enter a valid email address",
    },
    donor_phone: {
      required: "Mobile Number is required",
      validate: (value) => !value || value.length === 10,
      errorMessage: "Mobile Number must be 10 digits",
    },
  };

  const newErrors = {};

  Object.entries(props).forEach(([fieldName, value]) => {
    const rules = validationRules[fieldName];
    if (!rules) return;

    if (rules.required && !value) {
      newErrors[fieldName] = rules.required;
    } else if (rules.minValue && value <= rules.minValue.value) {
      newErrors[fieldName] = rules.minValue.message;
    } else if (rules.notZero && value === 0) {
      newErrors[fieldName] = rules.notZero;
    } else if (rules.validate && !rules.validate(value)) {
      newErrors[fieldName] = rules.errorMessage || "Invalid input.";
    }
  });

  return newErrors;
};

export const showSwal = (
  type,
  title,
  message,
  callback = null,
  showConfirmButton = true
) => {
  let icon, confirmButtonText;

  switch (type) {
    case "success":
      icon = "success";
      confirmButtonText = "Close";
      break;
    case "error":
      icon = "error";
      confirmButtonText = "Close";
      break;
    case "warning":
      icon = "warning";
      confirmButtonText = "Close";
      break;
    case "info":
      icon = "info";
      confirmButtonText = "Close";
      break;
    case "question":
      icon = "question";
      confirmButtonText = "Close";
      break;
    default:
      icon = "info";
      confirmButtonText = "Close";
      break;
  }

  const swalOptions = {
    title: title,
    text: message,
    icon: icon,
    confirmButtonText: confirmButtonText,
    confirmButtonColor: "#000080",
  };

  if (!showConfirmButton) {
    swalOptions.showConfirmButton = false;
  }

  Swal.fire(swalOptions).then((result) => {
    if (result.isConfirmed && callback) {
      callback();
    }
  });
};
export const renderField = (field) => (field ? field : "--");

export function showSwalWithTimer(icon, title, text, timer = 2000) {
  showSwal(icon, title, text, "", false);
  setTimeout(() => {
    Swal.close();
  }, timer);
}
