# Logseq Plugin - Integrate Any API

A simple plugin to let users add custom APIs to connect to various services without needing to build a separate plugin for each service. This makes it easier to integrate multiple APIs and manage them within the Logseq environment.

## Why This Plugin?

With the rapid emergence of new services, especially those leveraging LLM models, it’s cumbersome to design a custom plugin for every service performing similar tasks. This plugin offers a quick solution to connect to these services, minimizing the maintenance effort required to keep up with service updates.

## Demo

![demo](./demo.gif)

## Features

- **Add Multiple API Configurations**: Users can add multiple API configurations that will be reflected as commands in the block context menu.

- **Customizable Actions**: When setting up an API, users can define the action to be performed with the response of the request. Currently available actions are:
  - Write Below the Block (Child)
  - Write After the Block (Sibling)
  - Replace Content
  - Do Nothing

- **Dynamic Input**: The block content can be used as an input for the API request by defining `$1` in the body. If the block content is a file, the user can choose to use either:
  - File Path
  - File Content

## How to Configure

1. Open the Logseq commands palette.
2. Invoke the command `Configure My Custom APIs`.
3. This will open a configuration panel where you can define your API details and actions.

## How to Use

1. Right-click on any block to access the context menu.
2. You will see a new item called `My Custom Commands`.
3. Click on it to see a list of your defined APIs.
4. Select an API to perform the request.
5. The response will then be processed according to the action you have defined (e.g., writing the response below the block).

## Limitations

- Currently does not support blob responses (files, images, etc.) to avoid issues as the files should be stored locally and referenced in Logseq.

## Future Enhancements

- Add more response actions
- Add keybindings for quicker access
- Post-process responses to better adapt to Logseq's format
- Support input from multiple blocks

## License

[MIT](https://opensource.org/license/mit)

---

Feel free to contribute to this project by opening issues or submitting pull requests. Your feedback and contributions are always welcome!