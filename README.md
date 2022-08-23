# VS-Linker

This is a Visual Studio Code extension that links files from every language and every address.
## Feature

1. links to all languages using custom regular expressions.
2. links to network address


---



## Go to include files
You can open the file using Ctl + click.

![openFile1](https://user-images.githubusercontent.com/57289429/182084053-4f2e0b72-e7e5-47db-80e2-c9597a43f63e.gif)

## Register the root folder
you can set project rootPath & regularExpress.

### 1. **Go to extension settings.**

![settings1](https://user-images.githubusercontent.com/57289429/186137031-8ff82f40-b14c-4d79-b24c-3954f1478399.png)

### 2. **Set rootPath & regularExpress for your projects.**


VS-Linker links files based on the root path.   
This regular expression in the example is asp only.

```json
{
    "vs-linker.projects": [
        {
            "rootPath": "\\\\192.168.1.1\\folder",
            "regularExpress": "/<!--(.*?)include(.+?)=(\\s+)?\\\"(?<filename>.*?)\\\"(.*)-->/g",
        },
        {
            "rootPath": "\\D:\\folder",
            "regularExpress": "/<!--(.*?)include(.+?)=(\\s+)?\\\"(?<filename>.*?)\\\"(.*)-->/g",
        }
    ]
}
```


If you use a different regular expression for each root, you can link different languages ​​for each project. 



**Enjoy!**

<!--
## Register the root folder
If you can't open the link, there are two ways to fix it.

![cannotOpenFile1](https://user-images.githubusercontent.com/57289429/182084824-7dff2610-77ff-4655-9758-a92b5b2a6492.gif)

### 1. Add workspace

File -> Add Folder to Workspace -> Add -> Restart VS Code

![addWorkspace1](https://user-images.githubusercontent.com/57289429/182084702-fa3f78a6-f75d-4d84-a0b8-07a217d0b1f8.gif)

### 2. Add the root folder using keyword.

F1 -> `vs-linker: SaveProjectRoot` -> Select -> Restart VS Code
![saveWorkspaceRoot](https://user-images.githubusercontent.com/57289429/183587098-f738d80e-e715-4877-b201-bbdd3ddb6481.gif)


## Delete the root folder
F1 -> `vs-linker: DeleteProjectRoot` -> Select -> Restart VS Code

![deleteWorkspaceRoot](https://user-images.githubusercontent.com/57289429/183587217-efcb31c1-3094-4cf3-ab15-922ec39b0066.gif) -->
---


## Release Notes

### 1.1.2
[Fix] bug  
[Refactor] codes  
[Comment] The existing commands `vs-linker: SaveProjectRoot` and `vs-linker: DeleteProjectRoot` are deprecated for the time being.

### 1.1.1
[Fix] bug

### 1.1.0
[Feat] Add project management in settings.json

### 1.0.1
[Fix] regex in order to better find the link
[Fix] typo


### 1.0.0
Initial release of VS-Linker

