import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

// @ts-ignore
self.MonacoEnvironment = {
    getWorker(_: any, label: string) {
        if (label === 'yaml') {
            return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url))
        }
        return new editorWorker();
    }
};

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
