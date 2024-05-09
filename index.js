import { SHARE_PATH } from "./config.js";
import { Scanner } from "./src/models/Scanner.js";
import { Poller } from "./src/models/Poller.js";

console.log("Poller Started");
const poller = new Poller("Peach", SHARE_PATH);
while (true) {
  console.log("starting get all finished products");
  const finishedProductDirs = await poller.getAllFinishedProductDirs();
  console.log("got all finished products", finishedProductDirs);
  console.log("send it to RX");
  try {
    await poller.sentProductDirsToRX(finishedProductDirs);
    console.log("sent successfully to RX");
    for (const dir of finishedProductDirs) {
      await poller.writeFile(dir, `${poller.getClassName()}.finished`);
    }
  } catch (error) {
    console.error("send to RX failed", error);
  }

  console.log("Poller Finished");
}
