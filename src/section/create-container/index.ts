
import * as vscode from 'vscode';
import { toUpperCamelCase } from '../../utils/index';
import { 
  createAssetDirectoryTemplate, 
  createComponentsDirectoryTemplate, 
  createDeclareDirectionTemplate, 
  createStoreDirectoryTemplate, 
  createConstantsDirectoryTemplate, 
  createScssFileTemplate } from '../../utils/template-creator';

let createContainerDisposable = vscode.commands.registerCommand('extension.davidBearToolCreateContainer', (args) => {

  const currentDir = args as vscode.Uri;

  const currentDirectoryPath = currentDir.path;

  const lastContainersDirectoryPath = currentDirectoryPath;

  const options = {
    ignoreFocusOut: true,
    password: false,
    prompt: "Please type your container name (eg. main)"
  };

  vscode.window.showInputBox(options).then((value) => {
  
    const containerDirectoryPath =  lastContainersDirectoryPath + '/' + value;
    const containerDirectoryUri = currentDir.with({path: containerDirectoryPath});      

    const fs = vscode.workspace.fs;

    const className = `${toUpperCamelCase(value)}Container`;

    fs.readDirectory(containerDirectoryUri)
    .then((directoryArr)=> {
      if (directoryArr.length > 0) {
        vscode
        .window
        .showWarningMessage(`${containerDirectoryPath} 已存在，是否要覆盖掉旧的文件目录`, '取消', '确定覆盖')
        .then( (selectedItem) => {
          if (selectedItem === '确定覆盖') {
            // 创建 container 文件夹
            return fs.createDirectory(containerDirectoryUri);
          }
        });
      }
    }, () => {
      // 创建 container 文件夹
      return fs.createDirectory(containerDirectoryUri);
    })
    .then(() => {
      // 创建 container 中的 index.tsx 文件
      const indexTsxFilename = 'index.tsx';
      const indexTsxFilePath = containerDirectoryPath + '/' + indexTsxFilename;
      const indexTsxFileUri = vscode.Uri.file(indexTsxFilePath);
      const writeStr = `
import React from 'react';
import './style.scss';
import * as Constants from './constants';
import { I${className}Props } from './declare';
import { ${className}Store } from './store';

interface I${className}State {

}

class ${className} extends React.Component<I${className}Props, I${className}State> {

  private store: ${className}Store = new ${className}Store({});

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
      // 创建 container 中的 style.scss 文件
      return createScssFileTemplate(containerDirectoryPath);
    })
    .then(async () => {
      // 创建 container 中的 constant 目录
      return createConstantsDirectoryTemplate(containerDirectoryPath);
    })
    .then(async () => {
      // 创建 container 中的 store 目录
      return createStoreDirectoryTemplate(containerDirectoryPath, className);
    })
    .then(async () => {
      // 创建 container 中的 declare 目录
      return createDeclareDirectionTemplate(containerDirectoryPath, className, true);
    }).then(() => {
      // 创建 container 中的 section 目录
      const directoryName = 'sections';
      const directoryPath = containerDirectoryPath + '/' + directoryName;
      const directoryUri = vscode.Uri.file(directoryPath);
      return fs.createDirectory(directoryUri);
    }).then(() => {
      // 创建 container 中的 component 目录
      return createComponentsDirectoryTemplate(containerDirectoryPath);
    }).then(async () => {
      // 创建 container 中的 assets 目录
      return createAssetDirectoryTemplate(containerDirectoryPath);
    });

  
  });


});

export {
  createContainerDisposable
};