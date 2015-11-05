/**
 * flexcompiler.js
 * Author: shen100
 * Website: http://www.shen100.com
 * Create: 2014-08-05 13:50:16
 * */

var fs = require('fs');

function FlexCompiler() {

}

FlexCompiler.prototype.mxmlc = function(params, callback) {
  var path = require('path');
  var os   = require('os');
  var swfWidth   = 680;
  var swfHeight  = 515;
  var frameRate  = 30;
  var cmdArgs    = [];
  var i;
  if(params.debug) {
    cmdArgs.push('-debug=true');
  }
  if(params.sourcePath) {
    for (i = 0; i < params.sourcePath.length; i++) {
      cmdArgs.push('-source-path'); 
      cmdArgs.push(params.sourcePath[i]);
    }
  }
  if(params.libraryPath) {
    for (i = 0; i < params.libraryPath.length; i++) {
      cmdArgs.push('-library-path'); 
      cmdArgs.push(params.libraryPath[i]);
    }
  }
  cmdArgs.push('-library-path'); 
  cmdArgs.push(path.join(params.flexSDKPath, 'frameworks/libs')); 

  if( !(params.incremental === false) ) {
    cmdArgs.push('-incremental=true');
  }
  var theSwfWidth  = !isNaN(params.swfWidth)  ? params.swfWidth  : swfWidth;
  var theSwfHeight = !isNaN(params.swfHeight) ? params.swfHeight : swfHeight;
  cmdArgs.push('-default-size');
  cmdArgs.push(theSwfWidth);
  cmdArgs.push(theSwfHeight);

  var theFrameRate = !isNaN(params.frameRate) ? params.frameRate : frameRate;
  cmdArgs.push('-default-frame-rate');
  cmdArgs.push(theFrameRate);

  if(params.conditional && params.conditional.constructor == Array) {
    var conditional = params.conditional;
    for (i = 0; i < conditional.length; i++) {
      var namespace = conditional[i].namespace;
      var varName   = conditional[i].varName;
      var value     = conditional[i].value;
      cmdArgs.push('-define+=' + (namespace + '::' + varName + ',' + value));
    }
  }

  if( !(params.staticLinkLib === false) ) {
    cmdArgs.push('-static-link-runtime-shared-libraries=true');
  }
  if(params.outputPath) {
    cmdArgs.push('-output');
    cmdArgs.push(params.outputPath);
  }
  cmdArgs.push('--');
  cmdArgs.push(params.main);
  if(params.isLog) {
  	console.log('**************** mxmlc args ***************');
    for (i = 0; i < cmdArgs.length; i++) {
      console.log('*    ' + cmdArgs[i]);
    }
    console.log('******************** end ********************');
  }
  
  if(params.isLog) {
    console.log('mxmlc start');
    console.log(path.join(params.flexSDKPath, 'bin/mxmlc'));
  }

  var opts = {
    cwd: path.join(params.flexSDKPath, 'bin')
  };
  var theMxmlc;
  if (os.platform() === 'win32') {
    theMxmlc = 'mxmlc';
  } else {
    theMxmlc = './mxmlc';
  }

  fs.stat(opts.cwd, function(err, stats) {
    if (err || !stats.isDirectory()) {
      return callback(new Error('not found flex sdk'));
    }
    var child = require('child_process').spawn(theMxmlc, cmdArgs, opts);
    child.stdout.on('data', function (data) {
      if(params.isLog) {
        var iconv = require('iconv-lite');
        var str   = iconv.decode(data, 'gbk');
        console.log(str);
      }
    });
    
    var isError;
    var msg = '';

    child.stderr.on('data', function (data) {
      var iconv = require('iconv-lite');
      var str   = iconv.decode(data, 'gbk');
      msg += str;
      isError = true;
    });

    child.on('exit', function (code, signal) {
      if(isError) {
        if(params.isLog) {
          console.log('mxmlc error');
          console.log(msg);
        }
        var err = new Error(msg);
        callback(err); 
      }else {
        if(params.isLog) {
          console.log('mxmlc complete');
        }
        callback(null);
      }
    });

  });
}

module.exports = FlexCompiler;
  