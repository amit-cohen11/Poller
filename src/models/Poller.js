import { Scanner } from "./Scanner.js";
import { RX_URL } from "../../config.js";
import axios from "axios";

export class Poller {
  #sensorName = "";
  #scanner = new Scanner("");

  constructor(sensorName, path) {
    this.#sensorName = sensorName;
    this.#scanner.setDir(path);
  }

  getSensorName() {
    return this.#sensorName;
  }

  setSensorName(newSensorName) {
    this.#sensorName = newSensorName;
  }

  async getAllFinishedProductDirs() {
    const finishedProductDirs = [];
    const allProductDirs = await this.#scanner.getAllProductDirs();

    for (const productDir of allProductDirs) {
      const finishedFile = await this.#scanner.searchFile(
        productDir,
        `${this.#sensorName}.finished`
      );
      if (finishedFile.length) {
        finishedProductDirs.push(productDir);
      }
    }
    return finishedProductDirs;
  }

  async sentProductDirsToRX(Dirs) {
    try {
      const response = await axios.post(RX_URL, Dirs, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("error", error);
    }
  }
}
