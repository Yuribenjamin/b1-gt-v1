import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import cuid from 'cuid';
import chalk from 'chalk';

/**
 *
 * @param ms
 */
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 *
 * @param param0
 */
export async function saveScreenshot({
  suffix,
  screenshot,
  sessionId = undefined,
}: {
  suffix: string;
  screenshot: string | Buffer;
  sessionId?: string | undefined;
}) {
  const id = sessionId || cuid();
  const savePath = path.resolve(__dirname, `../screenshot/${id}-${suffix}.png`);
  console.log(chalk.bgCyan(savePath));
  await promisify(fs.writeFile)(savePath, screenshot);
}

/**
 *
 * @param param0
 */
export const clean = async () => {
  const directory = path.resolve(__dirname, `../screenshot/`);
  const readdir = promisify(fs.readdir);
  const unlink = promisify(fs.unlink);
  try {
    const files = await readdir(directory);
    const unlinkPromises = files.map((filename: string) =>
      unlink(`${directory}/${filename}`),
    );
    console.log(chalk.bgRed('[*] Previous session files deleted successfully'));
    return Promise.all(unlinkPromises);
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param err
 */
export const logErrorAndExit = (err: any) => {
  console.log(
    chalk.red(`[*] an error occurred while processing your request \n ${err} `),
  );
  process.exit();
};
