import { DirectiveConfigAngularjs } from "../models/directive-command.model";


function getTemplateSetting(directive: DirectiveConfigAngularjs): string {
  let templateString = "";
  if (!directive.templateUrl) {
    templateString = `template: ""`;
  } else {
    templateString = !directive.templateUrlFn?
    `templateUrl: "./${directive.name}/${directive.name}.html"`:
      `templateUrl: function($element, $attrs, loadtemplate){
          // TODO:fix path
          let templateUrl = loadtemplate.getUrl('directives/${directive.name}/${directive.name}.html', ${directive.moduleName});
          return templateUrl;
        }`;
  }
  return templateString;
}

/**
 * @param  {DirectiveConfigAngularjs} directive
 * @returns {string}
 */
export function generateDirective(directive: DirectiveConfigAngularjs): string {
  // remove undefined keys in directive config object
  const templateUrl = getTemplateSetting(directive);
  const stringTemplate =
`(function(){
  'use strict'
  class ${directive.controllerName} {
      constructor(){
          'ngInject';
          Object.assign(this, {});
      }
      $onInit() {

      }

  }

  let moduleName = "${directive.moduleName}";
  angular.module(moduleName)
    .directive("${directive.name}", [function(){
        return {
          restrict: 'E',
          ${templateUrl},
          scope: {
          },
          link: function(scope, element, attrs, ctrl) {
            // write link function here
          },
          controller: ${directive.controllerName},
          controllerAs: "$ctrl",
        }
	}]);
})();`;
  return stringTemplate;
}

