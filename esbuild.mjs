import * as esbuild from 'esbuild';

const buildBundle = (entryPoint, out) => esbuild.buildSync({
    minify: true,
    bundle: true,    
    entryPoints: [
        entryPoint,
    ],
    outfile: out,
    platform: 'node',    
    external: [
        '@suchipi/node-mac-permissions',
        'suchibot',
        'esbuild',
    ]
});

const main = () => {
    const [file, out] = process.argv.slice(2);

    return buildBundle(file, out);
}

main();
