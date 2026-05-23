<script lang="ts">
    import ByteCodeGenerator from "$lib/components/ByteCodeGenerator.svelte";
    import CodeEditingAndLinguistics from "$lib/components/CodeEditingAndLinguistics.svelte";
    import Executor from "$lib/components/Executor.svelte";
    import { Tabs, TabsTrigger } from "$lib/components/ui/tabs";
    import TabsContent from "$lib/components/ui/tabs/tabs-content.svelte";
    import TabsList from "$lib/components/ui/tabs/tabs-list.svelte";

    let code = $state("");
</script>

<div class="flex items-center justify-center w-full h-screen">
    <Tabs class="w-full max-w-3xl min-h-xl" value="lang">
        <TabsList>
            <TabsTrigger value="lang">Lang</TabsTrigger>
            <TabsTrigger value="byte">Bytecode</TabsTrigger>
            <TabsTrigger value="exec">Execute</TabsTrigger>
        </TabsList>
        <TabsContent value="lang">
            <CodeEditingAndLinguistics bind:code />
        </TabsContent>
        <TabsContent value="byte">
            <ByteCodeGenerator bind:code />
        </TabsContent>
        <TabsContent value="exec">
            <Executor bind:code />
        </TabsContent>
    </Tabs>
</div>
