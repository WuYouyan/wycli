export function generateComponent(name: string, moduleName: string, controllerName?: string, loadUrl: boolean = false): string {
  controllerName = controllerName || name + 'Controller';
  let templateUrl = loadUrl?
    `templateUrl: "./${name}/${name}.html",: ';`: 
    `templateUrl: function($element, $attrs, loadtemplate){
      let templateUrl = loadtemplate.getUrl('components/${name}/${name}.html', ${moduleName});
      return templateUrl;
    },`;
  let stringTemplate = 
`class ${controllerName} {
    constructor(){
        'ngInject';
        Object.assign(this, {});
    }
    $onInit(){
        
    }
}

let moduleName = "${moduleName}";
angular.module(moduleName, [])
  .component("${name}", {
    ${templateUrl}
    controller: ${controllerName},
    controllerAs: "$ctrl",
    bindings: {
    }
	});`;
  return stringTemplate;
}

