import { ComponentConfigAngularjs } from "../models/component-command.model";
import { capitalizeFirstLetter } from "../utilities/string-operation";


function getTemplateSetting(component: ComponentConfigAngularjs): string {
  let templateString = "";
  if (!component.templateUrl) {
    templateString = `template: ""`;
  } else {
    templateString = !component.templateUrlFn ?
      `templateUrl: "./${component.name}/${component.name}.html"` :
      `templateUrl: function($element, $attrs, loadtemplate){
            // TODO:fix path
            let templateUrl = loadtemplate.getUrl('components/${component.name}/${component.name}.html', ${component.moduleName});
            return templateUrl;
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
  let templateUrl = getTemplateSetting(component);
  let stringTemplate =
    `class ${component.controllerName} {
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
`;
  return stringTemplate;
}


export function generateModalComponentHTML(): string {
  let htmlString =
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
