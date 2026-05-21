import { convertToJson } from "./utils.mjs";

export default class Alert {
  constructor(mainElement) {
    this.mainElement = document.querySelector(mainElement);
    this.path = "../json/alerts.json";
  }

  async init() {
    try {
      const response = await fetch(this.path);
      const alerts = await convertToJson(response);
      if (alerts?.length > 0) {
        this.renderAlerts(alerts);
      }
    } catch (error) {
      return;
    }
  }

  renderAlerts(alerts) {
    const alertListSection = document.createElement("section");
    alertListSection.classList.add("alert-list");

    alerts.forEach((alert) => {
      const alertParagraph = document.createElement("p");
      alertParagraph.textContent = alert.message;
      alertParagraph.style.backgroundColor = alert.background;
      alertParagraph.style.color = alert.color;
      alertListSection.appendChild(alertParagraph);
    });

    this.mainElement?.prepend(alertListSection);
  }
}
