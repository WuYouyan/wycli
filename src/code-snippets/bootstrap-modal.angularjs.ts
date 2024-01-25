import path from "path";
import { ComponentConfigAngularjs } from "../models/component-command.model";
import { replaceStringInFile } from "../utilities/file-operations";
import { capitalizeFirstLetter } from "../utilities/string-operation";

function getTemplateSetting(component: ComponentConfigAngularjs): string {
  let templateString = "";
  if (!component.templateUrl) {
    templateString = `template: ""`;
  } else {
    templateString = !component.templateUrlFn ?
      `templateUrl: "./${component.name}.modal.html"` :
      `templateUrl: function($element, $attrs, loadtemplate){
            // TODO: fix path
            let templateUrl = loadtemplate.getUrl('modals/${component.name}/${component.name}.modal.html', ${component.moduleName});
            return templateUrl;
            /* // if loadtemplate is not available
            const module = kis.findModule(moduleName);
            // TODO: fix path
            const htmlPath = 'modals/${component.name}/${component.name}.modal.html';
            return window.kis._toAbsoluteContentRootPath(module.name, htmlPath);
            */
        }`;
  }
  return templateString;
}


/**
 * @param  {ComponentConfigAngularjs} component
 * @returns {string}
 */
export function generateModalComponent(component: ComponentConfigAngularjs): string {
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
      ok(){
          this.close({$value: true});
      }
      cancel(){
          this.dismiss({$value: false});
      }
  }

  let moduleName = "${component.moduleName}";
  angular.module(moduleName)
      .component("${component.name}", {
          ${templateUrl},
          controller: ${component.controllerName},
          controllerAs: "$ctrl",
          bindings: {
              resolve: '<',
              close: '&',
              dismiss: '&'
          }
      });
})();`;
  return stringTemplate;
}


export function generateModalComponentHTML(): string {
  const htmlString =
`<header class="modal-header">
    <h1 class="modal-title">head</h1>
</header>
<div class="modal-body">
    body
</div>
<footer class="modal-footer">
  <button class="btn-cta btn-cta-default" type="button" ng-click="$ctrl.cancel()">cancel</button>
  <button class="btn-cta btn-cta-primary" type="button" ng-click="$ctrl.ok()">confirm</button>
</footer>`;

  return htmlString;
}

export const DEFAULT_TARGET_STRING = "//INSERT HERE";
export function generateModalUsageComponentHTML(componentConfig: ComponentConfigAngularjs): string {
  const usageCodes =
  `//TODO: to be verified
  $uibModal.open({
      component: ${componentConfig.name}, // component name
      scope: $scope.$new(),
      size: 'sm',
      resolve: { // inputs to components
        data: function () { // TODO: to be changed
          return "your data";
        }
      }
  }).result.then(
      result => {
        console.log('resolve: ', result);
      },
      err => console.info('dismiss: ', err)
  );`;
  return usageCodes;
}

export function addModalComponentUsageInFile(componentConfig: ComponentConfigAngularjs, filePath: string, targetString: string = DEFAULT_TARGET_STRING): void {
  const resolvedFilePath = path.resolve(process.cwd(), filePath);
  console.log('resolvedFilePath: ', resolvedFilePath);
  replaceStringInFile(resolvedFilePath, targetString, generateModalUsageComponentHTML(componentConfig));
}