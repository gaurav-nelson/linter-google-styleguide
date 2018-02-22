# linter-google-styleguide
An Atom package for the [retext-google-styleguide](https://github.com/gaurav-nelson/retext-google-styleguide) module. It uses the Atom Linter package to highlight errors and provide usage advice while writing and editing documents in Atom. Based on [Google Developer Documentation style guide's word list](https://developers.google.com/style/word-list#word-list) 

## Dependencies
* [Atom](https://atom.io/)
* [Atom Linter Package](https://atom.io/packages/linter)

## Features (v. 1.0.0)
* Highlights incorrect words as you type.
* Option to ignore words by adding them to 'Ignore Words' list in settings.
* Move mouse over an incorrect word to read description and correct word usage.

## Configuration Options
* **Show errors as you type**: This behavior can be changed by unchecking `Lint on Change` checkbox for the Atom Linter package settings. The errors will then only be highlighted when you save the file.
* **Set severity**: The default level is `Warning`. Setting the severity level to `Error` or `Info` helps distinguish its highlighting from the highlighting of an ordinary spell checker, or higher priority linter.
* **Ignore Files**: Add filenames for which you do not want this package to show errors. 
* **Ignore Words**: Add comma-seperated list of words for which you do not want to see errors. 
* **Enable for other filetypes**: Enable it for other filetypes by adding the [scope name](https://atom.io/packages/file-types) for a grammar.
