/**
 * Enum for common type
 * @readonly
 * @enum { string }
 */
export const Types = Object.freeze({
  SUCCESS: "green",
  DANGER: "red",
  WARNING: "orange",
  INFO: "blue",
});

/**
 * Function to add Alert on the top of viewport
 * @param { Types } type  - Type of alert
 * @param { string } content  - Content's alert
 * @return { HTMLElement } The alert component
 */
export function showAlert(type, content) {
  const containerAlert = document.querySelector(".alert-container");

  if (containerAlert.firstChild) {
    containerAlert.removeChild(containerAlert.firstChild);
  }

  const base = document.createElement("div");
  base.className = `alert-${type} border px-4 py-3 rounded relative`;
  base.setAttribute("role", "alert");

  base.innerHTML = `${content}
  <button type="button" id="close-alert" class="absolute top-0 bottom-0 right-0 px-4 py-3" aria-label="Fermer">
    <svg class="fill-current h-6 w-6 alert-${type}-close" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
  </button>`;

  containerAlert.appendChild(base);

  const close = document.getElementById("close-alert");

  close.addEventListener("click", () => {
    if (containerAlert.firstChild) {
      containerAlert.removeChild(containerAlert.firstChild);
    }
  });
}
