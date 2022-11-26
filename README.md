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
    "vs-linker.projects":  [
        {
            //Absolute Directory Path
            "rootPath": "\\\\192.168.1.1\\folderA",
            "regularExpress" : [
                "insert your custom regularExpress"
            ]
        },
        {
            //Volume Drive
            "rootPath": "E:\\folderB",
            "regularExpress" : [
                "insert your custom regularExpress"
            ]
        },
        {
            //Example for ASP
            "rootPath": "P:",
            "regularExpress" : [
                "/<!--(.*?)include(.+?)=(\\s+)?\\\"(?<filename>.*?)\\\"(.*)-->/g",
                "/document.location.href(.\\s?)=(\\s+)?\\\"(?<filename>.*?)\\\"/g",
                "/window.open\\(\\\"(?<filename>.*?)\\?(.*?)\\)/g",
                "/Response.Redirect(\\s+)?\\\"(?<filename>.*?)\\\"/g",
                "/document.location.href(.\\s?)=(\\s+)?\\\"(?<filename>.*?)\\\"/g"
            ]
        },
        {
            //Example for Vue
            "rootPath": "C:\\workspace\\project\\src",
            "regularExpress" : [
                // "/import(.*)from\\s'(?<filename>.*?)';/g",
                "/import(.*)from\\s'@(?<filename>.*?)';/g"
            ]
        },
    ]
}

```


If you use a different regular expression for each root, you can link different languages ​​for each project.



**Enjoy!**

## Release Notes

### 1.1.5
Fixed a bug that prevented extensions from working. sorry!

### 1.1.4
You can now input regular expressions as arrays.

### 1.1.2
The existing commands `vs-linker: SaveProjectRoot` and `vs-linker: DeleteProjectRoot` are deprecated for the time being.
Fix bug.

### 1.1.1
Fix bug.

### 1.1.0
Add project management in settings.json

### 1.0.1
Fix regex in order to better find the link

### 1.0.0
Initial release of VS-Linker

