import { SHARE_PATH } from "./config.js";
import { Scanner } from "./src/models/Scanner.js";
import { Poller } from "./src/models/Poller.js";

const poller = new Poller("peach", "C:/Users/itay/Desktop/test");

// while (!true) {
const finishedProductDirs = await poller.getAllFinishedProductDirs();
// await poller.sentProductDirsToRX(finishedProductDirs);
console.log("finishedProductDirs", finishedProductDirs);
// }
