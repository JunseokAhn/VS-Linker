# VS-Linker

This is a Visual Studio Code extension for linking to files

## Feature

1. link for the asp file

---


## Release Notes

### 1.0.1
Fix regex in order to better find the link
Fix typo


### 1.0.0
Initial release of VS-Linker

---

## Go to include files
You can open the file using Ctl + click.

![openFile1](https://user-images.githubusercontent.com/57289429/182084053-4f2e0b72-e7e5-47db-80e2-c9597a43f63e.gif)


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

![deleteWorkspaceRoot](https://user-images.githubusercontent.com/57289429/183587217-efcb31c1-3094-4cf3-ab15-922ec39b0066.gif)

**Enjoy!**
