<script lang="ts">
    import CodeMirrorEditor from "$lib/components/CodeMirrorEditor.svelte";
    import { AccordionTrigger } from "$lib/components/ui/accordion";
    import AccordionContent from "$lib/components/ui/accordion/accordion-content.svelte";
    import AccordionItem from "$lib/components/ui/accordion/accordion-item.svelte";
    import Accordion from "$lib/components/ui/accordion/accordion.svelte";
    import {
        Card,
        CardHeader,
        CardDescription,
        CardContent,
        CardTitle,
    } from "$lib/components/ui/card";
    import { generateSiaxAst } from "$lib/siax/language/parse/ast";
    import { TreeDeciduous } from "@lucide/svelte";

    let { code = $bindable() }: { code: string } = $props();
    let generatedAst = $derived.by(() => {
        let potentialAst = generateSiaxAst(code);
        if (potentialAst) return potentialAst;
        else return null;
    });
</script>

<Card class="max-w-3xl w-full h-full">
    <CardHeader>
        <CardTitle class="tracking-tighter text-xl font-bold">SiAX</CardTitle>
        <CardDescription>
            A visualizer for the Siax VM platform.
        </CardDescription>
    </CardHeader>

    <CardContent>
        <div class="flex flex-col gap-4 w-full">
            <h2 class="tracking-tight font-bold text-xl">FAQ</h2>

            <Accordion type="single" class="w-full py-0" value="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger>What is SiAX?</AccordionTrigger>
                    <AccordionContent>
                        SiAX is an old virtual machine platform that I designed
                        to practice my C knowledge, now expanded for a
                        beautiful, functional interface.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger
                        >Did SiAX always have a programming language?</AccordionTrigger
                    >
                    <AccordionContent
                        >The SiAX platform originally <b
                            >did not have any form of language</b
                        > before this project. This aims to give a universal assembler-like
                        language to the platform to visualize the connections and
                        CPU as it runs.</AccordionContent
                    >
                </AccordionItem>
            </Accordion>

            <h2 class="tracking-tight font-bold text-xl">Code Editor</h2>

            <CodeMirrorEditor bind:code />

            <div class="grid grid-cols-3 gap-4">
                <Accordion type="single" class="w-full py-0">
                    <AccordionItem value="main">
                        <AccordionTrigger
                            class="items-center flex flex-row gap-1"
                            ><TreeDeciduous class="w-4 h-4" />Generated AST</AccordionTrigger
                        >
                        <AccordionContent>
                            <pre class="overflow-auto">{JSON.stringify(
                                    generatedAst,
                                    null,
                                    2,
                                )}</pre>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    </CardContent>
</Card>
