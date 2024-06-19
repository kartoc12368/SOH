import Swal from "sweetalert2";
const showAlert = ({ title, text, icon, confirmButtonText }) => {
  Swal.fire({
    title: { title },
    text: { text },
    icon: { icon },
    confirmButtonText: { confirmButtonText },
  });
};
const showAlertAndRedirect = ({
  title,
  text,
  icon,
  confirmButtonText,
  redirect,
}) => {
  
  Swal.fire({
    title: { title },
    text: { text },
    icon: { icon },
    confirmButtonText: { confirmButtonText },
  }).then((result) => {
    if (result.isConfirmed) {
      router.replace(`${redirect}`);
    }
  });
};
module.exports = { showAlertAndRedirect, showAlert };
