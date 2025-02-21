/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export const KnexMigrationSeedName = 'knex-migration-make';

import {
  TaskConfiguration,
  TaskConfigurationGenerator,
} from '@angular-devkit/schematics';

export interface KnexMigrationSeedNameFactoryOptions {
  rootDirectory?: string;
}

export interface KnexMigrationSeedNameTaskOptions {
  moduleDirectory?: string;
  name?: string;
}

export declare class KnexMigrationMakeTask
  implements TaskConfigurationGenerator<KnexMigrationSeedNameTaskOptions>
{
  constructor(options: KnexMigrationSeedNameTaskOptions);
  toConfiguration(): TaskConfiguration<KnexMigrationSeedNameTaskOptions>;
}
