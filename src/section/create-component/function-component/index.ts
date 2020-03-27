
import * as vscode from 'vscode';
import { toUpperCamelCase } from '../../../utils/index';
import { 
  createAssetDirectoryTemplate, 
  createDeclareDirectionTemplate, 
  createConstantsDirectoryTemplate, 
  createScssFileTemplate } from '../../../utils/template-creator';

let createFunctionComponentDisposable = vscode.commands.registerCommand('extension.davidBearToolCreateFunctionComponent', (args) => {

  const currentDir = args as vscode.Uri;

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
  
    const componentDirectoryPath =  lastSectionDirectoryPath + '/' + value;
    const componentDirectoryUri = currentDir.with({path: componentDirectoryPath});      

    const fs = vscode.workspace.fs;

    const className = `${toUpperCamelCase(value)}`;

    fs.readDirectory(componentDirectoryUri)
    .then((directoryArr)=> {
      if (directoryArr.length > 0) {
        vscode
        .window
        .showWarningMessage(`${componentDirectoryPath} 已存在，是否要覆盖掉旧的文件目录`, '取消', '确定覆盖')
        .then( (selectedItem) => {
          if (selectedItem === '确定覆盖') {
            // 创建 component 文件夹
            return fs.createDirectory(componentDirectoryUri);
          }
        });
      }
    }, () => {
      // 创建 component 文件夹
      return fs.createDirectory(componentDirectoryUri);
    })
    .then(() => {
      // 创建 component 中的 index.tsx 文件
      const indexTsxFilename = 'index.tsx';
      const indexTsxFilePath = componentDirectoryPath + '/' + indexTsxFilename;
      const indexTsxFileUri = vscode.Uri.file(indexTsxFilePath);
      const writeStr = `
import React from 'react';
import './style.scss';
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
      // 创建 component 中的 style.scss 文件
      return createScssFileTemplate(componentDirectoryPath);
    })
    .then(async () => {
      // 创建 component 中的 constant 目录
      return createConstantsDirectoryTemplate(componentDirectoryPath);
    })
    .then(async () => {
      // 创建 component 中的 declare 目录
      return createDeclareDirectionTemplate(componentDirectoryPath, className);
    }).then(async () => {
      // 创建 component 中的 assets 目录
      return createAssetDirectoryTemplate(componentDirectoryPath);
    });
  
  });


});

export {
  createFunctionComponentDisposable
};