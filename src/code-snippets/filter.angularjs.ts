
/**
 *
 * @param {{moduleName: string, name: string}} filter
 * @returns {string}
 */
export function generatePipe(filter: {moduleName: string, name: string}): string {
  const stringTemplate =
`(function(){
    'use strict';

    let moduleName = "${filter.moduleName}";
    angular.module(moduleName)
      .filter('${filter.name}', function() {
        return function(input, ...parameters) {
          input = input || '';
          var out = '';
          // implement your logic here
          return out;
        };
      })
})();`;
  return stringTemplate;
}
