
import * as vscode from 'vscode';
import { toUpperCamelCase } from '../../../utils/index';

let createFunctionComponentDisposable = vscode.commands.registerCommand('extension.davidBearCreateFunctionComponent', (args) => {

  const currentDir = args as vscode.Uri;

  // scss 中图片的根目录地址
  let scssImageRootPath = vscode.workspace.getConfiguration().get('davidBear.scssImageRootPath') as string;
  if (!scssImageRootPath) {
    scssImageRootPath = 'modules/client/spa-modules';
  }
  const currentDirectoryPath = currentDir.path;

  const componentDirectoryName = 'components';
  let lastIndexOfComponents = -1;
  if ((lastIndexOfComponents = currentDirectoryPath.lastIndexOf(componentDirectoryName)) === -1) {
    vscode.window.showErrorMessage("当前目录和父节点中，没有找到 components 目录，请在 components 目录中创建");
    return;
  }

  const lastSectionDirectoryPath = currentDirectoryPath.slice(0, lastIndexOfComponents + componentDirectoryName.length);

  const options = {
    ignoreFocusOut: true,
    password: false,
    prompt: "Please type your container name (eg. main)"
  };

  vscode.window.showInputBox(options).then((value) => {
  
    const sectionDirectoryPath =  lastSectionDirectoryPath + '/' + value;
    const sectionDirectoryUri = currentDir.with({path: sectionDirectoryPath});      

    const fs = vscode.workspace.fs;

    const className = `${toUpperCamelCase(value)}`;

    fs.readDirectory(sectionDirectoryUri)
    .then((directoryArr)=> {
      if (directoryArr.length > 0) {
        vscode
        .window
        .showWarningMessage(`${sectionDirectoryPath} 已存在，是否要覆盖掉旧的文件目录`, '取消', '确定覆盖')
        .then( (selectedItem) => {
          if (selectedItem === '确定覆盖') {
            // 创建 container 文件夹
            return fs.createDirectory(sectionDirectoryUri);
          }
        });
      }
    }, () => {
      // 创建 container 文件夹
      return fs.createDirectory(sectionDirectoryUri);
    })
    .then(() => {
      // 创建 container 中的 index.tsx 文件
      const indexTsxFilename = 'index.tsx';
      const indexTsxFilePath = sectionDirectoryPath + '/' + indexTsxFilename;
      const indexTsxFileUri = vscode.Uri.file(indexTsxFilePath);
      const writeStr = `
import React from 'react';
import './style.scss';
import * as Constants from './constants';
import { I${className}Props } from './declare';

function create${className}Component(props: I${className}Props) {
  return (
    <div styleName='container'></div>
  )
}

export default React.memo(create${className}Component);
`;
      const writeData = Buffer.from(writeStr, 'utf8');
      return fs.writeFile(indexTsxFileUri, writeData);
    })
  
    .then(() => {
      // 创建 container 中的 style.scss 文件
      const styleScssFilename = 'style.scss';
      const styleScssFilePath = sectionDirectoryPath + '/' + styleScssFilename;
      const styleScssFileUri = vscode.Uri.file(styleScssFilePath);
      
      const scssRootPathSpliceContainerDirectoryPathResult = sectionDirectoryPath.split(scssImageRootPath);
      const imagesDirectoryPath = scssRootPathSpliceContainerDirectoryPathResult[scssRootPathSpliceContainerDirectoryPathResult.length-1] + '/assets/images';
      const writeStr = 
`
@import '@/commons/style/utils/bg-url.scss';
$imgPrefix: '${imagesDirectoryPath}';

.container {

}
`;
      const writeData = Buffer.from(writeStr, 'utf8');
      return fs.writeFile(styleScssFileUri, writeData);
    })
    .then(async () => {
      // 创建 container 中的 constant 目录
      const constantDirectoryName = 'constants';
      const constantDirectoryPath = sectionDirectoryPath + '/' + constantDirectoryName;
      const constantDirectoryUri = vscode.Uri.file(constantDirectoryPath);
      return fs.createDirectory(constantDirectoryUri)
             .then(() => {
                // 创建 constants 中的 index.ts 文件
                const filename = 'index.ts';
                const filePath = constantDirectoryPath + '/' + filename;
                const fileUri = vscode.Uri.file(filePath);
                const writeStr = 
`
export {
}
`;
                const writeData = Buffer.from(writeStr, 'utf8');
                return fs.writeFile(fileUri, writeData); 
            });
    })
    .then(async () => {
      // 创建 container 中的 declare 目录
      const directoryName = 'declare';
      const directoryPath = sectionDirectoryPath + '/' + directoryName;
      const directoryUri = vscode.Uri.file(directoryPath);
      return fs.createDirectory(directoryUri)
              .then( () => {
                // 创建 declare 中的 index.ts 文件
                const filename = 'index.ts';
                const filePath = directoryPath + '/' + filename;
                const fileUri = vscode.Uri.file(filePath);
                const writeStr = 
`
interface I${className}Props {

}

export {
  I${className}Props
}
`;
              const writeData = Buffer.from(writeStr, 'utf8');
              return fs.writeFile(fileUri, writeData); 
            });
    }).then(async () => {
      // 创建 container 中的 assets 目录
      const directoryName = 'assets';
      const assetsDirectoryPath = sectionDirectoryPath + '/' + directoryName;
      const directoryUri = vscode.Uri.file(assetsDirectoryPath);
      return fs.createDirectory(directoryUri)
             .then(() => {
                // 创建 assets 中的 images 目录
                const directoryName = 'images';
                const directoryPath = assetsDirectoryPath + '/' + directoryName;
                const directoryUri = vscode.Uri.file(directoryPath);
                return fs.createDirectory(directoryUri);
            });
    });
  
  });


});

export {
  createFunctionComponentDisposable
}