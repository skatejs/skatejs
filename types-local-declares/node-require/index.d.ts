interface NodeRequireFunction {
    (id: string): any;
}

interface NodeRequire extends NodeRequireFunction {
    resolve (id: string): string;
    cache: { [filename: string]: NodeModule };
    extensions: { [ext: string]: (m: NodeModule, filename: string) => any };
    main: any;
}

interface NodeModule {
    exports: any;
    require: NodeRequireFunction;
    id: string;
    filename: string;
    parent: NodeModule;
    loaded: boolean;
    children: NodeModule[];
}

declare var require: NodeRequire;
