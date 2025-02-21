/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  TaskConfiguration,
  TaskConfigurationGenerator,
} from '@angular-devkit/schematics';
import {
  KnexMigrationSeedName,
  KnexMigrationSeedNameTaskOptions,
} from './options';

export interface MigrateOptions {
  moduleDirectory: string;
  name: string;
}

export class KnexSeedMakeTask
  implements TaskConfigurationGenerator<KnexMigrationSeedNameTaskOptions>
{
  constructor(public migrateOptions: MigrateOptions) {}

  toConfiguration(): TaskConfiguration<KnexMigrationSeedNameTaskOptions> {
    return {
      name: KnexMigrationSeedName,
      options: {
        name: this.migrateOptions.name,
        moduleDirectory: this.migrateOptions.moduleDirectory,
      },
    };
  }
}
