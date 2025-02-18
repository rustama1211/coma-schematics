import { join, Path, strings } from '@angular-devkit/core';
import { classify } from '@angular-devkit/core/src/utils/strings';
import { mkdirSync } from 'fs';
import {
  apply,
  branchAndMerge,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Source,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { normalizeToKebabOrSnakeCase } from '../../utils/formatting';
import * as pluralize from 'pluralize';
import {
  DeclarationOptions,
  ModuleDeclarator,
} from '../../utils/module.declarator';
import { ModuleFinder } from '../../utils/module.finder';
import {
  addPackageJsonDependency,
  getPackageJsonDependency,
  NodeDependencyType,
} from '../../utils/dependencies.utils';
import { Location, NameParser } from '../../utils/name.parser';
import { mergeSourceRoot } from '../../utils/source-root.helpers';
import { ModuleOptions } from './module.schema';

export function main(options: ModuleOptions): Rule {
  options = transform(options);
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        addMappedTypesDependencyIfApplies(options),
        mergeSourceRoot(options),
        addDeclarationToModule(options),
        mergeWith(generate(options)),
      ]),
    )(tree, context);
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
/*
[
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
    */

function generate(options: ModuleOptions): Source {
  return (context: SchematicContext) =>
    apply(url(join('./files' as Path, options.language)), [
      template({
        ...strings,
        ...options,
        lowercased: (name: string) => {
          const classifiedName = classify(name);
          return (
            classifiedName.charAt(0).toLowerCase() + classifiedName.slice(1)
          );
        },
        singular: (name: string) => pluralize.singular(name) as string,
        ent: (name: string) => name + '.entity',
      }),
      move(options.path),
    ])(context);
}

function addDeclarationToModule(options: ModuleOptions): Rule {
  return (tree: Tree) => {
    if (options.skipImport !== undefined && options.skipImport) {
      return tree;
    }
    options.module = new ModuleFinder(tree).find({
      name: options.name,
      path: options.path as Path,
    });
    if (!options.module) {
      return tree;
    }

    const migrationFolder = 'migrations';
    const seedsFolder = 'seeds';

    if (!tree.exists(join(options.path as Path, migrationFolder))) {
      mkdirSync(join(options.path as Path, migrationFolder), {
        recursive: true,
      });
    }

    if (!tree.exists(join(options.path as Path, seedsFolder))) {
      mkdirSync(join(options.path as Path, seedsFolder), { recursive: true });
    }

    const content = tree.read(options.module).toString();
    const declarator: ModuleDeclarator = new ModuleDeclarator();
    tree.overwrite(
      options.module,
      declarator.declare(content, {
        ...options,
        type: 'module',
      } as DeclarationOptions),
    );
    return tree;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function addMappedTypesDependencyIfApplies(_options: ModuleOptions): Rule {
  return (host: Tree, context: SchematicContext) => {
    try {
      const nodeDependencyRef = getPackageJsonDependency(
        host,
        '@nestjs/mapped-types',
      );
      if (!nodeDependencyRef) {
        addPackageJsonDependency(host, {
          type: NodeDependencyType.Default,
          name: '@nestjs/mapped-types',
          version: '*',
        });
        context.addTask(new NodePackageInstallTask());
      }
    } catch {
      // ignore if "package.json" not found
    }
  };
}
