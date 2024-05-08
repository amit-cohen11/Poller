import fs from "fs";
import path from "path";
import { glob } from "glob";
import { readdir, stat } from "fs/promises";

export class Scanner {
  #dir = undefined;

  constructor(dir) {
    this.#dir = dir;
  }

  getDir() {
    return this.#dir;
  }

  setDir(newDir) {
    if (!fs.existsSync(newDir)) {
      console.error("directory does not exist");
      throw new Error();
    } else {
      this.#dir = newDir;
    }
  }

  async searchFile(dir = this.#dir, Pattern) {
    return await glob(`${dir}/${Pattern}`);
  }

  async getAllProductDirs(dir = this.#dir) {
    return await this.#getAllProductDirsHelper(this.#dir, new Set());
  }

  async #getAllProductDirsHelper(dir, allDirs) {
    try {
      const files = await readdir(dir);

      for (const file of files) {
        const fileDir = path.join(dir, file);
        const stats = await stat(fileDir);

        if (stats.isDirectory()) {
          await this.#getAllProductDirsHelper(fileDir, allDirs);
        } else {
          allDirs.add(dir);
        }
      }
      return allDirs;
    } catch (error) {
      console.error(`Error while scan directory: ${error.message}`);
    }
  }
}
