const { build } = require("esbuild");

const buildBundle = () => build({
    bundle: true,
    entryPoints: [
        'src/bundle.ts',
    ],
    outdir: 'bundle',
    platform: 'node',
})

const main = async () => {
    const [type] = process.argv.slice(2);

    if(type === 'bundle') return await buildBundle();

    console.log(`Unknown build type "${type ?? ''}"`);
    process.exit(1);
}

main();