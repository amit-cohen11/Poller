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

  getClassName() {
    return this.constructor.name;
  }

  //  search for all {sensorName}.finished files, that represent the folder is ready to RX
  async getAllFinishedProductDirs() {
    const finishedProductDirs = [];
    const allProductDirs = await this.#scanner.getAllProductDirs();

    for (const productDir of allProductDirs) {
      if (await this.#isNeededSentToRX(productDir)) {
        finishedProductDirs.push(productDir);
      }
    }
    return finishedProductDirs;
  }

  async #isNeededSentToRX(productDir) {
    const isSensorFinished = await this.#scanner.searchFile(
      productDir,
      `${this.#sensorName}.finished`
    );
    const isPollerFinished = await this.#scanner.searchFile(
      productDir,
      `${this.getClassName()}.finished`
    );
    return isSensorFinished.length && !isPollerFinished.length;
  }

  async writeFile(dir, fileName, data = "") {
    try {
      this.#scanner.writeFile(dir, fileName, data);
    } catch (error) {
      throw new Error("Got an error", error.message);
    }
  }

  async sentProductDirsToRX(Dirs) {
    try {
      const response = await axios.post(RX_URL, Dirs, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      throw new Error("Got an error", error.message);
    }
  }
}
