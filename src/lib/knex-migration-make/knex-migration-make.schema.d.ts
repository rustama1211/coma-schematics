import { Path } from '@angular-devkit/core';

export interface ModuleOptions {
  /**
   * The name of the module.
   */
  name: string;
  /**
   * The name of migration name.
   */
  migrationName: string;
  /**
   * The path to create the module.
   */
  path?: string;
  /**
   * The moduleName to insert the migration.
   */
  moduleName?: string;
  /**
   * The path to insert the module declaration.
   */
  module?: Path;
  /**
   * Directive to insert declaration in module.
   */
  skipImport?: boolean;
  /**
   * Metadata name affected by declaration insertion.
   */
  metadata?: string;
  /**
   * Nest element type name
   */
  type?: string;
  /**
   * When true, CRUD entry points are generated.
   */
  crud?: boolean;
  /**
   * Application language.
   */
  language?: string;

  spec?: boolean;
  /**
   * Specifies the file suffix of spec files.
   * @default "spec"
   */
  specFileSuffix?: string;
  /**
   * The source root path
   */
  sourceRoot?: string;
  /**
   * Flag to indicate if a directory is created.
   */
  flat?: boolean;
}
