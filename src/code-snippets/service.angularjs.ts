import { ServiceConfigAngularjs } from "../models/service-command.model";
import { capitalizeFirstLetter } from "../utilities/string-operation";

/**
 *
 * @param {ServiceConfigAngularjs} service
 * @returns {string}
 */
export function generateService(service: ServiceConfigAngularjs): string {
  const className = capitalizeFirstLetter(service.name);
  const stringTemplate =
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
