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
      throw new Error("directory doesn't exist");
    } else {
      this.#dir = newDir;
    }
  }

  async searchFile(dir = this.#dir, Pattern) {
    try {
      return await glob(`${dir}/${Pattern}`);
    } catch (error) {
      throw new Error("Got an error while search file", error.message);
    }
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
      throw new Error("Got an error while scan directory", error.message);
    }
  }
}
