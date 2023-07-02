import { capitalizeFirstLetter } from "../utilities/string-operation";

/**
 * 
 * @param {string} name ex: myService 
 * @param {string} moduleName
 * @param {boolean} [es6Style=true]
 * @returns {string}
 */
export function generateService(name: string, moduleName: string, es6Style: boolean = true): string {
  let className = capitalizeFirstLetter(name);
  let stringTemplate = 
`(function(){
    'use strict';

    class ${className} {
        constructor(){
            'ngInject'
            Object.assign(this, {
            });

        }
    }
    let moduleName = "${moduleName}";
    angular.module(moduleName)
        .service('${name}', ${className});
})();`;
  return stringTemplate;
}
