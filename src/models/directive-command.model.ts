export interface DirectiveConfig {
    name: string;
}

export interface TemplateConfig {
    templateUrl: boolean;
    templateUrlFn: boolean;
}
export interface DirectiveConfigAngularjs extends DirectiveConfig, TemplateConfig {
    moduleName: string;
    controllerName: string;
}