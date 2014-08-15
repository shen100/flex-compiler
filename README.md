##flex-compiler

A Node.js module to compile Flex/ActionScript/MXML apps with the compiler from the Apache/Adobe Flex SDK.

##Quick Examples

```
var FlexCompiler = require('flex-compiler');

var params = {
  flexSDKPath: 'c:/dev/flexsdk',
  sourcePath: ['c:/demo/src'],
  libraryPath: ['c:/demo/libs'],
  main: 'c:/demo/src/Main.as',
  swfWidth: 480,
  swfHeight: 360,
  frameRate: 30,
  outputPath: 'c:/demo/Main.swf',
};

var flexCompiler = new FlexCompiler();
flexCompiler.mxmlc(params, function(err) {
  if(err) {
    console.log('compile failed');
  }else {
    console.log('compile success');
  }
});
```