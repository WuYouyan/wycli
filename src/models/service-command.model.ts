export interface ServiceConfig {
    name: string;
}
export interface ServiceConfigAngularjs extends ServiceConfig {
    moduleName: string;
    es6Style?: boolean;
}