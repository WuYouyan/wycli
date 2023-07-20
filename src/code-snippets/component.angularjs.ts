import { ComponentConfigAngularjs } from "../models/component-command.model";
import { capitalizeFirstLetter } from "../utilities/string-operation";


/**
 * @param  {ComponentConfigAngularjs} component
 * @returns {string}
 */
export function generateComponent(component: ComponentConfigAngularjs): string {
  component.controllerName = capitalizeFirstLetter(component.controllerName || component.name + 'Controller');
  let templateUrl = !!component.templateUrlActive?
    `templateUrl: "./${component.name}/${component.name}.html"`:
    `templateUrl: function($element, $attrs, loadtemplate){
        let templateUrl = loadtemplate.getUrl('components/${component.name}/${component.name}.html', ${component.moduleName});
        return templateUrl;
      }`;
  let stringTemplate =
`class ${component.controllerName} {
    constructor(){
        'ngInject';
        Object.assign(this, {});
    }
    $onInit(){

    }
}

let moduleName = "${component.moduleName}";
angular.module(moduleName, [])
  .component("${component.name}", {
      ${templateUrl},
      controller: ${component.controllerName},
      controllerAs: "$ctrl",
      bindings: {
      }
	});
`;
  return stringTemplate;
}

