/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { SpawnOptions, spawn } from 'child_process';
import * as path from 'path';
import { SchematicContext, TaskExecutor } from '@angular-devkit/schematics';
import {
  KnexMigrationMakeNameFactoryOptions,
  KnexMigrationMakeNameTaskOptions,
} from './options';

export default function (
  factoryOptions: KnexMigrationMakeNameFactoryOptions = {},
): TaskExecutor<KnexMigrationMakeNameTaskOptions> {
  const rootDirectory = factoryOptions.rootDirectory || process.cwd();

  return async (
    options: KnexMigrationMakeNameTaskOptions = {},
    context: SchematicContext,
  ) => {
    const execute = (args: string[], ignoreErrorStream?: boolean) => {
      const outputStream = 'ignore';
      const errorStream = ignoreErrorStream ? 'ignore' : process.stderr;
      const spawnOptions: SpawnOptions = {
        stdio: [process.stdin, outputStream, errorStream],
        shell: true,
        cwd: path.join(rootDirectory, ''),
        env: {
          ...process.env,
        },
      };

      return new Promise<void>((resolve, reject) => {
        spawn('npx', args, spawnOptions).on('close', (code: number) => {
          if (code === 0) {
            resolve();
          } else {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(code);
          }
        });
      });
    };

    // if git is not found or an error was thrown during the `git`
    // init process just swallow any errors here
    // NOTE: This will be removed once task error handling is implemented
    try {
      await execute([
        'migrate:make',
        '-x',
        'ts',
        '--migrations-directory',
        options.moduleDirectory,
        options.name,
      ]);
      context.logger.info('Successfully create migration.');
    } catch {
      /* empty */
    }
  };
}
