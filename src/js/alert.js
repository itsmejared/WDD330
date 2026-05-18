export default class Alert {
  constructor() {
    this.mainElement = document.querySelector("main");
  }

  async init() {
    const alerts = await this.fetchAlertData();
    if (alerts && alerts.length > 0) {
      this.renderAlerts(alerts);
    }
  }

  async fetchAlertData() {
    try {
      const response = await fetch("/json/alerts.json");
      if (!response.ok) {
        throw new Error("error");
      }
      return await response.json();
    } catch (error) {
      console.error("Can not load :", error);
    }
  }

  renderAlerts(alerts) {
    const alertListSection = document.createElement("section");.,.
    alertListSection.classList.add("alert-list");

    alerts.forEach((alert) => {
      const alertParagraph = document.createElement("p");
      alertParagraph.textContent = alert.message;
      alertParagraph.style.backgroundColor = alert.background;
      alertParagraph.style.color = alert.color;
      
      alertListSection.appendChild(alertParagraph);
    });

    if (this.mainElement) {
      this.mainElement.prepend(alertListSection);
    }
  }
}