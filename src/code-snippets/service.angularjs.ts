import { ServiceConfigAngularjs } from "../models/service-command.model";
import { capitalizeFirstLetter } from "../utilities/string-operation";

/**
 *
 * @param {ServiceConfigAngularjs} service
 * @returns {string}
 */
export function generateService(service: ServiceConfigAngularjs): string {
  let className = capitalizeFirstLetter(service.name);
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
    let moduleName = "${service.moduleName}";
    angular.module(moduleName)
        .service('${service.name}', ${className});
})();`;
  return stringTemplate;
}
