import { cn } from "@lib/utils.ts";
import { TextareaProps } from "@ui/textarea.tsx";
import { useRef, useState, useEffect } from 'react';
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';
import * as monaco from 'monaco-editor'
//import styles from './Editor.module.css';
import { configureMonacoYaml } from 'monaco-yaml'

configureMonacoYaml(monaco, {
    enableSchemaRequest: true,
    schemas: [
        {
            // If YAML file is opened matching this glob
            fileMatch: ['**/(docker-)?compose.y(a)?ml.*'],
            // Then this schema will be downloaded from the internet and used.
            uri: 'https://raw.githubusercontent.com/compose-spec/compose-spec/main/schema/compose-spec.json'
        }
    ]
})

export const ComposeEditor = (props: TextareaProps) => {
    const { className, value = '#Paste compose file contents', ...rest } = props;
    const [editor, setEditor] = useState<monacoEditor.editor.IStandaloneCodeEditor | null>(null);
    const monacoEl = useRef(null);
monaco.Uri.parse('file:///person.yaml')
    useEffect(() => {
        if (monacoEl) {
            setEditor((editor) => {
                if (editor) return editor;

                const model = monacoEditor.editor.createModel(
                    value as string,
                    undefined,
                    monaco.Uri.parse('file:///person.yaml')
                );
                return monaco.editor.create(monacoEl.current!, {
                    model,
                    language: 'yaml'
                });
            });
        }

        return () => editor?.dispose();
    }, [monacoEl.current]);

// @ts-ignore
    return <div className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
    )} ref={monacoEl} {...rest}></div>;
};
