
import * as vscode from 'vscode';
import { toUpperCamelCase } from '../../../utils/index';
import { 
  createAssetDirectoryTemplate, 
  createComponentsDirectoryTemplate, 
  createDeclareDirectionTemplate, 
  createConstantsDirectoryTemplate, 
  createScssFileTemplate } from '../../../utils/template-creator';

let createClassComponentDisposable = vscode.commands.registerCommand('extension.davidBearCreateClassComponent', (args) => {
  // The code you place here will be executed every time your command is executed

  const currentDir = args as vscode.Uri;

  const currentDirectoryPath = currentDir.path;

  const componentsDirectoryName = 'components';
  let lastIndexOfComponents = -1;
  if ((lastIndexOfComponents = currentDirectoryPath.lastIndexOf(componentsDirectoryName)) === -1) {
    vscode.window.showErrorMessage("当前目录和父节点中，没有找到 components 目录，请在 components 目录中创建");
    return;
  }

  const lastSectionDirectoryPath = currentDirectoryPath.slice(0, lastIndexOfComponents + componentsDirectoryName.length);

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
import * as Constants from './constants';
import { I${className}Props } from './declare';

interface I${className}State {

}

class ${className} extends React.Component<I${className}Props, I${className}State> {

  constructor(props: I${className}Props) {
    super(props);
  }

  render() {
    return (
      <div styleName='container'></div>
    )
  }
}

export default ${className};
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
    }).then(() => {
      // 创建 component 中的 component 目录
      return createComponentsDirectoryTemplate(componentDirectoryPath);
    }).then(async () => {
      // 创建 component 中的 assets 目录
      return createAssetDirectoryTemplate(componentDirectoryPath);
    });
  });


});

export {
  createClassComponentDisposable
};