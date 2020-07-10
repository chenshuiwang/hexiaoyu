const glob = require('glob');
const WebpackBar = require('webpackbar');
const WebpackLayaboxPlugin = require('./webpack-layabox-plugin');

// 忽略的文件以,分隔 
const ignore = 'laya.particle.js,audio';
// 是否以压缩包形式打包
const isZip = false;

const getEntry = () => {
    const entry = {};
    const packDir = process.argv.slice(6).join(' ');
    const fileList = getPackDir(packDir);

    for (const entryFile of fileList) {
        if (entryFile.indexOf('.') !== -1 && !isIgnore(entryFile)) {
            const match = entryFile.match(/math\/(.*\/bin\/.*)/);
            let pageName = match && match[1];
            pageName = pageName.replace(/(bin)/, 'release');

            if (pageName) {
                entry[pageName] = entryFile;
            }  
        }
    }

    console.log('entry', entry);

    return entry;
};

const isIgnore = (url) => {
    const listArray = ignore.split(',');
    let result = false;
    for (const item of listArray) {
        if (url.indexOf(`${item}`) >= 0) {
            result = true;
        }
    }

    return result;
}

const getPackDir = (packDir)=> {
    const data = [];
    const packDirArray = packDir.split(' ');
    if (Array.isArray(packDirArray)) {
        for (let item of packDirArray) {
            if (isZip && item.length > 8) {
                item = item.slice(0, 8);
            }
            data.push(...glob.sync(`${process.cwd()}/math/${item}*/bin/**`));
        }
    }

    return data;
}

const config = {
    entry: getEntry(),
    output: {
        filename: '[name]-[hash:8].js',
        path: `${__dirname}/dist`
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|html|atlas|ani｜mp3)$/,
                use: [
                    {
                        loader: 'webpack-layabox-loader'
                    }
                ]
            },
            {
                test: /\.json$/,
                loader: 'webpack-layabox-loader',
                type: 'javascript/auto'
            },
        ]
    },
    plugins: [
        new WebpackBar(),
        new WebpackLayaboxPlugin({
            isUpload: false,
            isZip,
        })
    ],
    mode: 'production',
    resolveLoader:{
        // 去哪些目录下寻找 Loader
        modules: ['node_modules', './']
    },
    stats: 'verbose'
};
  
module.exports = config;