
import * as vscode from 'vscode';
import { toUpperCamelCase } from '../../utils/index';

let createSectionDisposable = vscode.commands.registerCommand('extension.davidBearCreateSection', (args) => {
  // The code you place here will be executed every time your command is executed

  const currentDir = args as vscode.Uri;

  // scss 中图片的根目录地址
  let scssImageRootPath = vscode.workspace.getConfiguration().get('davidBear.scssImageRootPath') as string;
  if (!scssImageRootPath) {
    scssImageRootPath = 'modules/client/spa-modules';
  }

  const currentDirectoryPath = currentDir.path;

  const sectionDirectoryName = 'section';
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
      // 创建 container 中的 index.tsx 文件
      const indexTsxFilename = 'index.tsx';
      const indexTsxFilePath = sectionDirectoryPath + '/' + indexTsxFilename;
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

store: ${className}Store = new ${className}Store({});

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
      // 创建 container 中的 store 目录
      const directoryName = 'store';
      const directoryPath = sectionDirectoryPath + '/' + directoryName;
      const directoryUri = vscode.Uri.file(directoryPath);
      return fs.createDirectory(directoryUri)
            .then( () => {
              // 创建 store 中的 index.ts 文件
              const filename = 'index.ts';
              const filePath = directoryPath + '/' + filename;
              const fileUri = vscode.Uri.file(filePath);
              const writeStr = 
`

import { I${className}StoreProps } from './declare';

class ${className}Store {

  props?: I${className}StoreProps;

  constructor(props?: I${className}StoreProps) {
    this.props = props;
  }
  
}

export {
${className}Store 
}
`;
              const writeData = Buffer.from(writeStr, 'utf8');
              return fs.writeFile(fileUri, writeData); 
            })
            .then( () => {
              // 创建 store 中的 index.ts 文件
              const filename = 'declare.ts';
              const filePath = directoryPath + '/' + filename;
              const fileUri = vscode.Uri.file(filePath);
              const writeStr = 
`


interface I${className}StoreProps {

}

export {
  I${className}StoreProps
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
  location?: any
}

export {
  I${className}Props
}
`;
              const writeData = Buffer.from(writeStr, 'utf8');
              return fs.writeFile(fileUri, writeData); 
            });
    }).then(() => {
      // 创建 container 中的 component 目录
      const directoryName = 'components';
      const directoryPath = sectionDirectoryPath + '/' + directoryName;
      const directoryUri = vscode.Uri.file(directoryPath);
      return fs.createDirectory(directoryUri);
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
  createSectionDisposable
}