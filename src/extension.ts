// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { TextDecoder } from 'util';
import * as vscode from 'vscode';

// Here are all of the possible contribution points under the 'contributions' key in package.json:
// Each has a name and icon, we'll rehydrate TreeItems later
const classmap: Record<string, any> = {
    'breakpoints': {
        'name': 'Breakpoints',
        'icon': 'debug-breakpoint'
    },
    "colors": {
        "name": "Themeable Colors",
        "icon": "symbol-color"
    },
    "commands": {
        "name": "Commands",
        "icon": "symbol-event"
    },
    "configuration": {
        "name": "Configuration Keys",
        "icon": "settings-gear"
    },
    "configurationDefaults": {
        "name": "Default Editor Configurations",
        "icon": "settings-gear"
    },
    "customEditors": {
        "name": "Custom Editors",
        "icon": "symbol-event"
    },
    "debuggers": {
        "name": "Debuggers",
        "icon": "bug"
    },
    "grammars": {
        "name": "Grammars",
        "icon": "symbol-struct"
    },
    "icons": {
        "name": "Icons",
        "icon": "symbol-color"
    },
    "iconThemes": {
        "name": "Icon Themes",
        "icon": "symbol-color"
    },
    "jsonValidation": {
        "name": "JSON Validation",
        "icon": "symbol-json"
    },
    "keybindings": {
        "name": "Keybindings",
        "icon": "symbol-key"
    },
    "languages": {
        "name": "Languages",
        "icon": "symbol-event"
    },
    "menus": {
        "name": "Menus",
        "icon": "symbol-event"
    },
    "problemMatchers": {
        "name": "Problem Matchers",
        "icon": "alert"
    },
    "problemPatterns": {
        "name": "Problem Patterns",
        "icon": "alert"
    },
    "productIconThemes": {
        "name": "Product Icon Themes",
        "icon": "symbol-color"
    },
    "resourceLabelFormatters": {
        "name": "Resource Label Formatters",
        "icon": "symbol-event"
    },
    "semanticTokenModifiers": {
        "name": "Semantic Token Modifiers",
        "icon": "symbol-event"
    },
    "semanticTokenScopes": {
        "name": "Semantic Token Scopes",
        "icon": "symbol-event"
    },
    "semanticTokenTypes": {
        "name": "Semantic Token Types",
        "icon": "symbol-event"
    },
    "snippets": {
        "name": "Snippets",
        "icon": "symbol-snippet"
    },
    "submenus": {
        "name": "Submenus",
        "icon": "symbol-event"
    },
    "taskDefinitions": {
        "name": "Task Definitions",
        "icon": "symbol-event"
    },
    "terminal": {
        "name": "Terminal",
        "icon": "terminal"
    },
    "themes": {
        "name": "Themes",
        "icon": "symbol-color"
    },
    "typescriptServerPlugins": {
        "name": "TypeScript Server Plugins",
        "icon": "symbol-event"
    },
    "views": {
        "name": "Views",
        "icon": "symbol-struct"
    },
    "viewsContainers": {
        "name": "View Containers",
        "icon": "symbol-struct"
    },
    "viewsWelcome": {
        "name": "Welcome Views",
        "icon": "welcome"
    },
    "walkthroughs": {
        "name": "Walkthroughs",
        "icon": "symbol-event"
    },
};

export class ContributionPoint extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);
        this.iconPath = classmap[label].icon;
    }
}

export class ContributionPoints implements vscode.TreeDataProvider<vscode.TreeItem> {
    roots: vscode.Uri[] = [];

    constructor() {
        this.roots = [];
    }

    addRoot(packageJson: vscode.Uri) {
        this.roots.push(packageJson);
    }

    onDidChangeTreeData?: vscode.Event<any> | undefined;
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }
    getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
        // If we're at the root, return the list of contribution points
        if (!element) {
            return Object.keys(classmap).map((key) => {

                return new vscode.TreeItem(classmap[key].name, vscode.TreeItemCollapsibleState.Collapsed);
            });
        }
    }
    getParent?(element: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem> {
        throw new Error('Method not implemented.');
    }
    resolveTreeItem?(item: vscode.TreeItem, element: vscode.TreeItem, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
        throw new Error('Method not implemented.');
    }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    // hello message for debugging whether or not this thing started
    console.log('Congratulations, your extension "vscode-meta-extension" is now active!');

    // create a tree view then add the roots
    const dataProvider = new ContributionPoints();
    const packageJsons = await vscode.workspace.findFiles('**/package.json');
    for (const packageJson of packageJsons) {
        const contents = await vscode.workspace.fs.readFile(packageJson);
        const text = new TextDecoder().decode(contents);
        const json = JSON.parse(text);
        if (json.contributes) {
            dataProvider.addRoot(packageJson);
        }
    }
    const treeView = vscode.window.createTreeView('points', { treeDataProvider: dataProvider });
}

// This method is called when your extension is deactivated
export function deactivate() {}
