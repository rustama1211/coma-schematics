import { join, Path } from '@angular-devkit/core';

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { normalizeToKebabOrSnakeCase } from '../../utils/formatting';

import { Location, NameParser } from '../../utils/name.parser';
import { ModuleOptions } from './knex-seed-make.schema';

import executor from '../../tasks/knex-seed-make/executor';

import { newTask } from 'schematics-task';

export function main(options: ModuleOptions): Rule {
  options = transform(options);

  return (tree: Tree, context: SchematicContext) => {
    return addMigrationFile(options)(tree, context);
  };
}

function transform(source: ModuleOptions): ModuleOptions {
  const target: ModuleOptions = Object.assign({}, source);
  target.metadata = 'imports';
  target.type = 'module';

  const location: Location = new NameParser().parse(target);
  target.name = normalizeToKebabOrSnakeCase(location.name);
  target.path = normalizeToKebabOrSnakeCase(location.path);
  target.language = target.language !== undefined ? target.language : 'ts';
  if (target.language === 'js') {
    throw new Error(
      'The "resource" schematic does not support JavaScript language (only TypeScript is supported).',
    );
  }
  target.specFileSuffix = normalizeToKebabOrSnakeCase(
    source.specFileSuffix || 'spec',
  );

  target.path = target.flat
    ? target.path
    : join(target.path as Path, target.name);
  return target;
}

function addMigrationFile(options: ModuleOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    try {
      const seedOptions = {
        name: options.name,
        moduleDirectory: options.path,
      };
      context.addTask(
        newTask(async (_tree, context) => {
          await executor({})(seedOptions, context);
        }),
      );
    } catch {
      // ignore if "package.json" not found
    }
  };
}
