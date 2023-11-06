export interface ComponentConfig {
    name: string;
}
export interface TemplateConfig {
    templateUrl: boolean;
    templateUrlFn: boolean;
}

export interface ComponentConfigAngularjs extends ComponentConfig, TemplateConfig {
    moduleName: string;
    controllerName: string;
}