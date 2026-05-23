<script lang="ts">
    import { EditorState } from "@codemirror/state";
    import { EditorView, keymap, lineNumbers } from "@codemirror/view";
    import {
        defaultKeymap,
        history,
        historyKeymap,
    } from "@codemirror/commands";
    import { StreamLanguage } from "@codemirror/language";
    import { gas } from "@codemirror/legacy-modes/mode/gas";
    import { bespin } from "@uiw/codemirror-theme-bespin";

    let {
        code = $bindable(
            String.raw`# standard ascii 'A'
buf = allocate(1); # allocate 15 bytes for a file descriptor
put(fd, 49);

stdout = openfd(1);
writefd(stdout, buf);

# The above program will print 'A'`,
        ),
    } = $props();

    let view: EditorView;

    function setupEditor(node: HTMLDivElement) {
        const startState = EditorState.create({
            doc: code,
            extensions: [
                lineNumbers(),
                history(),
                StreamLanguage.define(gas),
                keymap.of([...defaultKeymap, ...historyKeymap]),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        code = update.state.doc.toString();
                    }
                }),
                bespin,
            ],
        });

        view = new EditorView({
            state: startState,
            parent: node,
        });

        return {
            destroy() {
                if (view) view.destroy();
            },
        };
    }
</script>

<div
    use:setupEditor
    class="w-full h-full border border-zinc-800 rounded-lg bg-zinc-950 text-zinc-100 overflow-hidden"
></div>
