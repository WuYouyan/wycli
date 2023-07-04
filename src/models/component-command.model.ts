export interface ComponentConfig {
    name: string;
}

export interface ComponentConfigAngularjs extends ComponentConfig {
    moduleName: string;
    controllerName?: string;
    templateUrlActive?: boolean;
}