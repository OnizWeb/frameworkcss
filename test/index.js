import "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

const VERSION = "0.0.1";

console.log("index.js loaded", VERSION);

const forms = document.querySelectorAll(".needs-validation");

Array.from(forms).forEach((form) => {
  form.addEventListener(
    "submit",
    (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    },
    false
  );
});

const toastTrigger = document.getElementById("liveToastBtn");
const toastLive = document.getElementById("liveToast");

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive, {
    delay: 2000
  });
  toastTrigger.addEventListener("click", () => {
    toastBootstrap.show();
  });
}
