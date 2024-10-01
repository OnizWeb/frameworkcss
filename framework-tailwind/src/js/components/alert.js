/**
 * Enum for common type
 * @readonly
 * @enum { string }
 */
export const Types = Object.freeze({
  SUCCESS: "success",
  DANGER: "danger",
  WARNING: "warning",
  INFO: "info",
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
  base.className = `alert alert-${type} alert-dismissible fade show`;
  base.setAttribute("role", "alert");

  base.innerHTML = `${content}
  <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;

  containerAlert.appendChild(base);
}
