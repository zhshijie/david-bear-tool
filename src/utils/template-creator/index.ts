
import * as vscode from 'vscode';

/**
 * 创建 scss 文件模板
 *
 * @param {string} directoryPath scss 文件目录
 * @returns
 */
function createScssFileTemplate(directoryPath: string) {

  let scssImageRootPath = vscode.workspace.getConfiguration().get('davidBearTool.scssImageRootPath') as string;
  // 创建 container 中的 style.scss 文件
  const styleScssFilename = 'style.scss';
  const styleScssFilePath = directoryPath + '/' + styleScssFilename;
  const styleScssFileUri = vscode.Uri.file(styleScssFilePath);
  
  const scssRootPathSpliceContainerDirectoryPathResult = directoryPath.split(scssImageRootPath);
  const imagesDirectoryPath = scssRootPathSpliceContainerDirectoryPathResult[scssRootPathSpliceContainerDirectoryPathResult.length-1] + '/assets/images';
  const writeStr = 
`
@import '@/commons/style/utils/bg-url.scss';
$imgPrefix: '${imagesDirectoryPath}';

.container {

}
`;
  const fs = vscode.workspace.fs;
  const writeData = Buffer.from(writeStr, 'utf8');
  return fs.writeFile(styleScssFileUri, writeData);
}

/**
 * 创建 constants 文件夹模板
 *
 * @param {string} directoryPath 所在目录
 * @returns
 */
async function createConstantsDirectoryTemplate(directoryPath: string) {
  // 创建 container 中的 constant 目录
  const constantDirectoryName = 'constants';
  const constantDirectoryPath = directoryPath + '/' + constantDirectoryName;
  const constantDirectoryUri = vscode.Uri.file(constantDirectoryPath);
  const fs = vscode.workspace.fs;
  return fs.createDirectory(constantDirectoryUri).then(async () => {
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
}

/**
 * 创建 store 文件夹模板
 *
 * @param {string} directoryPath 所在目录
 * @param {string} className 类名
 * @returns
 */
async function createStoreDirectoryTemplate(directoryPath: string, className: string) {
      // 创建 container 中的 store 目录
      const storeDirectoryName = 'store';
      const storeDirectoryPath = directoryPath + '/' + storeDirectoryName;
      const storeDirectoryUri = vscode.Uri.file(directoryPath);
      const fs = vscode.workspace.fs;
      return fs.createDirectory(storeDirectoryUri)
            .then( () => {
              // 创建 store 中的 index.ts 文件
              const filename = 'index.ts';
              const filePath = storeDirectoryPath + '/' + filename;
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
              const filePath = storeDirectoryPath + '/' + filename;
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
}

/**
 * 创建 declare 目录
 *
 * @param {string} directoryPath 所在目录
 * @param {string} className 类名
 * @param {string} hasLocation 是否有 location 属性 
 * @returns
 */
async function createDeclareDirectionTemplate(directoryPath: string, className: string, hasLocation = false) {

    // 创建 container 中的 declare 目录
    const declareDirectoryName = 'declare';
    const declareDirectoryPath = directoryPath + '/' + declareDirectoryName;
    const declareDirectoryUri = vscode.Uri.file(declareDirectoryPath);
    const fs = vscode.workspace.fs;
    return fs.createDirectory(declareDirectoryUri)
            .then( () => {
              // 创建 declare 中的 index.ts 文件
              const filename = 'index.ts';
              const filePath = declareDirectoryPath + '/' + filename;
              const fileUri = vscode.Uri.file(filePath);
              const writeStr = 
`
interface I${className}Props {
  ${ hasLocation ? 'location?: any': '' }
}

export {
  I${className}Props
}
`;
            const writeData = Buffer.from(writeStr, 'utf8');
            return fs.writeFile(fileUri, writeData); 
          });

}

/**
 * 创建 components 目录
 *
 * @param {string} directoryPath 所在目录
 * @returns
 */
async function createComponentsDirectoryTemplate(directoryPath: string) {
  const directoryName = 'components';
  const componentsDirectoryPath = directoryPath + '/' + directoryName;
  const directoryUri = vscode.Uri.file(componentsDirectoryPath);
  const fs = vscode.workspace.fs;
  return fs.createDirectory(directoryUri);
}


/**
 * 创建 asset 目录
 *
 * @param {string} directoryPath 所在目录
 * @returns
 */
async function createAssetDirectoryTemplate(directoryPath: string) {
  // 创建 container 中的 assets 目录
  const directoryName = 'assets';
  const assetsDirectoryPath = directoryPath + '/' + directoryName;
  const directoryUri = vscode.Uri.file(assetsDirectoryPath);
  const fs = vscode.workspace.fs;
  return fs.createDirectory(directoryUri)
          .then(() => {
            // 创建 assets 中的 images 目录
            const directoryName = 'images';
            const directoryPath = assetsDirectoryPath + '/' + directoryName;
            const directoryUri = vscode.Uri.file(directoryPath);
            return fs.createDirectory(directoryUri);
        });
}

export {
  createScssFileTemplate,
  createConstantsDirectoryTemplate,
  createStoreDirectoryTemplate,
  createDeclareDirectionTemplate,
  createComponentsDirectoryTemplate,
  createAssetDirectoryTemplate
};