/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export const KnexMigrationMakeName = 'knex-migration-make';

import {
  TaskConfiguration,
  TaskConfigurationGenerator,
} from '@angular-devkit/schematics';

export interface KnexMigrationMakeNameFactoryOptions {
  rootDirectory?: string;
}

export interface KnexMigrationMakeNameTaskOptions {
  moduleDirectory?: string;
  name?: string;
}

export declare class KnexMigrationMakeTask
  implements TaskConfigurationGenerator<KnexMigrationMakeNameTaskOptions>
{
  constructor(options: KnexMigrationMakeNameTaskOptions);
  toConfiguration(): TaskConfiguration<KnexMigrationMakeNameTaskOptions>;
}
