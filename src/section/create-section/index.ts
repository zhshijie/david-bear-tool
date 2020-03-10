
import * as vscode from 'vscode';
import { toUpperCamelCase } from '../../utils/index';
import { 
  createScssFileTemplate, 
  createConstantsDirectoryTemplate,
  createStoreDirectoryTemplate, 
  createDeclareDirectionTemplate,
  createComponentsDirectoryTemplate, 
  createAssetDirectoryTemplate } from '../../utils/template-creator';

let createSectionDisposable = vscode.commands.registerCommand('extension.davidBearToolCreateSection', (args) => {

  const currentDir = args as vscode.Uri;
  const currentDirectoryPath = currentDir.path;

  const sectionDirectoryName = 'sections';
  let lastIndexOfContainers = -1;
  if ((lastIndexOfContainers = currentDirectoryPath.lastIndexOf(sectionDirectoryName)) === -1) {
    vscode.window.showErrorMessage("当前目录和父节点中，没有找到 section 目录，请在 section 目录中创建");
    return;
  }

  const lastSectionDirectoryPath = currentDirectoryPath.slice(0, lastIndexOfContainers + sectionDirectoryName.length);

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
      // 创建 section 中的 index.tsx 文件
      const indexTsxFilename = 'index.tsx';
      const indexTsxFilePath = sectionDirectoryPath + '/' + indexTsxFilename;
      const indexTsxFileUri = vscode.Uri.file(indexTsxFilePath);
      const writeStr = `
import React from 'react';
import './style.scss';
import { observer } from 'mobx-react';
import * as Constants from './constants';
import { I${className}Props } from './declare';
import { ${className}Store } from './store';

interface I${className}State {

}

@observer
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
      // 创建 section 中的 style.scss 文件
      return createScssFileTemplate(sectionDirectoryPath);
    })
    .then(async () => {
      // 创建 section 中的 constant 目录
      return createConstantsDirectoryTemplate(sectionDirectoryPath);
    })
    .then(async () => {
      // 创建 section 中的 store 目录
      return createStoreDirectoryTemplate(sectionDirectoryPath, className);
    })
    .then(async () => {
      // 创建 section 中的 declare 目录
      return createDeclareDirectionTemplate(sectionDirectoryPath, className, true);
    }).then(() => {
      // 创建 section 中的 component 目录
      return createComponentsDirectoryTemplate(sectionDirectoryPath);
    }).then(async () => {
      // 创建 section 中的 assets 目录
      return createAssetDirectoryTemplate(sectionDirectoryPath);
    });

  
  });


});

export {
  createSectionDisposable
};