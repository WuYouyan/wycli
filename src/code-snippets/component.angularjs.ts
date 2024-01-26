import { ComponentConfigAngularjs } from "../models/component-command.model";
import { capitalizeFirstLetter } from "../utilities/string-operation";


function getTemplateSetting(component: ComponentConfigAngularjs): string {
  let templateString = "";
  if (!component.templateUrl) {
    templateString = `template: ""`;
  } else {
    templateString = !component.templateUrlFn?
    `templateUrl: "./${component.name}/${component.name}.component.html"`:
      `templateUrl: function($element, $attrs, loadtemplate){
        // TODO:fix path
        let templateUrl = loadtemplate.getUrl('components/${component.name}/${component.name}.component.html', '${component.moduleName}');
        return templateUrl;
      }`;
  }
  return templateString;
}


/**
 * @param  {ComponentConfigAngularjs} component
 * @returns {string}
 */
export function generateComponent(component: ComponentConfigAngularjs): string {
  component.controllerName = capitalizeFirstLetter(component.controllerName || component.name + 'Controller');
  const templateUrl = getTemplateSetting(component);
  const stringTemplate =
`(function(){
  'use strict'
  class ${component.controllerName} {
      constructor(){
          'ngInject';
          Object.assign(this, {});
      }
      $onInit(){

      }
  }

  let moduleName = "${component.moduleName}";
  angular.module(moduleName)
    .component("${component.name}", {
        ${templateUrl},
        controller: ${component.controllerName},
        controllerAs: "$ctrl",
        bindings: {
        }
    });
})();`;
  return stringTemplate;
}

